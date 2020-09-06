import React, { useState, useEffect } from "react";

import { Button, Input, Form, Menu, notification } from "antd";

import { useFirebase, useFirestore } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import { registerAdmin } from "../store/actions/authActions";

const { SubMenu } = Menu;

const Admin = () => {
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

  useEffect(() => {
    setMessage();
    return () => {
      message && openNotification("topRight");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

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

  return (
    <div>
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
    </div>
  );
};

export default Admin;

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 6,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
  },
};
