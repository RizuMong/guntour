import React, { useState, useEffect } from "react";
import { WithRouter } from "utils/Navigation";
import { Helmet } from "react-helmet";
import { apiRequest } from "utils/apiRequest";
import Swal from "sweetalert2";

import { NavbarAdmin, Sidebar } from "components/Navbar";
import { AiFillDelete } from "react-icons/ai";
import { MdExpandMore } from "react-icons/md";

import { ModalAddProduct, ModalEditDataProduct } from "components/ModalAdmin";

const AdminProduct = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [objSubmit, setObjSubmit] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    apiRequest(`admin/product?page=${page}`, "get")
      .then((res) => {
        const results = res.data;
        const loadMore = page + 1;
        const temp = [...data];
        temp.push(...results);
        setData(temp);
        setPage(loadMore);
      })
      .catch((err) => {
        alert(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddProduct = async () => {
    setLoading(true);
    const formData = new FormData();
    for (const key in objSubmit) {
      formData.append(key, objSubmit[key]);
    }
    apiRequest("admin/product", "post", objSubmit, "multipart/form-data")
      .then((res) => {
        const { message } = res;
        Swal.fire({
          icon: "success",
          title: message,
        });
        setObjSubmit({});
      })
      .catch((err) => {
        const { data } = err.response;
        Swal.fire({
          icon: "warning",
          title: data.message,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleEditProduct = async (id_product) => {
    const formData = new FormData();
    for (const key in objSubmit) {
      formData.append(key, objSubmit[key]);
    }
    apiRequest(
      `admin/product/${id_product}`,
      "put",
      objSubmit,
      "multipart/form-data"
    )
      .then((res) => {
        const { message } = res;
        Swal.fire({
          icon: "success",
          title: message,
        });
        setObjSubmit({});
      })
      .catch((err) => {
        const { data } = err.response;
        Swal.fire({
          icon: "warning",
          title: data.message,
        });
      })
      .finally(() => fetchData());
  };

  const handleDelete = (id_product) => {
    apiRequest(`admin/product/${id_product}`, "delete")
      .then((res) => {
        const { message } = res;
        Swal.fire({
          position: "center",
          icon: "success",
          title: message,
          showConfirmButton: true,
        });
      })
      .catch((err) => {
        const { data } = err.response;
        Swal.fire({
          position: "center",
          icon: "warning",
          title: data.message,
          showConfirmButton: true,
        });
      })
      .finally(() => {
        fetchData();
      });
  };

  const handleChange = (value, key) => {
    let temp = { ...objSubmit };
    temp[key] = value;
    setObjSubmit(temp);
  };

  if (loading) {
    return (
      <h2
        id="loading"
        className="text-secondary font-medium text-lg bg-white text-center mt-80"
      >
        Loading Data...
      </h2>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin | GunTour</title>
        <meta name="description" content="App Description" />
      </Helmet>

      <div className="mx-auto grid md:grid-flow-col gap-2">
        <aside className="md:grid-col-span-1">
          <Sidebar />
        </aside>

        <div className="md:grid-col-span-3">
          <NavbarAdmin />
          <div className="divider m-0 mr-14" />

          <div className="mt-10">
            <div className="col-span-2">
              <div className="text-right flex items-center justify-end mt-3 font-medium text-base mr-11">
                <ModalAddProduct
                  onChangeAddProduct={(e) =>
                    handleChange(e.target.files[0], "product_picture")
                  }
                  valueAddProductName={objSubmit.product_name}
                  onChangeAddProductName={(e) =>
                    handleChange(e.target.value, "product_name")
                  }
                  valueAddRent={objSubmit.rent_price}
                  onChangeAddRent={(e) =>
                    handleChange(e.target.value, "rent_price")
                  }
                  valueAddDetail={objSubmit.detail}
                  onChangeAddDetail={(e) =>
                    handleChange(e.target.value, "detail")
                  }
                  valueAddNote={objSubmit.note}
                  onChangeAddNote={(e) => handleChange(e.target.value, "note")}
                  onAddProduct={() => handleAddProduct()}
                />
              </div>

              <div className="overflow-x-auto py-6 mr-11">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th></th>
                      <th className="font-semibold text-base text-secondary">
                        NAME
                      </th>
                      <th className="font-semibold text-base text-secondary">
                        PRICE
                      </th>
                      <th className="font-semibold text-base text-secondary">
                        DESCRIPTION
                      </th>
                      <th className="font-semibold text-base text-secondary">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <>
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      data
                        ?.sort((a, b) => a.id_product - b.id_product)
                        .map((data) => (
                          <tbody>
                            <tr>
                              <th>{data.id_product}</th>
                              <td>
                                <div className="grid grid-cols-1 lg:grid-cols-2">
                                  <div className="flex">
                                    <img
                                      src={data.product_picture}
                                      alt={data.product_name}
                                      className="max-w-xl h-14 w-14 rounded-lg"
                                    />
                                    <p className="ml-5 mt-4">
                                      {data.product_name}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td>{data.rent_price}/day</td>
                              <td>{data.detail}</td>
                              <td>
                                <div className="flex items-center text-sm">
                                  <button className="text-2xl text-gray-600">
                                    <ModalEditDataProduct
                                      onChangeProduct={(e) =>
                                        handleChange(
                                          e.target.files[0],
                                          "product_picture"
                                        )
                                      }
                                      valueProductName={objSubmit.product_name}
                                      onChangeProductName={(e) =>
                                        handleChange(
                                          e.target.value,
                                          "product_name"
                                        )
                                      }
                                      valueRent={objSubmit.rent_price}
                                      onRent={(e) =>
                                        handleChange(
                                          e.target.value,
                                          "rent_price"
                                        )
                                      }
                                      valueDescProduct={objSubmit.detail}
                                      onDescProduct={(e) =>
                                        handleChange(e.target.value, "detail")
                                      }
                                      valueNoteProduct={objSubmit.note}
                                      onNoteProduct={(e) =>
                                        handleChange(e.target.value, "note")
                                      }
                                      onEditProduct={() =>
                                        handleEditProduct(data.id_product)
                                      }
                                    />
                                  </button>
                                  <button
                                    id={data.id_product}
                                    onClick={() =>
                                      handleDelete(data?.id_product)
                                    }
                                  >
                                    <AiFillDelete className="fill-red-600 text-3xl mr-14 ml-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        ))
                    )}
                  </>
                </table>
                <div className="text-right flex items-center justify-end font-medium text-base mr-10 mt-3">
                  <button onClick={() => fetchData()}>Load More</button>
                  <MdExpandMore className="text-secondary text-xl ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithRouter(AdminProduct);
