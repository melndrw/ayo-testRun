import React from "react";

import { Col, Card } from "antd";

import { useSelector } from "react-redux";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";

const CardsOwner = () => {
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

  const firebase = useFirebase();

  // currennt user id
  const userId = firebase.auth().currentUser.uid;

  const transactions = useSelector(
    state => state.firestore.ordered.Transactions
  );

  const accounts = useSelector(state => state.firestore.ordered.Accounts);

  // get store id
  const newTrans =
    transactions &&
    transactions.map(transaction => {
      const str = transaction.information.store.ref;
      const res = str.split(/[/ ]+/).pop();
      return res;
    });
  // filter
  const countTransact = newTrans && newTrans.filter(trans => trans == userId);

  // get current store
  const storeCust =
    transactions &&
    transactions.filter(transaction => {
      const str = transaction.information.store.ref;
      const res = str.split(/[/ ]+/).pop();
      if (userId === res) {
        return res;
      }
    });

  // get store customer
  const newStoreCust =
    storeCust &&
    storeCust.map(transaction => {
      const str = transaction.information.customer.ref;
      const res = str.split(/[/ ]+/).pop();
      return res;
    });

  const uniqueCustomer = [...new Set(newStoreCust)];

  return (
    <>
      <Col span={12}>
        <Card style={{ textAlign: "center" }}>
          <p> Transactions Made </p>{" "}
          <span style={fontStyle}> {countTransact?.length} </span>
        </Card>
      </Col>
      <Col span={12}>
        <Card style={{ textAlign: "center" }}>
          <p> Customers </p>{" "}
          <span style={fontStyle}>{uniqueCustomer?.length}</span>
        </Card>
      </Col>
    </>
  );
};

export default CardsOwner;

const fontStyle = {
  fontSize: "27.5px",
  fontWeight: "bold",
};
