import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {TextInput, HelperText} from 'react-native-paper';
import {Button} from 'react-native-paper';
import {Formik, useFormik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {color} from '../components/Colors';
import {BASE_URL} from '../config';

const validation = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
  //validation for phone
  email: Yup.string()
    .min(11, 'Phone number must be 11 digits')
    .max(11, 'Phone number must be 12 digits')
    .required('Phone number is required'),

});

const Register = () => {
  const [isloading, setIsLoading] = useState(false);
  const [eye, setEye] = useState(true);
  const navigate = useNavigation();
  //img sourse

  return (
    <>
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.logo}>
            <Image
              source={require('../assets/final_logo.jpeg')}
              style={styles.img}
            />
          </View>
          <Formik
            onSubmit={async (values, {resetForm}) => {
              console.log(values);
              setIsLoading(true);
              await axios
                .post(`${BASE_URL}/Auth/register`, {
                  name: values.name,
                  username: values.username,
                  email: values.email,
                  password: values.password,
                  role: null,
                })
                .then(res => {
                  setIsLoading(false);
                  console.log(res.data);
                  navigate.navigate('Login');
                })
                .catch(err => console.log(err.response));
              resetForm();
            }}
            initialValues={{
              name: '',
              username: '',
              email:'',
              password: '',
            }}
            validationSchema={validation}
            >
            {({handleChange, handleBlur, handleSubmit, values, errors}) => (
              <>
                <View style={styles.form}>
                  <TextInput
                    label="Name"
                    onChangeText={handleChange('name')}
                    value={values.name}
                    style={styles.input}
                    mode="outlined"
                    onBlur={handleBlur('name')}
                  />
                  <HelperText type="error" visible={errors.name}>
                    {errors.name}
                  </HelperText>
                  <TextInput
                    onChangeText={handleChange('username')}
                    label="Username"
                    value={values.username}
                    style={styles.input}
                    mode="outlined"
                    onBlur={handleBlur('username')}
                  />
                  <HelperText type="error" visible={errors.username}>
                    {errors.username}
                  </HelperText>

                  <TextInput
                    onChangeText={handleChange('email')}
                    label="Mobile Number"
                    value={values.email}
                    style={styles.input}
                    mode="outlined"
                    onBlur={handleBlur('email')}
                  />
                  <HelperText type="error" visible={errors.email}>
                    {errors.email}
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
                  <HelperText type="error" visible={errors.password}>
                    {errors.password}
                  </HelperText>
                  <Button
                    loading={isloading}
                    onPress={handleSubmit}
                    disabled={isloading}
                    mode="contained"
                    style={styles.button}>
                    Register
                  </Button>
                  <TouchableOpacity onPress={() => navigate.navigate('Login')}>
                    <Text style={{textAlign: 'center'}}>
                      Already Have Account?
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>
    </>
  );
};

export default Register;

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
    width: '50%',
    height: '50%',
    
  },
  logo: {
    width: 300,
    height: 200,
    marginLeft:12,
    justifyContent:'center',
    alignItems:"center"
    
  },
  form: {
    marginBottom: 50,
  },
});
