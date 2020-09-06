import React, { useState, useEffect } from "react"
import { DatePicker } from "antd"

import { Line } from "react-chartjs-2"
import moment from "moment"
import { useSelector } from "react-redux"
import { useFirebase, useFirestoreConnect } from "react-redux-firebase"

const LineChartOwner = () => {
  useFirestoreConnect([
    {
      collection: "Stores",
    },
  ])

  const [currentYear, setCurrentYear] = useState()

  // Get current year
  const dateNow = new Date()
  const yearNow = dateNow.getFullYear()

  // Fetch current year
  useEffect(() => {
    setCurrentYear(yearNow)
  }, [])

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
  ]

  // Default value for splice
  let gross = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

  /* 
    get current user
    match to store
    get monthly total
  */
  const firebase = useFirebase()

  const transactions = useSelector(
    (state) => state.firestore.ordered.Transactions
  )

  const userId = firebase.auth().currentUser.uid

  // get current store
  const newTransactions = transactions
    ?.filter((transaction) => {
      const str = transaction.information.store.ref
      const status = transaction.status
      const res = str.split(/[/ ]+/).pop()
      if (res === userId && status === "completed") {
        return transaction
      }
    })
    .map((transaction) => {
      const str = transaction.information.store.ref
      const res = str.split(/[/ ]+/).pop()
      if (res === userId) {
        const { datetime_created, total } = transaction
        return {
          // 2nd orig
          // monthYear: moment(datetime_created.toDate()).format("MMMM YYYY"),
          // orig
          monthYear: moment(datetime_created).format("MMMM YYYY"),
          monthTotal: total,
          res,
        }
      }
    })

  // Get total for each month
  const transactData = newTransactions?.reduce((prev, next) => {
    if (next.monthYear in prev) {
      prev[next.monthYear].monthTotal += next.monthTotal
    } else {
      prev[next.monthYear] = next
    }
    return prev
  }, {})

  // Insert to chart
  const newData =
    transactData &&
    Object.values(transactData).map((trans) => {
      const { monthYear, monthTotal } = trans
      // // Get month
      let newMonth = moment(monthYear).format("MMMM")
      let monthIndex = moment().month(newMonth).format("M") - 1
      let year = monthYear.split(/\s+/).pop()
      console.log(year)
      if (year == currentYear) {
        gross.splice(monthIndex, 1, monthTotal)
      }
    })

  // console.log(newData)

  const data = {
    labels: months,
    datasets: [
      {
        label: "Gross Income",
        fill: false,
        lineTension: 0.1,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderCapStyle: "butt",
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: "miter",
        pointBorderColor: "rgba(75,192,192,1)",
        pointBackgroundColor: "#fff",
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(75,192,192,1)",
        pointHoverBorderColor: "rgba(220,220,220,1)",
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: gross,
      },
    ],
  }

  const onChange = (date, dateString) => {
    setCurrentYear(dateString)
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <label style={{ marginRight: "10px" }}>Monthly Gross Income</label>
        <DatePicker
          onChange={onChange}
          picker="year"
          defaultValue={moment(currentYear)}
          allowClear={false}
        />
      </div>
      <Line data={data} />
    </div>
  )
}

export default LineChartOwner
