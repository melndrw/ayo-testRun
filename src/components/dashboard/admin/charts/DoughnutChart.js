import React from "react";

import { Doughnut } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

const DoughnutChart = () => {
  useFirestoreConnect([
    {
      collection: "Transactions",
    },
  ]);

  const transactions = useSelector(
    state => state.firestore.ordered.Transactions
  );

  // get completed status
  const transCompleted = transactions?.filter(
    trans => trans.status === "completed"
  );

  // get cancelled status
  const transCancelled = transactions?.filter(
    trans => trans.status === "cancelled"
  );

  const data = {
    labels: ["Successful Delivery", "Failed Delivery"],
    datasets: [
      {
        data: [transCompleted?.length, transCancelled?.length],
        backgroundColor: ["#52C41A", "#FF4D4F"],
        hoverBackgroundColor: ["#52C41A", "#FF4D4F"],
      },
    ],
  };

  return (
    <div>
      <h2>Transactions</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default DoughnutChart;
