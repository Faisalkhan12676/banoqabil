import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './screens/TabNavigator';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './screens/Login';
import Register from './screens/Register';
import StudentRegistration from './screens/StudentRegistration';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import EducationForm from './screens/EducationForm';
import Howtoapply from './screens/Howtoapply';
import ShowStd from './screens/ShowStd';
import SplashSCreen from './screens/SplashScreen';
import AdminCard from './screens/AdminCard';
import AdmissionForm from './screens/AdmissionForm';
import ExamScreen from './screens/ExamScreen';






const stack = createNativeStackNavigator();

const App = () => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  // const authState = useSelector(state => state.LoginReducer.isLoggedIn);
  // console.log(authState);]
  const [splash, setSplash] = useState(true);
  useEffect(() => {
    // ASYNC STORAGE
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // value previously stored
          setAuth(true);
        }
      } catch (e) {
        // error reading value
      }
    };
    getData();

    setTimeout(() => {
      setSplash(false);
    }, 3000);
  }, []);

  const loginstate = useSelector(state => state.LoginReducer.isLoggedIn);

  return (
    <>
      <NavigationContainer>
        <stack.Navigator screenOptions={{headerShown: false}}>
          {loginstate || auth ? (
            <>
            {
              splash ? (
                <stack.Screen name="SplashScreen" component={SplashSCreen} />
              ) : (
                <>
                <stack.Screen name='str' component={ExamScreen} />
                <stack.Screen name="TabNavigator" component={TabNavigator} />
                <stack.Screen name="Registration" component={Howtoapply} />
                <stack.Screen name="ViewDetails" component={ShowStd} />
                <stack.Screen name="admitCard" component={AdminCard} />
                <stack.Screen name='EduDetail' component={EducationForm} />
                <stack.Screen name='Course' component={AdmissionForm} />
                <stack.Screen name='exam' component={ExamScreen} />
                </>
              )

            }
               
            </>
          ) : (
            <>
              {splash ? (
                <>
                  <stack.Screen name="SplashScreen" component={SplashSCreen} />
                </>
              ) : (
                <>
                  <stack.Screen name="Login" component={Login} />
                  <stack.Screen name="Register" component={Register} />
                  {/* <stack.Screen name="TabNavigator" component={TabNavigator}/> */}
                </>
              )}
              {/* <stack.Screen name="Login" component={Login}/>
                <stack.Screen name="Register" component={Register}/> */}
            </>
          )}
          {/* <stack.Screen name="StudentRegistration" component={StudentRegistration} /> */}
        </stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default App;
