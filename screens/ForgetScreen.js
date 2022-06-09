import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {TextInput, HelperText, Button} from 'react-native-paper';
import {color} from '../components/Colors';
import {useNavigation, StackActions} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '../config';

const ForgetScreen = () => {
  const [disbleText, setDisbleText] = useState(false);
  const [code, setCode] = useState('');
  const navigation = useNavigation();
  const [usernameErr, setUsernameErr] = useState('');
  const [username, setUsername] = useState('');

  const handleCode = () => {
    console.log('code', code);
    axios
      .post(`${BASE_URL}/Auth/OtpVarification`, {
        username: username,
        otp: code,
      })
      .then(res => {
        console.log(res);
        //replace screen with payload
        navigation.dispatch(
          StackActions.replace('NewPassword', {
            username: username,
          }),
        );
      })
      .catch(err => {
        console.log('err', err);
      });
  };

  return (
    <>
      <Formik
        initialValues={{
          username: '',
        }}
        onSubmit={(values, {resetForm}) => {
          console.log(values);
          setUsername(values.username);
          axios
            .post(`${BASE_URL}/Auth/ForgotPassword?Username=${values.username}`)
            .then(res => {
              if (res.status === 200) {
                console.log('RESPONSE', res);
                setUsernameErr('');
                setDisbleText(true);
              }
            })
            .catch(err => {
              console.log(err.response.data);
              setUsernameErr(err.response.data);
              setDisbleText(false);
            });
        }}
        validationSchema={Yup.object().shape({
          username: Yup.string().required('Username is required'),
        })}>
        {({handleChange, handleSubmit, values, errors, touched}) => (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              padding: 20,
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: color.primary,
                marginBottom: 20,
              }}>
              Forget Password
            </Text>
            <TextInput
              style={styles.input}
              mode="flat"
              activeUnderlineColor={color.primary}
              label="Username"
              onChangeText={handleChange('username')}
              value={values.username}
              disabled={disbleText}
            />
            {disbleText ? (
              <></>
            ) : (
              <>
                <HelperText
                  style={{
                    color: 'red',
                  }}>
                  {usernameErr}
                </HelperText>
                <HelperText>
                  Please Enter Your Username We will send You 6 Digit
                  Verification Code
                </HelperText>
              </>
            )}

            <HelperText
              type="error"
              visible={errors.username && touched.username}>
              {errors.username}
            </HelperText>
            {disbleText ? (
              <>
                <TextInput
                  mode="flat"
                  activeUnderlineColor={color.primary}
                  label="Enter Code"
                  onChangeText={text => setCode(text)}
                  value={code}
                />
                <HelperText
                  style={{
                    marginVertical: 10,
                  }}>
                  Please Enter Your 6 Digit Verification Code You Just Received
                  From Alkhidmat
                </HelperText>
                <Button
                  mode="contained"
                  color={color.primary}
                  disabled={code.length < 6 || code.length > 6}
                  style={styles.button}
                  onPress={handleCode}>
                  Varify
                </Button>
              </>
            ) : (
              <>
                <Button
                  mode="contained"
                  color={color.primary}
                  style={styles.button}
                  onPress={handleSubmit}>
                  Confirmed
                </Button>
              </>
            )}
          </View>
        )}
      </Formik>
    </>
  );
};

export default ForgetScreen;

const styles = StyleSheet.create({});
