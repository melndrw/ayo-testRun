import React from "react";

import { Layout } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";

import LoggedNav from "./LoggedNav";
import { useSelector } from "react-redux";

const { Header } = Layout;

const Nav = ({ collapsed, setCollapsed }) => {
  const collapsedBtn = collapsed ? (
    <MenuUnfoldOutlined
      className="trigger"
      onClick={() => setCollapsed(!collapsed)}
    />
  ) : (
    <MenuFoldOutlined
      className="trigger"
      onClick={() => setCollapsed(!collapsed)}
    />
  );
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {collapsedBtn}
      <LoggedNav />
    </Header>
  );
};

export default Nav;
