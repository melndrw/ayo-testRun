import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import store from "./components/store";
import firebaseConfig from "./components/config/firebaseConfig";
import { ReactReduxFirebaseProvider, isLoaded } from "react-redux-firebase";
import { createFirestoreInstance } from "redux-firestore";
import { Provider } from "react-redux";
import { useSelector } from "react-redux";
import BarLoader from "react-spinners/BarLoader";

function AuthHasLoaded({ children }) {
  const auth = useSelector(state => state.firebase.auth);

  if (!isLoaded(auth))
    return (
      <div>
        <BarLoader color={"#123abc"} width="100%" />
      </div>
    );
  return children;
}

const rrfConfig = {
  userProfile: "Accounts",
  useFirestoreForProfile: true, // Firestore for Profile instead of Realtime DB
};

const rrfProps = {
  firebase: firebaseConfig,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance, // <- needed if using firestore
};

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <AuthHasLoaded>
        <App />
      </AuthHasLoaded>
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
