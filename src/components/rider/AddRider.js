import React, { useState } from "react";

import { Row, Steps, message } from "antd";

import { useDispatch } from "react-redux";
import {
  useFirebase,
  useFirestore,
  useFirestoreConnect,
} from "react-redux-firebase";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import RidersNav from "./RidersNav";
import Basic from "./steps/Basic";
import RiderCredentials from "./steps/RiderCredentials";
import SuccessRegistration from "./steps/SuccessRegistration";
import { registerRider } from "../store/actions/riderActions";
import { withRouter } from "react-router-dom";

const { Step } = Steps;

const AddRider = ({ history }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [basic, setBasic] = useState();

  const [err, setErr] = useState();

  const [isLoading, setLoading] = useState(false);

  const firebase = useFirebase();

  const firestore = useFirestore();

  const dispatch = useDispatch();

  useFirestoreConnect("Accounts");

  // authentication
  const auth = useSelector(state => state.firebase.auth);
  if (!auth.uid) return <Redirect to="/login" />;

  // First Step
  const onFinish = basic => {
    setBasic(basic);
    setCurrentStep(currentStep + 1);
  };

  // Last Step
  const onSubmit = rider => {
    setErr(null);
    setLoading(true);
    const riderInfo = { ...basic, ...rider };
    // setCurrentStep(currentStep + 1)
    dispatch(
      registerRider({ firebase, firestore }, riderInfo, msg => {
        {
          setLoading(false);
          message.info(msg, [2], () => {
            history.push("/riders");
          });
        }
      })
    );
  };

  const steps = [
    {
      title: "Basic",
      content: <Basic onFinish={onFinish} />,
    },
    {
      title: "Crendentials",
      content: (
        <RiderCredentials
          onSubmit={onSubmit}
          isLoading={isLoading}
          setLoading={setLoading}
        />
      ),
    },
    {
      title: "Done",
      content: <SuccessRegistration err={err} isLoading={isLoading} />,
    },
  ];

  return (
    <>
      <RidersNav />
      <Row justify="center">
        <Steps size="small" current={currentStep} style={stepsStyle}>
          {steps.map((step, idx) => (
            <Step key={idx} title={step.title} />
          ))}
        </Steps>
      </Row>
      <div className="steps-content">{steps[currentStep].content}</div>
    </>
  );
};

export default withRouter(AddRider);

const stepsStyle = {
  width: "50%",
};
