import React, { useState } from 'react';
import { Upload, Button, Form, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const UploadFile = (props) => {
  const [isValid, setValid] = useState({
    submit: false,
    type: null,
    size: false,
    file: null,
    num: false,
  });

  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 1000);
  };

  const onConditions = (file) => {
    const jpgOrpng = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!jpgOrpng) {
      message.error('You can only upload JPG/PNG file!');
    }
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    setValid((prevState) => {
      return {
        ...prevState,
        submit: jpgOrpng && isLt2M,
        type: jpgOrpng,
        size: isLt2M,
        file: file,
      };
    });
    return jpgOrpng && isLt2M;
  };

  const handlerRemove = (file) => {
    setValid((prevState) => {
      return {
        ...prevState,
        submit: false,
        num: false,
        type: false,
        size: false,
        file: null,
      };
    });
  };

  const handlerChange = (info) => {
    if (info.fileList.length === 1) {
      setValid((prevState) => ({
        ...prevState,
        num: true,
        submit: false,
      }));
    }
  };
  // done uploads
  return (
    <Form.Item
      name="upload"
      label="Cover Photo"
      valuePropName="file"
      getValueFromEvent={() => props.onHandleChange(isValid)}
      extra={props.extra}
    >
      <Upload
        customRequest={dummyRequest}
        name="logo"
        listType="picture"
        beforeUpload={onConditions}
        onRemove={() => handlerRemove()}
        onChange={handlerChange}
        defaultFileList={props.defaultList}
      >
        <Button disabled={isValid.num}>
          <UploadOutlined /> Click to upload
        </Button>
      </Upload>
    </Form.Item>
  );
};

export default UploadFile;
