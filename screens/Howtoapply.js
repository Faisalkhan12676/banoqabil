import {StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import AdmissionForm from './AdmissionForm';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import StudentRegistration from './StudentRegistration';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import ShowStd from './ShowStd';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ActivityIndicator} from 'react-native-paper';
import axios from 'axios';
import {BASE_URL} from '../config';
import LottieView from 'lottie-react-native';

const Howtoapply = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigation = useNavigation();
  const stepOne = useSelector(state => state.StepReducer.stepOne);
  const [loading, setLoading] = useState(true);
  //hit function when stepOne is true
  useEffect(() => {
    const isStudentRegistered = async () => {
      AsyncStorage.getItem('@userlogininfo')
        .then(res => {
          const data = JSON.parse(res).userid;
          console.log(data);
          axios
            .get(`${BASE_URL}/Student/GetByUserIdWithRelationShip?id=${data}`)
            .then(res => {
              console.log(res.status);
              if (res.status == 200) {
                setActiveStep(1);
                setLoading(false);
                const Id = JSON.stringify(res.data.student.id);
                AsyncStorage.setItem('@studentId', Id);
              }
            })
            .catch(err => {
              console.log(err);
              console.log(err.response.status);
              if(err.response.status == 500){
                setActiveStep(0);
                setLoading(false);
              }
            });
        })
        .catch(err => {
          console.log(err);
        });
    };




    isStudentRegistered();
    if (stepOne) {
      setActiveStep(1);
    }
  }, [stepOne]);
  const handlesubmit = () => {
    setActiveStep(0);
    if (activeStep) {
      navigation.navigate('home');
    }
  };
  return (
    <>
      <StudentRegistration/>
    </>
  );
};

export default Howtoapply;

const styles = StyleSheet.create({});

//previousBtnDisabled={false}
