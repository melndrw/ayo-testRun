import React from "react";

import { Row, Col } from "antd";
import MoonLoader from "react-spinners/MoonLoader";

import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { useFirestoreConnect, useFirebase } from "react-redux-firebase";
import LineChart from "./admin/charts/LineChart";
import DoughnutChart from "./admin/charts/DoughnutChart";
import BarChart from "./admin/charts/BarChart";
import Cards from "./admin/cards/Cards";
import CardsOwner from "./owner/cards/CardsOwner";
import LineChartOwner from "./owner/charts/LineChartOwner";
import DoughnutChartOwner from "./owner/charts/DoughnutChartOwner";
import Stores from "./admin/stores/Stores";

const Dashboard = () => {
  useFirestoreConnect([
    {
      collection: "Stores",
    },
    {
      collection: "Transactions",
    },
  ]);

  const stores = useSelector(state => state.firestore.ordered.Stores);

  const auth = useSelector(state => state.firebase.auth);

  const role = useSelector(state => state.firebase.profile.role);

  const firebase = useFirebase();

  // Redirects
  // if user is not logged in
  if (!auth.uid) return <Redirect to="/login" />;
  // if user is not admin/owner
  if (role === "rider") return <Redirect to="/403" />;
  // if email is not verfied
  var email = firebase.auth().currentUser;
  var emailVerified;
  emailVerified = email.emailVerified;
  if (!emailVerified) return <Redirect to="/verify-email" />;

  const renderComponent = () => {
    return role === "admin" ? (
      <>
        <Row gutter={16}>
          <Cards />
        </Row>
        <Row gutter={24} style={{ margin: "2rem 0" }}>
          <Col span="16">
            <LineChart />
          </Col>
          <Col span="8">
            <DoughnutChart />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: "3rem" }}>
          <Col span="10">
            <Stores />
          </Col>
          <Col span="14">
            <BarChart />
          </Col>
        </Row>
      </>
    ) : (
      <>
        <Row gutter={16}>
          <CardsOwner />
        </Row>
        <Row gutter={24} style={{ margin: "2rem 0" }}>
          <Col span="16">
            <LineChartOwner />
          </Col>
          <Col span="8">
            <DoughnutChartOwner />
          </Col>
        </Row>
      </>
    );
  };

  const renderLoading = () => {
    return (
      <div className="centerLoader">
        <MoonLoader loading={true} color="#43DABC" />
      </div>
    );
  };

  return <>{stores ? renderComponent() : renderLoading()}</>;
};

export default Dashboard;
