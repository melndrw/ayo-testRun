import React, { useState } from 'react';
import { Form, TimePicker } from 'antd';
import moment from 'moment';
const { RangePicker } = TimePicker;

const config = {
  rules: [
    {
      required: true,
      message: 'Please select Opening and Closing Hours!',
    },
  ],
};

const StoreTime = (props) => {
  return (
    <div>
      <Form.Item
        name="weekdays"
        label="Weekdays"
        {...config}
        initialValue={props.weekdays}
      >
        <RangePicker name="weekdays" format="h:mm a" />
      </Form.Item>
      <Form.Item
        name="saturday"
        label="Saturday"
        {...config}
        initialValue={props.saturday}
      >
        <RangePicker name="saturday" format="h:mm a" />
      </Form.Item>
      <Form.Item
        name="sunday"
        label="Sunday"
        {...config}
        initialValue={props.sunday}
      >
        <RangePicker name="sunday" format="h:mm a" />
      </Form.Item>
    </div>
  );
};

export default StoreTime;
