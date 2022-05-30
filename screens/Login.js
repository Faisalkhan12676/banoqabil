import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput, HelperText} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {Formik, useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {color} from '../components/Colors';
import {BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';

const validation = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
});

const Login = () => {
  const [isloading, setIsLoading] = useState(false);
  const [eye, setEye] = useState(true);
  const navigate = useNavigation();
  const dispatch = useDispatch();

  const loginstate = useSelector(state => state.LoginReducer.isLoggedIn);
  const [toast, setToast] = useState('');

  return (
    <>
      <Formik
        initialValues={{
          username: '',
          password: '',
        }}
        validationSchema={validation}
        onSubmit={(values, {resetForm}) => {
          setIsLoading(true);

          axios
            .post(`${BASE_URL}/Auth/login`, values)
            .then(res => {
              const data = JSON.stringify(res.data);
              try {
                AsyncStorage.setItem('@userlogininfo', data);
                console.log('data', data);
                dispatch({type: 'LOGIN'});
                if (loginstate) {
                  navigate.navigate('str');
                }
                resetForm();
              } catch (e) {
                // saving error
              }
            })
            .catch(err => {
              console.log(err.response);
              // console.log(err.response.data);
              setToast('Username or Password is incorrect');
              setIsLoading(false);
            });
        }}>
        {({handleChange, handleBlur, handleSubmit, values, errors,touched}) => (
          <View style={styles.container}>
            <View style={styles.logo}>
              <Image
                source={require('../assets/final_logo.jpeg')}
                style={styles.img}
              />
            </View>
            <View>
              <Text style={{color:"red"}}>{toast}</Text>
            </View>
            <View>
              <TextInput
                
                label="Username"
                onChangeText={handleChange('username')}
                value={values.name}
                style={styles.input}
                mode="outlined"
                onBlur={handleBlur('username')}
              />
              <HelperText
                type="error"
                visible={errors.username && touched.username}>
                {errors.username}
              </HelperText>

              <TextInput
                label="Password"
                secureTextEntry={eye}
                value={values.password}
                mode="outlined"
                onBlur={handleBlur('password')}
                onChangeText={handleChange('password')}
                right={
                  <TextInput.Icon
                    name={eye ? 'eye-off' : 'eye'}
                    onPress={() => (eye ? setEye(false) : setEye(true))}
                  />
                }
                style={styles.input}
              />
              <HelperText
                style={{textAlign: 'left'}}
                type="error"
                visible={errors.password}>
                {errors.password}
              </HelperText>
              <Button
                loading={isloading}
                onPress={handleSubmit}
                disabled={isloading}
                mode="contained"
                style={styles.button}>
                login
              </Button>
            </View>
            <TouchableOpacity onPress={() => navigate.navigate('Register')}>
              <Text>Don't Have Account?</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  input: {
    width: 300,
    height: 50,
    marginLeft: 10,
  },
  button: {
    width: 300,
    margin: 10,
    backgroundColor: color.primary,
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

// const getData = async () => {
//   try {
//     const value = await AsyncStorage.getItem('@userInfo');
//     if (value !== null) {
//       // value previously stored
//       console.log(value);
//       console.log("API LOGIN")
//     }
//   } catch (e) {
//     // error reading value
//   }
// };
// getData();
