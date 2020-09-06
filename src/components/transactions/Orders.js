import React from 'react';
import { Modal, Table } from 'antd';

const Orders = (props) => {
  const columns = [
    {
      key: 'preview',
      title: 'URL',
      dataIndex: 'url',
      render: (url) => <img width="100px" src={url} />,
    },
    {
      key: 'product_name',
      title: 'Product Name',
      dataIndex: 'productName',
    },
    {
      key: 'description',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      key: 'price',
      title: 'Price',
      dataIndex: 'price',
    },
  ];

  return (
    <div>
      <Modal
        title="Orders"
        onCancel={props.onCancel}
        visible={props.visible}
        width={1000}
      >
        <Table
          dataSource={props.dataSource}
          columns={columns}
          pagination={{ pageSize: 5, showSizeChanger: false }}
        ></Table>
      </Modal>
    </div>
  );
};

export default Orders;
