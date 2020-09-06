import React, { useState } from 'react';

import { Layout } from 'antd';
import 'antd/dist/antd.css';
import './App.scss';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useFirestoreConnect, useFirebase } from 'react-redux-firebase';

import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';
import StoreDetails from './components/details/StoreDetails';
import RiderDetails from './components/details/RiderDetails';
import Nav from './components/layout/Nav';
import SideNav from './components/layout/SideNav';
import Stores from './components/stores/Stores';
import Riders from './components/rider/Riders';
import Owners from './components/stores/Owners';
import AddStore from './components/stores/AddStore';
import AddRider from './components/rider/AddRider';
import Transactions from './components/transactions/Transactions';
import NotAuthorized from './components/authRedirects/NotAuthorized';
import NotVerified from './components/authRedirects/NotVerified';
import ManageProduct from './components/owner/ManageProduct';
import Customers from './components/owner/Customers';
import Admin from './components/admin/Admin';
import ChangeLocation from './components/stores/ChangeLocation';
import NotSupported from './components/authRedirects/NotSupported';

// import EditLocation from './components/owner/EditLocation'

const { Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  useFirestoreConnect('Accounts');

  const accounts = useSelector((state) => state.firestore.ordered.Accounts);

  const auth = useSelector((state) => state.firebase.auth);

  // get role
  const role = useSelector((state) => state.firebase.profile.role);

  const firebase = useFirebase();
  // check if email is verified
  var email = firebase.auth().currentUser;
  if (email) {
    var emailVerified;
    emailVerified = email.emailVerified;
  }

  return (
    <Router>
      <Layout>
        {auth.uid && emailVerified && role != 'rider' && (
          <SideNav collapsed={collapsed} />
        )}
        <Layout className="site-layout">
          {auth.uid && emailVerified && role != 'rider' && (
            <Nav collapsed={collapsed} setCollapsed={setCollapsed} />
          )}
          <Content className="site-layout-background dashboard">
            <Switch>
              <Route exact path="/" component={Dashboard} />
              <Route path="/stores" component={Stores} />
              <Route path="/riders" component={Riders} />
              <Route path="/owners" component={Owners} />
              <Route path="/storedetails/:id" component={StoreDetails} />
              <Route path="/riderdetails/:id" component={RiderDetails} />
              <Route path="/addstore" component={AddStore} />
              <Route path="/addrider" component={AddRider} />
              <Route path="/transactions" component={Transactions} />
              <Route path="/login" component={Login} />
              <Route path="/403" component={NotAuthorized} />
              <Route path="/verify-email" component={NotVerified} />
              <Route path="/manageproduct" component={ManageProduct} />
              <Route path="/customers" component={Customers} />
              <Route path="/changelocation/:id" component={ChangeLocation} />
              <Route path="/changelocation/:id" component={ChangeLocation} />
              <Route path="/notsupported" component={NotSupported} />
              {/* <Route path="/edit-location" component={EditLocation} /> */}
              {/* for developers only */}
              <Route path="/add---admin" component={Admin} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
