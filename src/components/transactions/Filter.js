import React, { useState } from 'react';

import { Select, Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';

import '../styles/store.scss';

const { Option } = Select;

const Filter = (props) => {
  return (
    <div className="filter-style__stat">
      <span>Filter by Status </span>
      <Select
        defaultValue="STATUS"
        style={{ width: 120 }}
        onChange={(e) => props.onFilterChange(e)}
        label="Filter"
      >
        <Option value="completed">Completed</Option>
        <Option value="pending">Pending</Option>
        <Option value="cancelled">Cancelled</Option>
      </Select>
      <Button
        type="primary"
        icon={<ClearOutlined />}
        onClick={() => props.onClearButton()}
      >
        Clear Filter
      </Button>
    </div>
  );
};

export default Filter;
