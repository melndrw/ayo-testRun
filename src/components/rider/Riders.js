import React from "react";

import { useSelector } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { Redirect } from "react-router-dom";

import Rider from "./Rider";
import RidersNav from "./RidersNav";

const Riders = () => {
  useFirestoreConnect("Accounts");

  const users = useSelector(state => state.firestore.ordered.Accounts);

  // authentication
  const auth = useSelector(state => state.firebase.auth);
  if (!auth.uid) return <Redirect to="/login" />;

  const riders = users && users.filter(user => user.role === "rider");

  const allRider = <Rider riders={riders} />;

  return (
    <div>
      <RidersNav />
      {allRider}
    </div>
  );
};

export default Riders;
