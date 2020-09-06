import React from "react";

import { useSelector } from "react-redux";
import { useFirebase, useFirestoreConnect } from "react-redux-firebase";
import { Doughnut } from "react-chartjs-2";

const DoughnutChartOwner = () => {
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

  const userId = firebase.auth().currentUser.uid;

  const transactions = useSelector(
    state => state.firestore.ordered.Transactions
  );

  // get store id
  const newTrans = transactions?.map(transaction => {
    const str = transaction.information.store.ref;
    const status = transaction.status;
    const storeId = str.split(/[/ ]+/).pop();
    const trans = { status, storeId };
    return trans;
  });

  const completedStatus = newTrans
    ?.filter(transaction => {
      if (transaction.storeId == userId) {
        return transaction;
      }
    })
    .filter(transaction => {
      if (transaction.status === "completed") {
        return transaction;
      }
    })
    .map(transactions => transactions.status);

  const cancelledStatus = newTrans
    ?.filter(transaction => {
      if (transaction.storeId == userId) {
        return transaction;
      }
    })
    .filter(transaction => {
      if (transaction.status === "cancelled") {
        return transaction;
      }
    })
    .map(transactions => transactions.status);

  const data = {
    labels: ["Successful Delivery", "Failed Delivery"],
    datasets: [
      {
        data: [completedStatus?.length, cancelledStatus?.length],
        backgroundColor: ["#52C41A", "#FF4D4F"],
        hoverBackgroundColor: ["#52C41A", "#FF4D4F"],
      },
    ],
  };

  const withTrans = () => {
    return <Doughnut data={data} />;
  };

  const noTrans = () => {
    return <p>No transaction found...</p>;
  };

  return (
    <div>
      <h2>Transactions</h2>
      {completedStatus?.length > 0 || cancelledStatus?.length > 0
        ? withTrans()
        : noTrans()}
    </div>
  );
};

export default DoughnutChartOwner;
