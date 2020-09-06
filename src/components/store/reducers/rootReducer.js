import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";
import riderReducer from "./riderReducer";
import storeReducer from "./storeReducer";
import authReducer from "./authReducer";

const rootReducer = combineReducers({
  authReducer: authReducer,
  riderUser: riderReducer,
  store: storeReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

export default rootReducer;
