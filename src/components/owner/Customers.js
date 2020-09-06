import React from "react";

import { Table } from "antd";

import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";

const Customers = () => {
  useFirestoreConnect([
    {
      collection: "Transactions",
    },
    {
      collection: "Accounts",
    },
  ]);

  const transactions = useSelector(
    state => state.firestore.ordered.Transactions
  );

  const Accounts = useSelector(state => state.firestore.ordered.Accounts);

  const firebase = useFirebase();

  const auth = useSelector(state => state.firebase.auth);

  // if user is not logged in

  if (!auth.uid) return <Redirect to="/login" />;

  const userId = firebase.auth().currentUser.uid;

  // get current store
  const storeCust =
    transactions &&
    transactions.filter(transaction => {
      const str = transaction.information.store.ref;
      const res = str.split(/[/ ]+/).pop();
      if (userId == res) {
        return transaction;
      }
    });

  // get store customer
  const newStoreCust =
    storeCust &&
    storeCust.map(custs => {
      const str = custs.information.customer.ref;
      const res = str.split(/[/ ]+/).pop();
      return res;
    });

  const uniqueId = [...new Set(newStoreCust)];

  const allCustomer =
    Accounts && Accounts.filter(account => account.role === "customer");

  const reduced =
    allCustomer &&
    allCustomer.reduce(function (filtered, newCust) {
      uniqueId.map(uid => {
        if (newCust.id === uid) {
          const custDetails = {
            firstname: newCust.firstname + " " + newCust.lastname,
            contactno: newCust.contactno,
            email: newCust.email,
            key: newCust.id,
          };
          filtered.push(custDetails);
        }
      });
      return filtered;
    }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "firstname",
      key: 1,
    },
    {
      title: "Contact No",
      dataIndex: "contactno",
      key: 2,
    },
    {
      title: "Email Address",
      dataIndex: "email",
      key: 3,
    },
  ];

  const data = reduced;

  return (
    <>
      <h2>List of Customers</h2>
      <Table columns={columns} dataSource={data} />
    </>
  );
};

export default Customers;
