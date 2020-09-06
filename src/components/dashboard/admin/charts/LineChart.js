import React, { useState, useEffect } from "react"
import { DatePicker } from "antd"

import { Line } from "react-chartjs-2"
import { useSelector } from "react-redux"
import { useFirestoreConnect } from "react-redux-firebase"
import moment from "moment"

const LineChart = () => {
  useFirestoreConnect([
    {
      collection: "Transactions",
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

  const transactions = useSelector(
    (state) => state.firestore.ordered.Transactions
  )

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

  // All transactions
  const transactionsMonth = transactions
    ?.filter((trans) => trans.status === "completed")
    .map((trans) => {
      // 2nd orig
      // let month = moment(trans.datetime_created.toDate()).format("MMMM YYYY")
      // orig
      let month = moment(trans.datetime_created).format("MMMM YYYY")
      let monthTotal = trans.total
      let transactInfo = { month, monthTotal }
      return transactInfo
    })

  // Get total for each month
  const transactData = transactionsMonth && [
    ...transactionsMonth
      .reduce((map, item) => {
        const { month: key, monthTotal } = item
        const prev = map.get(key)

        if (prev) {
          prev.monthTotal += monthTotal
        } else {
          map.set(key, Object.assign({}, item))
        }
        return map
      }, new Map())
      .values(),
  ]

  // Insert to chart
  const newData = transactData?.map((trans) => {
    // Get month
    let newMonth = moment(trans.month).format("MMMM")
    // Get month and year
    let monthYear = moment(trans.month).format("MMMM YYYY")
    var res = monthYear.split(/\s+/).pop()
    let month = moment().month(newMonth).format("M") - 1
    let monthTotal = trans.monthTotal
    // Show current year graph
    if (res == currentYear) {
      gross.splice(month, 1, monthTotal)
    }
  })

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

export default LineChart
