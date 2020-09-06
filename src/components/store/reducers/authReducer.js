const initState = [];

const authReducer = (state = initState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      console.log("Login success!");
      return state;
    case "LOGIN_FAIL":
      console.log("Login Failed!");
      return state;
    case "LOGOUT_SUCCESS":
      console.log("You are logged out!");
      return state;
    case "ADMIN_SIGNUP_SUCCESS":
      console.log("Admin successfully registered!");
      return state;
    case "ADMIN_SIGNUP_FAIL":
      console.log("Admin registration failed!", action.err.message);
      return state;
    default:
      return state;
  }
};

export default authReducer;
