import React from "react";

import { Result, Button } from "antd";
import { css } from "@emotion/core";
import MoonLoader from "react-spinners/MoonLoader";

import { Link, withRouter } from "react-router-dom";

const SuccessRegistration = ({ errMsg, isLoading, history }) => {
  setTimeout(() => {
    history.push("/stores");
  }, 2000);

  const renderMsg = () => {
    return (
      <Result
        status={errMsg ? "error" : "success"}
        title={errMsg ? errMsg : "Store Successfully Registered!"}
        subTitle="Store and owner credentials has been added to our database."
        extra={[
          <Button type="primary" key="console">
            <Link to="/addstore">Add Store</Link>
          </Button>,
          <Button key="buy">
            <Link to="/stores">List</Link>
          </Button>,
        ]}
        style={{ paddingTop: 0 }}
      />
    );
  };

  const renderLoading = () => {
    return <MoonLoader css={override} loading={isLoading} color="#43DABC" />;
  };
  return isLoading ? renderLoading() : renderMsg();
};

export default withRouter(SuccessRegistration);

const override = css`
  display: block;
  margin: 0 auto;
`;
