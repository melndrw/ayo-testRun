var config = {
  apiKey: "AIzaSyDFr2Qsnag57QhFzWfbPh9w-VmKqdN1DF0",
  authDomain: "ayoph-bbceb.firebaseapp.com",
  databaseURL: "https://ayoph-bbceb.firebaseio.com",
}

export const registerRider = (
  { firebase, firestore },
  newRider,
  statusCallback
) => {
  var secondaryApp = firebase.initializeApp(config, "Secondary")

  return (dispatch, getState) => {
    secondaryApp
      .auth()
      .createUserWithEmailAndPassword(newRider.email, newRider.password)
      .then((res) => {
        secondaryApp.auth().signOut()
        secondaryApp.delete()
        statusCallback("Rider successfully added!")
        return firestore.collection("Accounts").doc(res.user.uid).set({
          firstName: newRider.firstName,
          lastName: newRider.lastName,
          address: newRider.address,
          contact_no: newRider.contactNo,
          disabled: false,
          role: "rider",
          createdAt: new Date(),
        })
      })
      .then(() => {
        dispatch({
          type: "RIDER_SIGNUP_SUCCESS",
        })
      })
      .catch((err) => {
        secondaryApp.auth().signOut()
        secondaryApp.delete()
        dispatch({
          type: "RIDER_SIGNUP_FAIL",
          err,
        })
        statusCallback(err.message)
      })
  }
}
