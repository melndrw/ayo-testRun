import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import UploadFile from '../UploadFile';
import StoreTime from '../StoreTime';
import moment from 'moment';

const Basic = ({ onFinish }) =>
  // { onFinish }
  {
    const [form] = Form.useForm();
    const [isValidity, setValidity] = useState({ valid: false });

    const handlerChange = (isValid) => {
      isValid &&
        setValidity({
          valid: isValid.submit,
        });
      return isValid.file;
    };

    const initialTimeValue = {
      weekdays: [
        moment('9:00:00 AM', 'h:mm a'),
        moment('5:00:00 PM', 'h:mm a'),
      ],
      saturday: [
        moment('9:00:00 AM', 'h:mm a'),
        moment('5:00:00 PM', 'h:mm a'),
      ],
      sunday: [moment('9:00:00 AM', 'h:mm a'), moment('5:00:00 PM', 'h:mm a')],
    };
    return (
      <>
        <Form
          form={form}
          {...layout}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Store Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Landmark"
            name="landmark"
            rules={[
              {
                required: true,
                message: 'Please input your landmark!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Contact Number"
            name="contactNo"
            rules={[
              {
                required: true,
                message: 'Please input your contact number!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <UploadFile
            extra={null}
            onHandleChange={handlerChange}
            defaultList={null}
          />
          <p style={{ textAlign: 'center' }}>
            Opening and Closing Time(Business Hours)
          </p>
          <StoreTime
            weekdays={initialTimeValue.weekdays}
            sunday={initialTimeValue.sunday}
            saturday={initialTimeValue.saturday}
          />
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isValidity.valid}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  };

export default Basic;

const layout = {
  labelCol: {
    span: 9,
  },
  wrapperCol: {
    span: 6,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 9,
    span: 16,
  },
};
