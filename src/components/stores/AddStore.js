import React, { useState, useEffect } from 'react';

import { Row, Steps, message } from 'antd';

import { useSelector, useDispatch } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { useFirebase, useFirestore } from 'react-redux-firebase';

import StoresNav from './StoresNav';
import Basic from './steps/Basic';
import OwnerCredentials from './steps/OwnerCredentials';
import SuccessRegistration from './steps/SuccessRegistration';
import { addStore } from '../store/actions/storeActions';
import Map from './steps/Map';

const { Step } = Steps;

const AddStore = ({ history }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [basic, setBasic] = useState();

  const [location, setLocation] = useState();

  const [errMsg, setErrMsg] = useState();

  const [isLoading, setLoading] = useState();

  const firebase = useFirebase();

  const firestore = useFirestore();

  const dispatch = useDispatch();

  // Redirect if not logged
  const auth = useSelector((state) => state.firebase.auth);
  if (!auth.uid) return <Redirect to="/login" />;

  // On submit
  const onSubmit = (credentials) => {
    setErrMsg(null);
    setLoading(true);
    const storeInfo = { ...basic, ...location, ...credentials };
    const uploaded = storeInfo.upload;
    const { weekdays, saturday, sunday } = storeInfo;
    const openAndClose = {
      weekdays: {
        opening: weekdays[0]._d.toLocaleTimeString(),
        closing: weekdays[1]._d.toLocaleTimeString(),
      },
      saturday: {
        opening: saturday[0]._d.toLocaleTimeString(),
        closing: saturday[1]._d.toLocaleTimeString(),
      },
      sunday: {
        opening: sunday[0]._d.toLocaleTimeString(),
        closing: sunday[1]._d.toLocaleTimeString(),
      },
    };
    dispatch(
      addStore(
        { firebase, firestore },
        storeInfo,
        uploaded,
        openAndClose,
        (msg) => {
          setLoading(false);
          message.info(msg, [2], () => {
            history.push('/stores');
          });
        }
      )
    );
  };

  // First Step
  const onFinish = (basic) => {
    setBasic(basic);
    setCurrentStep(currentStep + 1);
  };

  // Second Step
  const onFinish2 = (location) => {
    setLocation(location);
    setCurrentStep(currentStep + 1);
  };

  const steps = [
    {
      title: 'Store',
      content: <Basic onFinish={onFinish} />,
    },
    {
      title: 'Location',
      content: <Map onFinish2={onFinish2} />,
    },
    {
      title: 'Owner Crendentials',
      content: <OwnerCredentials onSubmit={onSubmit} isLoading={isLoading} />,
    },
    {
      title: 'Done',
      content: <SuccessRegistration isLoading={isLoading} errMsg={errMsg} />,
    },
  ];

  return (
    <>
      <StoresNav />
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

export default withRouter(AddStore);

const stepsStyle = {
  width: '70%',
};
