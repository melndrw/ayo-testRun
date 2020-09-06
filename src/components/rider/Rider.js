import React, { useState, useEffect } from 'react';

import firebase from '../config/firebaseConfig';

import {
  PlusOutlined,
  UnlockOutlined,
  LockOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  PushpinOutlined,
} from '@ant-design/icons';
import {
  Divider,
  Modal,
  Button,
  Input,
  Form,
  Table,
  notification,
  message,
  Space,
} from 'antd';
import { useSelector } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { useFirestoreConnect } from 'react-redux-firebase';
import axios from 'axios';
import moment from 'moment';
import Orders from '../transactions/Orders';

const { Column, ColumnGroup } = Table;

const { confirm } = Modal;

const Rider = ({ riders, history }) => {
  useFirestoreConnect([
    {
      collection: 'Transactions',
    },
    {
      collection: 'Accounts',
    },
  ]);

  const accounts = useSelector((state) => state.firestore.ordered.Accounts);

  const transactions = useSelector(
    (state) => state.firestore.ordered.Transactions
  );

  const rder = accounts?.filter((account) => account.role === 'rider');
  // obtain all transactions with success status
  const success = transactions?.filter((trans) => trans.status === 'completed');

  // obtain the customer's id
  const customer = accounts?.filter((account) => account.role === 'customer');

  const [totalRiders, setTotalRiders] = useState([]);

  const [ridr, setRidr] = useState(null);

  const [visible, setVisible] = useState(false);

  const [riderModal, setRiderModal] = useState({
    visible: false,
    data: [],
  });

  const [orderDetais, setOrderDetails] = useState({
    visible: false,
    data: [],
  });

  const [form] = Form.useForm();

  useEffect(() => {
    setTotalRiders(rder);
  }, [accounts]);

  const dateNow = new Date();

  // Today rider bookings
  const bookingToday = transactions
    ?.filter(
      (transaction) =>
        transaction.rider &&
        moment(transaction.datetime_created).format('MMMM D YYYY') ==
          moment(dateNow).format('MMMM D YYYY')
    )
    .map((transaction) => {
      const str = transaction.rider.ref;
      const riderId = str.split(/[/ ]+/).pop();
      const tRider = { riderId, total: 1 };
      return tRider;
    });

  const todayBookings = bookingToday?.reduce((callback, currentValue) => {
    if (callback[currentValue.riderId]) {
      callback[currentValue.riderId].total++;
    } else {
      callback[currentValue.riderId] = currentValue;
    }
    return callback;
  }, {});

  // Total rider bookings
  const bookingTotal = transactions
    ?.filter((transaction) => transaction.rider)
    .map((transaction) => {
      const str = transaction.rider.ref;
      const riderId = str.split(/[/ ]+/).pop();
      const tRider = { riderId, total: 1 };
      return tRider;
    });

  const totalBookings = bookingTotal?.reduce((callback, currentValue) => {
    if (callback[currentValue.riderId]) {
      callback[currentValue.riderId].total++;
    } else {
      callback[currentValue.riderId] = currentValue;
    }
    return callback;
  }, {});

  const auth = useSelector((state) => state.firebase.auth);

  // authentication
  if (!auth.uid) return <Redirect to="/login" />;

  const showRiderModal = (record) => {
    setRiderModal({
      visible: true,
      data: [record],
    });
  };

  const columns = [
    {
      title: 'Total Bookings',
      dataIndex: 'bookings_total',
    },
    {
      title: 'Todays Bookings',
      dataIndex: 'bookings_today',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <Space size="small">
          <a onClick={() => showRiderModal(record)}>{record.name}</a>
        </Space>
      ),
    },
    {
      title: 'Phone Number',
      dataIndex: 'contact_no',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
    },
  ];

  const editRider = (id) => {
    const targetRider = totalRiders.find(
      (totalRiders) => totalRiders.id === id
    );
    setRidr(targetRider);
    const { firstName, lastName, address, contact_no } = targetRider;
    form.setFieldsValue({
      id: id,
      firstName: firstName,
      lastName: lastName,
      address: address,
      contact_no: contact_no,
    });
    setVisible(true);
  };
  const enableRider = (id) => {
    const uid = id;
    confirm({
      title: `Enable Rider?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Rider credentials will be authorized',
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk() {
        axios
          .patch(
            `https://us-central1-lpg-ph2020.cloudfunctions.net/api/user/enable/${uid}`
          )
          .then((res) =>
            firebase
              .firestore()
              .collection('Accounts')
              .doc(res.data.uid)
              .update({ disabled: false })
              .then((resp) => message.success('Rider enabled!'))
              .catch((err1) => message.error(err1.message))
          )
          .catch((err) => message.error(err.message));
      },
      onCancel() {
        return null;
      },
    });
  };

  const disableRider = (id) => {
    const uid = id;
    confirm({
      title: `Disable Rider?`,
      icon: <ExclamationCircleOutlined />,
      content: 'Rider will not be able to log in!',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        axios
          .patch(
            `https://us-central1-lpg-ph2020.cloudfunctions.net/api/user/disable/${uid}`
          )
          .then((res) =>
            firebase
              .firestore()
              .collection('Accounts')
              .doc(res.data.uid)
              .update({ disabled: true })
              .then((resp) => message.success('Rider disabled!'))
              .catch((err1) => message.error(err1.message))
          )
          .catch((err) => message.error(err.message));
      },
      onCancel() {
        return null;
      },
    });
  };

  const handleSubmit = (values) => {
    const { id, firstName, lastName, address, contact_no } = values;
    firebase
      .firestore()
      .collection('Accounts')
      .doc(id)
      .update({
        firstName,
        lastName,
        address,
        contact_no,
      })
      .then((res) => {
        console.log('Rider Updated');
      })
      .catch((err) => console.log(err.message));
    form.resetFields();
    setVisible(false);
    // console.log('Success', values);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRidr({ ...ridr, [name]: value });
  };
  const handleCancel = () => {
    setVisible(false);
    setRiderModal((prevState) => {
      return { ...prevState, visible: false };
    });
  };

  // Details button at Rider Modal
  const handlerDetailsCancel = () => {
    setOrderDetails((prevState) => {
      return {
        ...prevState,
        visible: false,
      };
    });
  };
  const handlerOnDetails = (data) => {
    setOrderDetails({
      visible: true,
      data: data,
    });
  };

  // Actions buttons
  const allRiders =
    riders &&
    riders.map((rider, idx) => ({
      key: idx,
      id: rider.id,
      // obtain the id to target the specific rider
      bookings_total: (
        <span style={{ textAlign: 'center' }}>
          {totalBookings &&
            Object.values(totalBookings).map((tl) => {
              if (tl.riderId == rider.id) {
                return tl.total;
              }
            })}
        </span>
      ),
      bookings_today: (
        <span style={{ textAlign: 'center' }}>
          {todayBookings &&
            Object.values(todayBookings).map((tl) => {
              if (tl.riderId == rider.id) {
                return tl.total;
              }
            })}
        </span>
      ),
      name: (
        <span style={{ textTransform: 'capitalize' }}>
          {rider.firstName + ' ' + rider.lastName}
        </span>
      ),
      contact_no: rider.contact_no,
      address: rider.address,
      actions: (
        <>
          {' '}
          <Button
            onClick={() => editRider(rider.id)}
            style={{ marginRight: 5 }}
            shape="circle"
          >
            <EditOutlined />
          </Button>
          {rider.disabled ? (
            <Button
              onClick={() => enableRider(rider.id)}
              shape="circle"
              type="primary"
              danger
            >
              <UnlockOutlined />
            </Button>
          ) : (
            <Button
              onClick={() => disableRider(rider.id)}
              shape="circle"
              type="primary"
            >
              <LockOutlined />
            </Button>
          )}
        </>
      ),
    }));

  const riderId = riderModal.data.map((data) => data.id);
  const filterSource =
    success &&
    success?.filter((item) => item.rider.ref === `Accounts/${riderId}`);

  const riderSource = filterSource?.map((rider, idx) => {
    const customerFilter = customer?.filter(
      (item) => rider.information.customer.ref === `Accounts/${item.id}`
    );
    return {
      key: idx,
      transaction: rider.id,
      date: new Date(rider.datetime_created.seconds * 1000).toLocaleString(),
      customer:
        customerFilter &&
        `${customerFilter[0].firstName} ${customerFilter[0].lastName}`,
      total: rider.total,
      orders: rider.orders['product-0'],
    };
  });
  return (
    <div>
      <React.Fragment>
        <Table columns={columns} dataSource={allRiders} size="large" />
        <Modal
          title="Edit Rider"
          visible={visible}
          className="storedetails_modal"
          width="600px"
          onCancel={handleCancel}
        >
          <Form {...layout} form={form} onFinish={handleSubmit}>
            <Form.Item
              name="id">
                <Input type="hidden" name="id"/>
              </Form.Item>
            <Form.Item
              label="First name"
              name="firstName"
              rules={[
                {
                  required: true,
                  message: 'First name is required!',
                },
              ]}
            >
              <Input name="firstName" onChange={(e) => handleChange(e)} />
            </Form.Item>

            <Form.Item
              label="Last name"
              name="lastName"
              rules={[
                {
                  required: true,
                  message: 'Last name is required!',
                },
              ]}
            >
              <Input name="lastName" onChange={(e) => handleChange(e)} />
            </Form.Item>

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
              <Input name="address" onChange={(e) => handleChange(e)} />
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
              <Input name="contact_no" onChange={(e) => handleChange(e)} />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title={riderModal.data.map((data) => {
            return data.name;
          })}
          onCancel={handleCancel}
          visible={riderModal.visible}
          width={1000}
        >
          <Table
            dataSource={riderSource}
            pagination={{ pageSize: 7, showSizeChanger: false }}
          >
            <ColumnGroup title="Transactions">
              <Column
                title="Transactions No."
                dataIndex="transaction"
                key="transaction"
              />

              <Column title="Date" dataIndex="date" key="date" />
            </ColumnGroup>

            <Column title="Customers" dataIndex="customer" key="customer" />

            <Column title="Total Amount" key="total" dataIndex="total" />

            <Column
              title="Action"
              key="action"
              render={(text, record) => {
                const data =
                  record &&
                  record.orders.map((item) => {
                    return {
                      productName: item.productName,
                      description: item.description,
                      price: item.price,
                      url: item.url,
                    };
                  });
                return (
                  <Space size="middle">
                    <Button
                      type="primary"
                      shape="round"
                      icon={<PushpinOutlined />}
                      onClick={() => handlerOnDetails(data)}
                    >
                      Details
                    </Button>
                  </Space>
                );
              }}
            />
          </Table>
        </Modal>
        <Orders
          onCancel={handlerDetailsCancel}
          visible={orderDetais.visible}
          dataSource={orderDetais.data}
        />
      </React.Fragment>
    </div>
  );
};

export default withRouter(Rider);

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
