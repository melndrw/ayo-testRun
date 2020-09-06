import React, { useState, useEffect } from "react";

import MoonLoader from "react-spinners/MoonLoader";
import { Modal, Button, Input, Form, Menu, notification } from "antd";
import {
  AppstoreAddOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UnlockOutlined,
} from "@ant-design/icons";

import { SettingOutlined } from "@ant-design/icons";
import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { registerAdmin } from "../store/actions/authActions";

import { logout } from "../store/actions/authActions";

const { SubMenu } = Menu;

const LoggedNav = () => {
  const firebase = useFirebase();

  const firestore = useFirestore();

  const profile = useSelector(state => state.firebase.profile);

  const { firstName, lastName } = profile;

  const [newAdmin, setNewAdmin] = useState();

  const [isLoading, setLoading] = useState();

  const [message, setMessage] = useState();

  const [visible, setVisible] = useState(false);

  const [visibleCPass, setVisibleCPass] = useState(false);

  const [form] = Form.useForm();

  const [formPassword] = Form.useForm();

  const dispatch = useDispatch();

  const role = useSelector(state => state.firebase.profile.role);

  useEffect(() => {
    setMessage();
    return () => {
      message && openNotification("topRight");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const handleSubmit = () => {
    setMessage();
    dispatch(
      registerAdmin({ firebase, firestore }, newAdmin, msg => {
        setMessage(msg);
      })
    );
    setVisible(false);
    form.resetFields();
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  const handleCancel = () => {
    setVisible(false);
    setVisibleCPass(false);
  };

  const handleLogout = () => {
    dispatch(logout({ firebase }));
  };

  // Change password
  const handleChangePass = value => {
    setLoading(true);
    var user = firebase.auth().currentUser;
    const newPassword = value.password;
    const currentPassword = value.currentPassword;
    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    user
      .reauthenticateWithCredential(credential)
      .then(function () {
        // User re-authenticated.
        user
          .updatePassword(newPassword)
          .then(function () {
            // Update successful.
            setLoading(false);
            return notification.success({
              message: "Notification",
              description: "Password successfully changed!",
              placement: "topRight",
              duration: 2.5,
            });
          })
          .catch(function (error) {
            // An error happened.
            setLoading(false);
            return notification.error({
              message: `Notification`,
              description: error.message,
              placement: "topRight",
              duration: 2.5,
            });
          });
      })
      .catch(function (error) {
        // An error happened.
        setLoading(false);
        return notification.error({
          message: "Notification",
          description: "Current password is incorrect!",
          placement: "topRight",
          duration: 2.5,
        });
      });
    formPassword.resetFields();
    setVisibleCPass(false);
  };

  const openNotification = placement => {
    if (message === "success") {
      return notification.success({
        message: "Notification",
        description: "Successfully added new admin.",
        placement,
        duration: 1.5,
      });
    }
    if (message === "fail") {
      return notification.error({
        message: `Notification`,
        description: "The email address is already in use by another account.",
        placement,
        duration: 1.5,
      });
    }
  };

  const renderLoading = () => {
    return (
      <div className="centerLoader">
        <MoonLoader loading={true} color="#43DABC" />
      </div>
    );
  };
  return (
    <>
      {isLoading && renderLoading()}
      <Menu mode="horizontal" style={{ marginRight: 50 }}>
        {role === "admin" ? (
          <Menu.Item key="app" icon={<AppstoreAddOutlined />}>
            <Link to="/addstore">New Store</Link>
          </Menu.Item>
        ) : null}
        <SubMenu
          icon={<SettingOutlined />}
          title={profile.isEmpty ? "Loading" : firstName + " " + lastName}
          style={{ textTransform: "capitalize" }}
        >
          {role === "admin" ? (
            <Menu.Item
              key="setting:1"
              icon={<UserAddOutlined />}
              onClick={() => setVisible(true)}
            >
              Add Admin
            </Menu.Item>
          ) : null}
          <Menu.Item
            key="setting:2"
            icon={<UnlockOutlined />}
            onClick={() => setVisibleCPass(true)}
          >
            Change Password
          </Menu.Item>
          <Menu.Item
            key="setting:3"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Menu.Item>
        </SubMenu>
      </Menu>

      {/* modal  */}
      <Modal
        title="Add Admin"
        visible={visible}
        className="storedetails_modal"
        onCancel={handleCancel}
      >
        <Form {...layout} form={form} onFinish={handleSubmit}>
          <Form.Item
            label="First Name"
            name="firstname"
            rules={[
              {
                required: true,
                message: "First name is required!",
              },
            ]}
          >
            <Input name="firstName" onChange={e => handleChange(e)} />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              {
                required: true,
                message: "Last name is required!",
              },
            ]}
          >
            <Input name="lastName" onChange={e => handleChange(e)} />
          </Form.Item>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please input valid email!",
              },
            ]}
          >
            <Input name="email" onChange={e => handleChange(e)} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                message: "Password is weak!",
              },
            ]}
          >
            <Input.Password name="password" onChange={e => handleChange(e)} />
          </Form.Item>

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Change password*/}
      <Modal
        title="Change Password"
        visible={visibleCPass}
        onCancel={handleCancel}
      >
        <Form
          {...layout2}
          form={formPassword}
          initialValues={{
            remember: true,
          }}
          onFinish={handleChangePass}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Current password is required!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="New password"
            name="password"
            rules={[
              {
                required: true,
                min: 6,
                message: "Password is weak!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Confirm new password"
            name="confirm"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject("Password do not match!");
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item style={{ textAlign: "end" }} {...tailLayout2}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default LoggedNav;

const layout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 14,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 7,
  },
};

const layout2 = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 14,
  },
};

const tailLayout2 = {
  wrapperCol: {
    span: 23,
  },
};
