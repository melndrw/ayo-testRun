import React from "react"

import { Result, Button, notification } from "antd"

import { useFirebase } from "react-redux-firebase"
import { Redirect } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../store/actions/authActions"

const NotAuthorized = () => {
  const firebase = useFirebase()

  const dispatch = useDispatch()

  const auth = useSelector((state) => state.firebase.auth)

  if (!auth.uid) return <Redirect to="/login" />

  // check if email is verified
  var email = firebase.auth().currentUser
  var emailVerified
  emailVerified = email.emailVerified
  if (emailVerified) return <Redirect to="/" />

  var user = firebase.auth().currentUser
  const resendEmailVerification = () => {
    var actionCodeSettings = {
      url: "https://ayoph-bbceb.web.app/",
      handleCodeInApp: false,
    }
    firebase
      .auth()
      .currentUser.sendEmailVerification(actionCodeSettings)
      .then(function () {
        // Verification email sent.
        notification.success({
          message: "Notification",
          description: "An email has been sent!",
          placement: "topRight",
        })
      })
      .catch(function (error) {
        // Error occurred. Inspect error.code.
        notification.error({
          message: `Notification`,
          description: error.message,
          placement: "topRight",
        })
      })
  }

  const handleLogout = () => {
    dispatch(logout({ firebase }))
  }

  return (
    <Result
      title="Verify Email Address!"
      subTitle="Did not recieve any email verification link? Check your spam folder or click the button below"
      extra={[
        <Button
          type="primary"
          key="console"
          key="1"
          onClick={resendEmailVerification}
        >
          Resend Verification
        </Button>,
        <Button type="primary" key="console" key="2" onClick={handleLogout}>
          Logout
        </Button>,
      ]}
    />
  )
}

export default NotAuthorized
