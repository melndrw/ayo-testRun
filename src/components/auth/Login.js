import React, { useState, useEffect } from "react";

import { Form, Input, Button, Alert, Modal, notification } from "antd";

import { useFirebase } from "react-redux-firebase";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, withRouter } from "react-router-dom";

import { login } from "../store/actions/authActions";

const Login = ({ history }) => {
  useEffect(() => {
    if (window.screen.width <= 768) {
      history.push("/notsupported");
    }
  }, []);

  const [form] = Form.useForm();

  const [formEmail] = Form.useForm();

  const [visible, setVisible] = useState(false);

  const [err, setErr] = useState(null);

  const [isLoading, setLoading] = useState();

  const dispatch = useDispatch();

  const firebase = useFirebase();

  const auth = useSelector(state => state.firebase.auth);

  if (auth.uid) return <Redirect to="/" />;

  // Login
  const onSubmit = credentials => {
    setErr(null);
    setLoading(true);
    dispatch(
      login({ firebase }, credentials, err => {
        setLoading(false);
        setErr(err.message);
      })
    );
    form.resetFields();
  };

  // Email reset
  const handleSubmit = value => {
    var auth = firebase.auth();
    const email = value.email;
    auth
      .sendPasswordResetEmail(email)
      .then(function () {
        return notification.success({
          message: "Notification",
          description: "An email has been sent!",
          placement: "topRight",
        });
      })
      .catch(function (error) {
        return notification.error({
          message: `Notification`,
          description: error.message,
          placement: "topRight",
        });
      });
    formEmail.resetFields();
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const displayError = () => {
    return (
      <Alert
        type="error"
        message={err}
        banner
        closable
        style={{ marginBottom: 10 }}
      />
    );
  };

  return (
    <>
      <div className="login">
        <div className="login__container">
          {/* Err msg */}
          {err && displayError()}
          <Form form={form} {...layout} name="basic" onFinish={onSubmit}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  min: 6,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Button type="primary" htmlType="submit" loading={isLoading}>
                  Submit
                </Button>
                <a
                  className="login-form-forgot"
                  href="#/"
                  onClick={() => setVisible(true)}
                >
                  Forgot password
                </a>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>

      <Modal title="Forgot Password" visible={visible} onCancel={handleCancel}>
        <Form
          form={formEmail}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input a valid email address!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item style={{ textAlign: "end" }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default withRouter(Login);

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 12,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 6,
    span: 12,
  },
};
