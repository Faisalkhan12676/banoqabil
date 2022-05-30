import React, {useEffect, useState} from 'react';
import Home from './Home';
import Howtoapply from './Howtoapply';
import News from './News';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch} from 'react-redux';
import EducationForm from './EducationForm';
import StudentRegistration from './StudentRegistration';
import ExperienceForm from './ExperienceForm';
import AdmissionForm from './AdmissionForm';




import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminCard from './AdminCard';
import { color } from '../components/Colors';


const tabs = createBottomTabNavigator();

const TabNavigator = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getStdId = async () => {
     

      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // value previously stored
          console.log(JSON.stringify(user));
          // console.log(user."http://schemas.microsoft.com/ws/2008/06/identity/claims/role");
        }
      } catch (e) {
        // error reading value
      }
    };
    getStdId();
  }, []);

 

  return (
    <>
      <tabs.Navigator
        initialRouteName="Standings"
        screenOptions={({route, navigation}) => ({
          tabBarLabel: navigation.isFocused() ? route.name : '',
          tabBarIcon: ({focused, color, size}) => {
            let iconName;
            let setColor;
            if (route.name === 'home') {
              iconName = focused ? 'home' : 'home-outline';
              setColor = focused ? '#2A9381' : '#eee';
            } else if (route.name === 'news') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
              setColor = focused ? '#2A9381' : '#eee';
            } else if (route.name === 'Registration') {
              iconName = focused ? 'book' : 'book-outline';
              setColor = focused ? '#2A9381' : '#eee';
            }else if(route.name === 'admitcard'){
              iconName = focused ? 'book' : 'book-outline';
              setColor = focused ? '#2A9381' : '#eee';
            }
            return <Icon name={iconName} size={30} color={setColor} />;
          },
          headerShown: false,
          tabBarActiveTintColor: '#7de06b',
        })}>
        <tabs.Screen name="home" component={Home} />
        {/* <tabs.Screen name="news" component={News} /> */}
        {/* <tabs.Screen name="admitcard" component={AdminCard} /> */}
        {/* <tabs.Screen name="Registration" component={Howtoapply} /> */}
        {/* <tabs.Screen name="education" component={EducationForm} /> */}
        {/* <tabs.Screen name="admission" component={AdmissionForm} /> */}
        {/* <tabs.Screen name="experrience" component={ExperienceForm} /> */}

      </tabs.Navigator>
    </>
  );
};

export default TabNavigator;
