const intiState = [];

const riderReducer = (state = intiState, action) => {
  switch (action.type) {
    case "RIDER_SIGNUP_SUCCESS":
      console.log("Rider successfully registered!");
      return state;
    case "RIDER_SIGNUP_FAIL":
      console.log("Rider registration failed!", action.err.message);
      return state;
    default:
      return state;
  }
};
export default riderReducer;
