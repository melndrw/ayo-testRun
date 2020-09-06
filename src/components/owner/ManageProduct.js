import React, { useState, useEffect } from "react";

import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Form,
  notification,
  Row,
  Col,
  Table,
  Modal,
} from "antd";
import MoonLoader from "react-spinners/MoonLoader";

import {
  useFirestoreConnect,
  useFirestore,
  useFirebase,
} from "react-redux-firebase";
import { useSelector, useDispatch } from "react-redux";
import { addProductByOwner } from "../store/actions/storeActions";
import { Redirect } from "react-router-dom";

const { confirm } = Modal;

const ManageProduct = () => {
  const [form] = Form.useForm();

  const [productDetail, setProductDetail] = useState();

  const [file, setFile] = useState();

  const [imgFile, setImgFile] = useState();

  const [targetStore, setTargetStore] = useState();

  const [isLoading, setLoading] = useState();

  const [message, setMessage] = useState();

  const firestore = useFirestore();

  const firebase = useFirebase();

  useFirestoreConnect("Stores");

  const storeId = useSelector(state => state.firebase.auth.uid);

  const dispatch = useDispatch();

  const auth = useSelector(state => state.firebase.auth);

  const allStores = useSelector(state => state.firestore.ordered.Stores);

  useEffect(() => {
    const target = allStores && allStores.filter(store => store.id === storeId);
    setTargetStore(target);
  }, [allStores]);

  useEffect(() => {
    setMessage();
    return () => {
      message && openNotification("topRight");
    };
  }, [message]);

  const handleSubmit = () => {
    setLoading(true);
    setMessage();
    dispatch(
      addProductByOwner(
        { firebase, firestore },
        storeId,
        productDetail,
        imgFile,
        msg => {
          setLoading(false);
          setMessage(msg);
        }
      )
    );
    form.resetFields();
    setProductDetail(false);
    setFile(null);
    setImgFile(URL.revokeObjectURL(file));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProductDetail({ ...productDetail, [name]: value });
  };

  const handleImg = e => {
    const imgFile = e.target.files[0];

    if (imgFile) {
      setFile(URL.createObjectURL(imgFile));
    }

    setImgFile(imgFile);
  };

  // if user is not logged in
  if (!auth.uid) return <Redirect to="/login" />;

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
    },
    {
      title: "Price",
      dataIndex: "price",
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Image Url",
      dataIndex: "url",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const editProd = () => {};

  const deleteProd = product => {
    confirm({
      title: `Delete product?`,
      icon: <ExclamationCircleOutlined />,
      content: "You will not be able to revert this!",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        firestore
          .collection("Stores")
          .doc(storeId)
          .update({
            products: firebase.firestore.FieldValue.arrayRemove({
              productName: product.productName,
              price: product.price,
              description: product.description,
              url: product.url,
            }),
          });
      },
      onCancel() {
        return null;
      },
    });
  };

  const allProducts =
    targetStore &&
    targetStore[0].products &&
    targetStore[0].products.map((product, idx) => ({
      key: idx,
      productName: (
        <span style={{ textTransform: "capitalize" }}>
          {product.productName}
        </span>
      ),
      price: product.price,
      description: product.description,
      url: product.url.includes("no url") ? null : (
        <a href={product.url} target="_blank">
          View Image{" "}
        </a>
      ),
      action: (
        <>
          {/* <Button onClick={() => 
                                editProd(idx)} 
                                    style={{marginRight: 5}}
                                    shape="circle"> 
                                    <EditOutlined />
                                </Button>  */}
          <Button onClick={() => deleteProd(product)} shape="circle">
            <DeleteOutlined />
          </Button>
        </>
      ),
    }));

  const renderForm = () => {
    return (
      <div className="stores">
        <Row gutter={24} justify="space-around">
          <Col span={12}>
            <Table columns={columns} dataSource={allProducts} size="middle" />
          </Col>
          <Col span={10}>
            <h2>Add Product</h2>
            <Form {...layout} form={form} onFinish={handleSubmit}>
              <Form.Item
                label="Image"
                style={{ alignItems: "center", marginTop: "2rem" }}
              >
                <input
                  type="file"
                  name="img"
                  onChange={e => handleImg(e)}
                  style={{ display: "inline-block", width: "calc(50% - 8px)" }}
                />
                {file && (
                  <img
                    src={file}
                    style={{
                      height: "100px",
                      display: "inline-block",
                      width: "calc(30% - 8px)",
                      margin: "0 8px",
                    }}
                    alt=""
                  />
                )}
              </Form.Item>

              <Form.Item
                label="Product Name"
                name="productName"
                rules={[
                  {
                    required: true,
                    message: "Product name is required!",
                  },
                ]}
              >
                <Input name="productName" onChange={e => handleChange(e)} />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Price is required!",
                  },
                ]}
              >
                <Input name="price" onChange={e => handleChange(e)} />
              </Form.Item>

              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: "Descrition is required!",
                  },
                ]}
              >
                <Input.TextArea
                  name="description"
                  onChange={e => handleChange(e)}
                  placeholder="e.g net weight 11kg"
                />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </div>
    );
  };

  const renderLoading = () => {
    return (
      <div className="centerLoader">
        <MoonLoader loading={true} color="#43DABC" />
      </div>
    );
  };

  const openNotification = placement => {
    if (message === "success") {
      return notification.success({
        message: "Notification",
        description: "Product Added!",
        placement,
        duration: 1.5,
      });
    }

    if (message !== "success") {
      return notification.error({
        message: "Notification",
        description: "Ops, something went wrong!",
        placement,
        duration: 1.5,
      });
    }
  };

  return (
    <>
      {isLoading && renderLoading()}
      {targetStore ? renderForm() : renderLoading()}
    </>
  );
};

export default ManageProduct;

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 6,
  },
};
