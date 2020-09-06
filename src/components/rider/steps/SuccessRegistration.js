import React from "react";

import { css } from "@emotion/core";
import MoonLoader from "react-spinners/MoonLoader";
import { Result, Button } from "antd";

import { Link, withRouter } from "react-router-dom";

const SuccessRegistration = ({ err, isLoading, history }) => {
  setTimeout(() => {
    history.push("/riders");
  }, 2000);

  const renderMsg = () => {
    return (
      <Result
        status={err ? "error" : "success"}
        title={err ? err : "Rider Successfully Registered!"}
        subTitle="User has been added to our database and can now log on the mobile application"
        extra={[
          <Button type="primary" key="console">
            <Link to="/riders">See List</Link>
          </Button>,
          <Button key="buy">
            <Link to="/">Go to dashboard</Link>
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
