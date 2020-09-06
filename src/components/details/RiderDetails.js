import React from "react";

import { Card } from "antd";

import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

const RiderDetails = props => {
  // const id = props.match.params.id
  const { firstName, lastName, contact_no, address } = props.location.state;
  // Redirect if not logged
  const auth = useSelector(state => state.firebase.auth);
  if (!auth.uid) return <Redirect to="/login" />;

  return (
    <Card title={`${firstName} ${lastName}`} style={{ width: 300 }}>
      <p>Contact no:{contact_no}</p>
      <p>Address: {address}</p>
    </Card>
  );
};

export default RiderDetails;
