const initState = [];

const storeReducer = (state = initState, action) => {
  switch (action.type) {
    case "ADD_STORE":
      console.log("Store successfully added!");
      return state;
    case "ADD_STORE_FAIL":
      console.log("Adding store failed!", action.err.message);
      return state;
    default:
      return state;
  }
};

export default storeReducer;
