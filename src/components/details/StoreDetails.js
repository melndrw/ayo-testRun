import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { Divider, Modal, Button, Input, Form, Table, notification } from 'antd';
import MoonLoader from 'react-spinners/MoonLoader';

import { useSelector, useDispatch } from 'react-redux';
import { withRouter, Redirect, Link } from 'react-router-dom';
import {
  useFirestoreConnect,
  useFirestore,
  useFirebase,
} from 'react-redux-firebase';

import StoresNav from '../stores/StoresNav';
import StoreTime from '../stores/StoreTime';
import {
  addProduct,
  editProduct,
  editStoreAction,
} from '../store/actions/storeActions';
import UploadFile from '../stores/UploadFile';

const { confirm } = Modal;

const StoreDetails = (props) => {
  const id = props.match.params.id;

  const [visibleStore, setVisibleStore] = useState(false);

  const [visible, setVisible] = useState(false);

  const [visibleEdit, setVisibleEdit] = useState(false);

  const [targetStore, setTargetStore] = useState();

  const [targetStoreNew, setTargetStoreNew] = useState();

  const [productDetail, setProductDetail] = useState();

  const [productDetailReplace, setProductDetailReplace] = useState();

  const [imgFile, setImgFile] = useState();

  const [imgFileEdit, setImgFileEdit] = useState();

  const [file, setFile] = useState();

  const [fileEdit, setFileEdit] = useState();

  const [isLoading, setLoading] = useState();

  const [editUpload, setEditUpload] = useState();

  const dispatch = useDispatch();

  const firestore = useFirestore();

  const firebase = useFirebase();

  const [message, setMessage] = useState();

  const [form] = Form.useForm();

  const [formStore] = Form.useForm();

  const [formEdit] = Form.useForm();

  useFirestoreConnect('Stores');

  const allStores = useSelector((state) => state.firestore.ordered.Stores);

  useEffect(() => {
    const target = allStores && allStores.filter((store) => store.id === id);
    setTargetStore(target);
  }, [allStores]);

  useEffect(() => {
    setMessage();
    return () => {
      message && openNotification('topRight');
    };
  }, [message]);

  // Redirect if not logged
  const auth = useSelector((state) => state.firebase.auth);
  if (!auth.uid) return <Redirect to="/login" />;

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'productName',
    },
    {
      title: 'Price',
      dataIndex: 'price',
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Image Url',
      dataIndex: 'url',
    },
    {
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  // Delete Store
  const deleteStore = () => {
    confirm({
      title: `Delete Store?`,
      icon: <ExclamationCircleOutlined />,
      content: 'You will not be able to revert this!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const storeId = targetStore[0].id;
        firestore
          .collection('Stores')
          .doc(storeId)
          .delete()
          .then((res) => {
            openNotificationDelete('topRight');
          })
          .catch((err) => {
            console.log(err);
          });
        return props.history.push('/stores');
      },
      onCancel() {
        return null;
      },
    });
  };

  // Delete product
  const deleteProd = (product) => {
    confirm({
      title: `Delete product?`,
      icon: <ExclamationCircleOutlined />,
      content: 'You will not be able to revert this!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const storeId = targetStore[0].id;

        firestore
          .collection('Stores')
          .doc(storeId)
          .update({
            products: firebase.firestore.FieldValue.arrayRemove({
              productName: product.productName,
              price: product.price,
              description: product.description,
              url: product.url,
            }),
          })
          .then((res) => openNotificationDelete('topRight'))
          .catch((err) => console.log(err.message));
      },
      onCancel() {
        return null;
      },
    });
  };

  const editStore = () => {
    setTargetStoreNew(targetStore[0]);
    formStore.setFieldsValue({
      name: targetStore[0].name,
      owner: targetStore[0].owner,
      landmark: targetStore[0].landmark,
      address: targetStore[0].address,
      contact_no: targetStore[0].contact_no,
      coordinates: targetStore[0].coordinates,
      OpeningandClosing: targetStore[0].OpeningandClosing,
    });
    setVisibleStore(true);
  };

  const editProd = (idx) => {
    const targetProd = targetStore[0].products[idx];
    // copy to delete
    setProductDetail(targetProd);
    // copy to replace
    setProductDetailReplace(targetProd);
    formEdit.setFieldsValue({
      productName: targetProd.productName,
      price: targetProd.price,
      url: targetProd.url,
      description: targetProd.description,
    });
    setVisibleEdit(true);
  };

  const handleSubmit = () => {
    setLoading(true);
    setMessage();
    const prodId = targetStore[0].id;
    dispatch(
      addProduct(
        { firebase, firestore },
        productDetail,
        prodId,
        imgFile,
        (msg) => {
          setLoading(false);
          setMessage(msg);
        }
      )
    );
    form.resetFields();
    setProductDetail(false);
    setProductDetailReplace(false);
    setVisible(false);
    setFile(null);
    setImgFile(URL.revokeObjectURL(file));
  };

  const handleEdit = () => {
    setLoading(true);
    setMessage();
    const prodId = targetStore[0].id;
    dispatch(
      editProduct(
        { firebase, firestore },
        productDetail,
        productDetailReplace,
        prodId,
        imgFileEdit,
        (msg) => {
          setLoading(false);
          setMessage(msg);
        }
      )
    );
    formEdit.resetFields();
    setProductDetail();
    setProductDetailReplace();
    setFileEdit();
    setImgFileEdit(URL.revokeObjectURL(imgFileEdit));
    setVisibleEdit(false);
  };

  const handleStore = (info) => {
    setLoading(true);
    setMessage();
    const storeId = targetStore[0].id;
    const { weekdays, saturday, sunday } = info;
    const openAndClose = {
      weekdays: {
        opening: weekdays[0]._d.toLocaleTimeString(),
        closing: weekdays[1]._d.toLocaleTimeString(),
      },
      saturday: {
        opening: saturday[0]._d.toLocaleTimeString(),
        closing: saturday[1]._d.toLocaleTimeString(),
      },
      sunday: {
        opening: sunday[0]._d.toLocaleTimeString(),
        closing: sunday[1]._d.toLocaleTimeString(),
      },
    };
    dispatch(
      editStoreAction(
        { firestore },
        storeId,
        targetStoreNew,
        openAndClose,
        editUpload,
        (msg) => {
          setLoading(false);
          setMessage(msg);
        }
      )
    );
    setVisibleStore(false);
  };
  const handleCancel = () => {
    setVisible(false);
    setVisibleStore(false);
    setVisibleEdit(false);
    setFileEdit();
    setImgFileEdit();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetail({ ...productDetail, [name]: value });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setProductDetailReplace({ ...productDetailReplace, [name]: value });
  };

  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setTargetStoreNew({ ...targetStoreNew, [name]: value });
  };

  const handleImg = (e) => {
    const imgFile = e.target.files[0];

    if (imgFile) {
      setFile(URL.createObjectURL(imgFile));
    }

    setImgFile(imgFile);
  };

  const handleImgReplace = (e) => {
    const imgFileEdit = e.target.files[0];

    if (imgFileEdit) {
      setFileEdit(URL.createObjectURL(imgFileEdit));
    }

    setImgFileEdit(imgFileEdit);
  };

  const handleUpload = (isValid) => {
    setEditUpload(isValid.file);
    return isValid.file;
  };

  const allProducts =
    targetStore &&
    targetStore[0].products &&
    targetStore[0].products.map((product, idx) => ({
      key: idx,
      productName: (
        <span style={{ textTransform: 'capitalize' }}>
          {product.productName}
        </span>
      ),
      price: product.price,
      description: product.description,
      url: product.url.includes('no url') ? null : (
        <a href={product.url} target="_blank">
          View Image{' '}
        </a>
      ),
      action: (
        <>
          <Button
            onClick={() => editProd(idx)}
            style={{ marginRight: 5 }}
            shape="circle"
          >
            <EditOutlined />
          </Button>
          <Button onClick={() => deleteProd(product)} shape="circle">
            <DeleteOutlined />
          </Button>
        </>
      ),
    }));

  const renderStore = () => {
    const {
      owner,
      name,
      address,
      landmark,
      contact_no,
      coordinates,
    } = targetStore[0];
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <Button onClick={editStore} style={{ marginRight: 5 }}>
            <EditOutlined style={{ marginRight: 5 }} />
            Edit Store
          </Button>
          <Button danger onClick={() => deleteStore()}>
            Delete Store
          </Button>
        </div>
        <Divider orientation="left" style={{ textTransform: 'uppercase' }}>
          {name}{' '}
        </Divider>
        <p style={{ textTransform: 'capitalize' }}>Owner: {owner}</p>
        <p style={{ textTransform: 'capitalize' }}>
          Location: {landmark}, {address}
        </p>
        <p style={{ textTransform: 'capitalize' }}>Contact No: {contact_no}</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setVisible(true)}
          style={{ float: 'right' }}
        >
          Add Product
        </Button>
        <Table
          columns={columns}
          dataSource={allProducts}
          size="middle"
          style={{ paddingTop: 40 }}
        />
      </>
    );
  };

  const renderLoading = () => {
    return (
      <div className="centerLoader">
        <MoonLoader loading={true} color="#43DABC" />
      </div>
    );
  };

  const openNotification = (placement) => {
    if (message === 'success') {
      return notification.success({
        message: 'Notification',
        description: 'Action success',
        placement,
        duration: 1.5,
      });
    }

    if (message !== 'success') {
      return notification.error({
        message: 'Notification',
        description: 'Ops, something went wrong!',
        placement,
        duration: 1.5,
      });
    }
  };

  const openNotificationDelete = (placement) => {
    return notification.success({
      message: 'Notification',
      description: 'Successfully deleted',
      placement,
      duration: 1.5,
    });
  };

  const defaultTime = () => {
    if (targetStore === null) return;
    if (targetStore) {
      if (targetStore[0].OpeningandClosing !== undefined) {
        const {
          weekdays,
          saturday,
          sunday,
        } = targetStore[0].OpeningandClosing[0];
        return {
          weekdays: [
            moment(weekdays.opening, 'h:mm a'),
            moment(weekdays.closing, 'h:mm a'),
          ],
          saturday: [
            moment(saturday.opening, 'h:mm a'),
            moment(saturday.closing, 'h:mm a'),
          ],
          sunday: [
            moment(sunday.opening, 'h:mm a'),
            moment(sunday.closing, 'h:mm a'),
          ],
        };
      } else {
        return {
          weekdays: [
            moment('9:00:00 AM', 'h:mm a'),
            moment('5:00:00 PM', 'h:mm a'),
          ],
          saturday: [
            moment('9:00:00 AM', 'h:mm a'),
            moment('5:00:00 PM', 'h:mm a'),
          ],
          sunday: [
            moment('9:00:00 AM', 'h:mm a'),
            moment('5:00:00 PM', 'h:mm a'),
          ],
        };
      }
    }
  };
  return (
    <>
      <StoresNav />
      <div className="store_details">
        {isLoading && renderLoading()}
        {targetStore ? renderStore() : renderLoading()}
      </div>
      {/* Edit store modal */}
      <Modal
        title="Edit Store"
        visible={visibleStore}
        className="storedetails_modal"
        width="600px"
        onCancel={handleCancel}
      >
        <Form {...layout} form={formStore} onFinish={handleStore}>
          <Form.Item
            label="Store Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Store name is required!',
              },
            ]}
          >
            <Input name="name" onChange={(e) => handleStoreChange(e)} />
          </Form.Item>

          <Form.Item
            label="Owner"
            name="owner"
            rules={[
              {
                required: true,
                message: 'Owner is required!',
              },
            ]}
          >
            <Input name="owner" onChange={(e) => handleStoreChange(e)} />
          </Form.Item>

          <Form.Item
            label="Contact No"
            name="contact_no"
            rules={[
              {
                required: true,
                message: 'Contact number is required!',
              },
            ]}
          >
            <Input name="contact_no" onChange={(e) => handleStoreChange(e)} />
          </Form.Item>
          <Form.Item
            label="Landmark"
            name="landmark"
            rules={[
              {
                required: true,
                message: 'Landmark is required!',
              },
            ]}
          >
            <Input name="landmark" onChange={(e) => handleStoreChange(e)} />
          </Form.Item>
          <UploadFile
            onHandleChange={handleUpload}
            extra="Please upload one image file only"
            defaultList={
              targetStore
                ? targetStore[0].coverPhoto !== undefined && [
                    {
                      uid: targetStore[0].coverPhoto.uid,
                      name: targetStore[0].coverPhoto.fileName,
                      url: targetStore[0].coverPhoto.url,
                    },
                  ]
                : null
            }
          />
          <p style={{ textAlign: 'center' }}>
            Opening and Closing Time(Business Hours)
          </p>
          <StoreTime
            weekdays={defaultTime() !== undefined && defaultTime().weekdays}
            sunday={defaultTime() !== undefined && defaultTime().sunday}
            saturday={defaultTime() !== undefined && defaultTime().saturday}
          />
          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: true,
                message: 'Address is required!',
              },
            ]}
          >
            <Input name="address" disabled />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit product modal */}
      <Modal
        title="Edit Store"
        visible={visibleEdit}
        className="storedetails_modal"
        onCancel={handleCancel}
      >
        <Form {...layout} form={formEdit} onFinish={handleEdit}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[
              {
                required: true,
                message: 'Product name is required!',
              },
            ]}
          >
            <Input name="productName" onChange={(e) => handleEditChange(e)} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: 'Price is required!',
              },
            ]}
          >
            <Input name="price" onChange={(e) => handleEditChange(e)} />
          </Form.Item>
          <Form.Item label="Image">
            <input
              type="file"
              name="img"
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
              onChange={(e) => handleImgReplace(e)}
            />
            {fileEdit ? (
              <img
                src={fileEdit}
                style={{
                  height: '30px',
                  display: 'inline-block',
                  width: 'calc(30% - 8px)',
                  margin: '0 8px',
                }}
                alt=""
              />
            ) : (
              productDetailReplace && (
                <img
                  src={productDetailReplace.url}
                  style={{
                    height: '30px',
                    display: 'inline-block',
                    width: 'calc(30% - 8px)',
                    margin: '0 8px',
                  }}
                  alt=""
                />
              )
            )}
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: 'Descrition is required!',
              },
            ]}
          >
            <Input.TextArea
              name="description"
              onChange={(e) => handleEditChange(e)}
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add product modal */}
      <Modal
        title="Add Product"
        visible={visible}
        className="storedetails_modal"
        onCancel={handleCancel}
      >
        <Form {...layout} form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Product Name"
            name="productName"
            rules={[
              {
                required: true,
                message: 'Product name is required!',
              },
            ]}
          >
            <Input name="productName" onChange={(e) => handleChange(e)} />
          </Form.Item>

          <Form.Item
            label="Price"
            name="price"
            rules={[
              {
                required: true,
                message: 'Price is required!',
              },
            ]}
          >
            <Input name="price" onChange={(e) => handleChange(e)} />
          </Form.Item>
          <Form.Item label="Image">
            <input
              type="file"
              name="img"
              onChange={(e) => handleImg(e)}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            />
            {file && (
              <img
                src={file}
                style={{
                  height: '30px',
                  display: 'inline-block',
                  width: 'calc(30% - 8px)',
                  margin: '0 8px',
                }}
                alt=""
              />
            )}
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              {
                required: true,
                message: 'Descrition is required!',
              },
            ]}
          >
            <Input.TextArea
              name="description"
              onChange={(e) => handleChange(e)}
              placeholder="e.g net weight 11kg"
            />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default withRouter(StoreDetails);

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
