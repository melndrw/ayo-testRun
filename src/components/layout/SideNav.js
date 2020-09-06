import React from 'react';

import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  DashboardOutlined,
  CarOutlined,
  UserOutlined,
  FormOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import logo from '../../imgs/logo.jpg';

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const { Sider } = Layout;
const { SubMenu } = Menu;

const SideNav = ({ collapsed }) => {
  const role = useSelector((state) => state.firebase.profile.role);

  return (
    <Sider trigger={null} collapsible collapsed={collapsed} theme="light">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="logo" />
        </Link>
      </div>
      {role === 'admin' ? (
        <Menu defaultOpenKeys={['sub1', 'sub2']} mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <SubMenu key="sub1" icon={<HomeOutlined />} title="Manage Stores">
            <Menu.Item key="2">
              <Link to="/stores">All Stores</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/addstore">Add Store</Link>
            </Menu.Item>
          </SubMenu>

          <SubMenu key="sub2" icon={<CarOutlined />} title="Manage Riders">
            <Menu.Item key="5">
              <Link to="/riders">All Riders</Link>
            </Menu.Item>
            <Menu.Item key="6">
              <Link to="/addrider">Add Rider</Link>
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="sub3" icon={<DollarOutlined />}>
            <Link to="/transactions">Transactions</Link>
          </Menu.Item>
        </Menu>
      ) : role === 'owner' ? (
        <Menu mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FormOutlined />}>
            <Link to="/manageproduct">Manage Product</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to="/customers">Customers</Link>
          </Menu.Item>
          {/* <Menu.Item key="4" icon={<HomeOutlined />}>
                    <Link to="/edit-location">
                        Edit Location
                    </Link>
                </Menu.Item> */}
        </Menu>
      ) : null}
    </Sider>
  );
};

export default SideNav;
