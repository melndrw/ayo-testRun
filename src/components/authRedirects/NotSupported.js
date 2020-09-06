import React, { useEffect } from "react";

import { withRouter } from "react-router-dom";

import { Result } from "antd";

const NotSupported = ({ history }) => {
  useEffect(() => {
    if (window.screen.width > 1024) {
      history.push("/login");
    }
  }, []);
  return <Result status="warning" title="Device not supported" />;
};

export default withRouter(NotSupported);
