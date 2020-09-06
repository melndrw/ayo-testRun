import React, { useState, useEffect } from 'react';
import { Table, Space, Button, DatePicker, PageHeader, Tag } from 'antd';
import { PushpinOutlined, FilterOutlined } from '@ant-design/icons';
import { useFirestoreConnect } from 'react-redux-firebase';
import { useSelector } from 'react-redux';
import Orders from './Orders';
import Filter from './Filter';
import '../styles/store.scss';

const { Column, ColumnGroup } = Table;
const { RangePicker } = DatePicker;

const Transactions = () => {
  useFirestoreConnect([
    { collection: 'Accounts' },
    { collection: 'Transactions' },
  ]);
  const accounts = useSelector((state) => state.firestore.ordered.Accounts);

  const transactions = useSelector(
    (state) => state.firestore.ordered.Transactions
  );
  const customer = accounts?.filter((cust) => cust.role === 'customer');
  const rider = accounts?.filter((ridr) => ridr.role === 'rider');

  const dataFilter = (source) => {
    if (source === undefined) return;
    const data = source.map((trans, idx) => {
      const customerFilter = customer.filter(
        (item) => trans.information.customer.ref === `Accounts/${item.id}`
      );
      // console.log(customer);
      const riderFilter = rider?.filter(
        (item) => trans.rider && trans.rider.ref === `Accounts/${item.id}`
      );

      return {
        key: idx,
        transaction: trans.id,
        date: new Date(trans.datetime_created.seconds * 1000).toLocaleString(),
        status: trans.status,
        customer:
          customerFilter[0] !== undefined
            ? `${customerFilter[0].firstName} ${customerFilter[0].lastName}`
            : null,
        rider:
          trans.status === 'completed' &&
          `${riderFilter[0].firstName} ${riderFilter[0].lastName}`,
        total: trans.total,
        orders: trans.orders['product-0'],
      };
    });
    return data;
  };

  const [dataSource, setDataSource] = useState([]);
  const [filter, setFilter] = useState({
    dateFilter: null,
    statFilter: dataFilter(transactions),
  });
  const [orders, setOrders] = useState({
    visible: false,
    dataSource: [],
  });

  useEffect(() => {
    if (transactions === undefined) return;
    // DataSource for all transactions

    setDataSource(dataFilter(transactions));
  }, [transactions]);

  // useEffect(() => {
  //   setDataSource(filter);
  // }, [filter]);

  const handlerOnDetails = (data) => {
    data.orders = data.orders.map((item, idx) => {
      return {
        key: idx,
        productName: item.productName,
        description: item.description,
        price: item.price,
        url: item.url,
      };
    });

    setOrders({
      visible: true,
      dataSource: data.orders,
    });
  };

  const handlerCancel = () => {
    setOrders((prevState) => {
      return {
        ...prevState,
        visible: false,
      };
    });
  };

  // // Sorting the Transactions base on the setted time
  const handlerDateFilter = (value) => {
    const startingDate = value[0]._d;
    const endDate = value[1]._d;

    const data = dataFilter(transactions);
    const filter = data.filter((time) => {
      const givenDate = Date.parse(time.date);

      return startingDate <= givenDate && endDate >= givenDate;
    });

    setFilter((prevState) => ({
      ...prevState,
      dateFilter: filter,
    }));
  };

  const handleStatusFilter = (e) => {
    if (e === 'all') {
      let data = dataFilter(transactions);
      setDataSource(data);
    } else {
      const filter = dataSource.filter((item) => e === item.status); //the dataSource should not be the current datSource but the source when the time is filtered

      setDataSource(filter);
    }
  };
  return (
    <div>
      <PageHeader className="site-page-header" title="All Transactions" />
      <div className="filter-style">
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          onChange={handlerDateFilter}
        />
        <div>
          <Filter onFilterChange={handleStatusFilter} />
        </div>
      </div>
      <Table
        dataSource={dataSource}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      >
        <ColumnGroup title="Transactions">
          <Column
            title="Transaction No."
            dataIndex="transaction"
            key="transaction"
          />
          <Column title="Date Created" dataIndex="date" key="date" />
        </ColumnGroup>
        <Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(text) => {
            let color = 'success';
            switch (text) {
              case 'cancelled':
                color = 'error';
                break;
              case 'pending':
                color = 'warning';
                break;
              default:
                color = 'success';
            }
            return <Tag color={color}>{text.toUpperCase()}</Tag>;
          }}
        />
        <Column title="Customers" dataIndex="customer" key="customer" />
        <Column title="Rider" dataIndex="rider" key="rider" />
        <Column title="Total Amount" key="total" dataIndex="total" />
        <Column
          title="Action"
          key="action"
          render={(text, record) => {
            if (record.orders == undefined) record.orders = [];

            return (
              <Space size="middle">
                <Button
                  type="primary"
                  shape="round"
                  icon={<PushpinOutlined />}
                  onClick={() => handlerOnDetails(record)}
                >
                  Details
                </Button>
              </Space>
            );
          }}
        />
      </Table>
      <Orders
        onCancel={handlerCancel}
        visible={orders.visible}
        dataSource={orders.dataSource}
      />
    </div>
  );
};

export default Transactions;
