import React from "react";

import { Col, Card } from "antd";

import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

const TotalTransactions = () => {
  useFirestoreConnect([
    {
      collection: "Stores",
    },
    {
      collection: "Accounts",
    },
    {
      collection: "Transactions",
    },
  ]);

  const stores = useSelector(state => state.firestore.ordered.Stores);

  const accounts = useSelector(state => state.firestore.ordered.Accounts);

  const transactions = useSelector(
    state => state.firestore.ordered.Transactions
  );

  // total cx
  const customers =
    accounts && accounts.filter(account => account.role === "customer");

  const riders =
    accounts && accounts.filter(account => account.role === "rider");

  return (
    <>
      <Col span={6}>
        <Card style={{ textAlign: "center" }}>
          <p> Total Transactions </p>{" "}
          <span style={fontStyle}> {transactions?.length} </span>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ textAlign: "center" }}>
          <p> Registered Stores </p>{" "}
          <span style={fontStyle}>{stores?.length}</span>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ textAlign: "center" }}>
          <p> No. of Customers </p>{" "}
          <span style={fontStyle}>{customers.length}</span>
        </Card>
      </Col>
      <Col span={6}>
        <Card style={{ textAlign: "center" }}>
          <p> No. of Riders </p> <span style={fontStyle}>{riders.length}</span>
        </Card>
      </Col>
    </>
  );
};

export default TotalTransactions;

const fontStyle = {
  fontSize: "27.5px",
  fontWeight: "bold",
};
