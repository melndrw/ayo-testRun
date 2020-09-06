import React from "react";

import { Bar } from "react-chartjs-2";
import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import moment from "moment";

const BarChart = () => {
  useFirestoreConnect([
    {
      collection: "Accounts",
    },
  ]);

  const accounts = useSelector(state => state.firestore.ordered.Accounts);

  // Header
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // default value for splice
  let numberCustomers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  // all customer
  const custMonthRegistered =
    accounts &&
    accounts
      .filter(account => account.role === "customer")
      .map(account => {
        const { createdAt } = account;
        return moment(createdAt.toDate()).format("MMMM YYYY");
      });

  // months to index
  const myMonths =
    custMonthRegistered &&
    custMonthRegistered.map(month => {
      var res = month.split(/\s+/).shift();
      return moment().month(res).format("M") - 1;
    }, {});

  // count all customer via month
  const map =
    custMonthRegistered &&
    custMonthRegistered.reduce((prev, cur) => {
      prev[cur] = (prev[cur] || 0) + 1;
      return prev;
    }, {});

  const dateNow = new Date();
  const yearNow = dateNow.getFullYear();

  const uniqueMonth = [...new Set(myMonths)];

  // insert data to chart
  uniqueMonth.map(uniq => {
    for (let [key, value] of Object.entries(map)) {
      // convert month to num
      var res = key.split(/\s+/).shift();
      // console.log(typeof res)
      const monthToNum = moment().month(res).format("M") - 1;
      // get year
      var res2 = key.split(/\s+/).pop();
      if (monthToNum === uniq && parseInt(res2) === yearNow) {
        numberCustomers.splice(uniq, 1, value);
      }
    }
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: "Customer Growth",
        backgroundColor: "rgba(58,161,255,0.2)",
        borderColor: "#0170FE",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(58,161,255,0.4)",
        hoverBorderColor: "#0170FE",
        data: numberCustomers,
      },
    ],
  };
  return (
    <div>
      <Bar data={data} width={600} height={250} />
    </div>
  );
};

export default BarChart;
