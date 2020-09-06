import React from "react";

import { Result, Button } from "antd";

import { useFirebase } from "react-redux-firebase";
import { Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const NotAuthorized = props => {
  const firebase = useFirebase();

  const handleLogout = () => {
    firebase.auth().signOut();
  };

  const accounts = useSelector(state => state.firestore.ordered.Accounts);
  // if not logged in
  const auth = useSelector(state => state.firebase.auth);
  if (!auth.uid) return <Redirect to="/login" />;

  //// if not rider
  const user = accounts && accounts.filter(account => account.id === auth.uid);
  if (user && user[0].role === "admin") return <Redirect to="/" />;

  return (
    <Result
      status="403"
      title="Warning!"
      subTitle="You are not authorized to access this website."
      extra={
        <Button type="primary" key="console" onClick={handleLogout}>
          Go back to login page
        </Button>
      }
    />
  );
};

export default NotAuthorized;
