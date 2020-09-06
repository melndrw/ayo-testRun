import React from "react";

import { Card } from "antd";

import { Link } from "react-router-dom";

const Store = ({ store }) => {
  const { id, name, address, contact_no } = store;

  return (
    <Card
      title={name}
      size="small"
      style={{ marginBottom: "25px", textTransform: "uppercase" }}
    >
      <p style={{ textTransform: "capitalize" }}>Location: {address} </p>
      <p style={{ textTransform: "capitalize" }}>Contact No: {contact_no}</p>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link
          style={{ textTransform: "capitalize" }}
          to={{
            pathname: `/storedetails/${id}`,
            state: {
              store,
            },
          }}
        >
          More Details...
        </Link>
        <Link
          style={{ textTransform: "capitalize" }}
          to={{
            pathname: `/changelocation/${id}`,
            state: {
              store,
            },
          }}
        >
          Change Location
        </Link>
      </div>
    </Card>
  );
};

export default Store;
