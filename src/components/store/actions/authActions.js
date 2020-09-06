var config = {
  apiKey: 'AIzaSyBzDU1TQBj_aMrMJXp2ecpf8jBuZ76Jc2k',
  authDomain: 'testrun-834d1.firebaseapp.com',
  databaseURL: 'https://testrun-834d1.firebaseio.com',
};

export const registerAdmin = (
  { firebase, firestore },
  newAdmin,
  statusCallback
) => {
  var secondaryApp = firebase.initializeApp(config, 'Secondary');

  return (dispatch, getState) => {
    secondaryApp
      .auth()
      .createUserWithEmailAndPassword(newAdmin.email, newAdmin.password)
      .then((res) => {
        var actionCodeSettings = {
          url: 'https://testrun-834d1.web.app/',
          handleCodeInApp: false,
        };
        secondaryApp
          .auth()
          .currentUser.sendEmailVerification(actionCodeSettings)
          .then(function () {
            // Verification email sent.
            console.log('email verification sent!');
          })
          .catch(function (error) {
            // Error occurred. Inspect error.code.
            console.log(error.message);
          });

        secondaryApp.auth().signOut();
        secondaryApp.delete();
        statusCallback('success');
        firestore.collection('Accounts').doc(res.user.uid).set({
          firstName: newAdmin.firstName,
          lastName: newAdmin.lastName,
          role: 'admin',
          createdAt: new Date(),
        });
      })
      .then((res) => {
        dispatch({
          type: 'ADMIN_SIGNUP_SUCCESS',
        });
      })
      .catch((err) => {
        secondaryApp.auth().signOut();
        secondaryApp.delete();
        dispatch({
          type: 'ADMIN_SIGNUP_FAIL',
          err,
        });
        statusCallback('fail');
      });
  };
};

export const login = ({ firebase }, credentials, ErrorCallback) => {
  return (dispatch, getState) => {
    return firebase
      .auth()
      .signInWithEmailAndPassword(credentials.email, credentials.password)
      .then((res) => {
        dispatch({
          type: 'LOGIN_SUCCESS',
        });
      })
      .catch((err) => {
        dispatch({
          type: 'LOGIN_FAIL',
          err,
        });
        ErrorCallback(err);
      });
  };
};

export const logout = ({ firebase }) => {
  return (dispatch, getState) => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        dispatch({
          type: 'LOGOUT_SUCCESS',
        });
      });
  };
};
