import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Modal,
  Pressable,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import React, {
  useDebugValue,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {
  List,
  TextInput,
  RadioButton,
  Divider,
  DataTable,
  Button,
  HelperText,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';

import {color} from '../components/Colors';
import * as Yup from 'yup';
import {Formik, useFormik} from 'formik';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import {BASE_URL} from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Recaptcha from 'react-native-recaptcha-that-works';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StudentRegistration = () => {
  const navigate = useNavigation();
  const dispatch = useDispatch();
  const [Id, setId] = useState(null);
  const [image, setImage] = React.useState(null);
  const [ext, setExt] = React.useState(null);
  const [district, setDistrict] = useState([]);
  const [city, setCity] = useState([]);
  const [token, setToken] = useState(null);
  const [imgplaceholder, setImgplaceholder] = useState('Add Image');
  const [isloading, setIsLoading] = useState(true);
  const [isImg, setIsImg] = useState(false);
  const [validateImg, setValidateImg] = useState(false);

  const size = 'normal';
  const $recaptcha = useRef();
  const handleOpenPress = useCallback(() => {
    $recaptcha.current.open();
  }, []);
  const handleClosePress = useCallback(() => {
    $recaptcha.current.close();
  }, []);

  useEffect(() => {
    //GET USER ID FROM ASYNC STORAGE
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);
          setToken(data.token);

          const getStudent = async () => {
            await axios
              .get(`${BASE_URL}/Student/GetByUserIdWithRelationShip`, {
                headers: {Authorization: `Bearer ${data.token}`},
              })
              .then(res => {
                // console.log(res.data);
                console.log(res.data + 'IM FROM STUDENT REGISTRATION');
                navigate.dispatch(StackActions.replace('edu'));
              })
              .catch(err => {
                console.log(err + 'ERR');
                setIsLoading(false);
              });
          };
          getStudent();

          const getCity = async () => {
            await axios
              .get(`${BASE_URL}/City/GetAll`, {
                headers: {Authorization: `Bearer ${data.token}`},
              })
              .then(res => {
                // console.log(res.data);
                setCity(res.data);
              })
              .catch(err => {
                console.log(err);
              });
          };
          getCity();
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    getToken();
  }, []);

  const ImageHandle = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      includeBase64: true,
    };
    launchImageLibrary(options, response => {
      // Same code as in above section!
      // const {base64} = response.assets;
      //  console.log(base64);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ');
      } else if (response.customButton) {
        console.log('User tapped custom button: ');
      } else {
        const {type} = response.assets[0];
        const typeSplit = type.split('/');
        const {base64} = response.assets[0];
        setImgplaceholder('Image Added');
        setImage(base64);
        setExt(typeSplit[1]);
        setIsImg(true);
        setValidateImg(false);
      }
    });
  };

  const handleArea = value => {
    console.log(value + 'ID');
    axios
      .get(`${BASE_URL}/Area/GetByCityId?id=${value}`, {
        headers: {Authorization: `Bearer ${token}`},
      })
      .then(res => {
        setDistrict(res.data);
        // console.log(res.data);
      })
      .catch(err => {
        console.log(err + 'FROM CITY POST');
      });
  };

  //modify designation array with custom key
  const areaarr = district.map((item, index) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const cityarr = city.map((item, index) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  //today date in string
  const today = new Date().toISOString().split('T')[0];

  //NEW FORM WORK
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const validation = Yup.object().shape({
    fatherName: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    gender: Yup.string().required('Required'),
    cnic: Yup.string()
      .matches(
        /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/,
        'Invalid CNIC example: 12345-1234567-1',
      )
      .required('Required'),

    dob: Yup.string().required('Required'),
    FatherOccupation: Yup.string().required('Required'),
    presentAddress: Yup.string().required('Required'),
    cityId: Yup.string().required('Required'),
    whatsappNumber: Yup.string().required('Required'),
    // otherNumber: Yup.string().required('Required'),
    areaId: Yup.string().required('Required'),
    // facebookAccount: Yup.string().required('Required'),
    // linkedinAccount: Yup.string().required('Required'),
    // instagramAccount: Yup.string().required('Required'),
    // email: Yup.string().required('Required'),
  });

  // const skipHandle = () =>{
  //   navigate.navigate('edu');
  // }



  const a = () => {
    handleOpenPress();
  }

  return (
    <>
      {isloading ? (
        <>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator animating={true} color={Colors.green400} />
          </View>
        </>
      ) : (
        <>
          <Formik
            initialValues={{
              fatherName: '',
              gender: '',
              cnic: '',
              income: '',
              dob: '',
              FatherOccupation: '',
              presentAddress: '',
              cityId: '',
              whatsappNumber: '',
              // otherNumber: '',
              areaId: '',
              facebookAccount: '',
              // linkedinAccount: '',
              // instagramAccount: '',
              email: '',
            }}
            validationSchema={validation}
            onSubmit={async (values, {resetForm}) => {
             

              axios
                .post(
                  `${BASE_URL}/Student/Add`,
                  {
                    fatherName: values.fatherName,
                    otherNumber: null,
                    gender: values.gender,
                    dob: values.dob,
                    cnic: values.cnic,
                    fatherOccupation: values.FatherOccupation,
                    areaId: values.areaId,
                    presentAddress: values.presentAddress,
                    userId: 0,
                    enrollmentDate: today,
                    cityId: values.cityId,
                    facebookAccount: values.facebookAccount,
                    linkedinAccount: values.linkedinAccount,
                    instagramAccount: values.instagramAccount,
                    whatsappNumber: values.whatsappNumber,
                    email: values.email,
                  },
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                )
                .then(res => {
                  if(isImg){
                    console.log('DATA POSTED');
                    navigate.navigate('edu');
                    axios.post(
                      `${BASE_URL}/Student/AddImage`,
                      {
                        image: image,
                        ext: ext,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      },
                    );
                    resetForm();
                  }else{
                    console.log("ADD IMAGE FIRST");
                    setValidateImg(true);
                  }
                })
                .catch(err => {
                  console.log(err.response);
                });
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              resetForm,
              setFieldValue,
            }) => (
              <>
                <View
                  style={{
                    width: '100%',
                    marginVertical: 20,
                    alignItems: 'center',
                  }}>
                  <ScrollView style={{width: '90%'}}>
                    <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="Father Name"
                      name="fatherName"
                      onChangeText={handleChange('fatherName')}
                      value={values.fatherName}
                      onBlur={handleBlur('fatherName')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.fatherName && errors.fatherName}>
                      {touched.fatherName && errors.fatherName}
                    </HelperText>

                    {/* <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="Second Number"
                      name="otherNumber"
                      onChangeText={handleChange('otherNumber')}
                      value={values.otherNumber}
                      onBlur={handleBlur('otherNumber')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.otherNumber && errors.otherNumber}>
                      {touched.otherNumber && errors.otherNumber}
                    </HelperText> */}
                    <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="Whatsapp Number"
                      name="whatsappNumber"
                      onChangeText={handleChange('whatsappNumber')}
                      value={values.whatsappNumber}
                      onBlur={handleBlur('whatsappNumber')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.whatsappNumber && errors.whatsappNumber}>
                      {touched.whatsappNumber && errors.whatsappNumber}
                    </HelperText>

                    <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="Email"
                      name="email"
                      onChangeText={handleChange('email')}
                      value={values.email}
                      onBlur={handleBlur('email')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.email && errors.email}>
                      {touched.email && errors.email}
                    </HelperText>

                    <RadioButton.Group
                      onValueChange={handleChange('gender')}
                      value={values.gender}>
                      <RadioButton.Item
                        color={color.primary}
                        style={{marginHorizontal: 20}}
                        label="Male"
                        value="Male"
                      />
                      <RadioButton.Item
                        color={color.primary}
                        style={{marginHorizontal: 20}}
                        label="Female"
                        value="Female"
                      />
                    </RadioButton.Group>
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.gender && errors.gender}>
                      {touched.gender && errors.gender}
                    </HelperText>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginHorizontal: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{marginRight: 100, color: '#000', fontSize: 15}}>
                        Date of Birth
                      </Text>
                      <TouchableOpacity onPress={() => setOpen(true)}>
                        <TextInput
                          style={{width: '100%'}}
                          value={values.dob}
                          onBlur={handleBlur('dob')}
                          disabled={true}
                          placeholder="Date of Birth"
                        />
                      </TouchableOpacity>
                    </View>
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.dob && errors.dob}>
                      {touched.dob && errors.dob}
                    </HelperText>

                    <DatePicker
                      modal
                      open={open}
                      date={date}
                      onConfirm={date => {
                        setOpen(false);
                        const dateString = date.toLocaleDateString();

                        setFieldValue('dob', dateString);
                      }}
                      mode="date"
                      onDateChange={date => {
                        setDate(date);
                        //date in string format
                        const dateString = date.toLocaleDateString();

                        setFieldValue('dob', dateString);
                      }}
                      onCancel={() => {
                        setOpen(false);
                      }}
                    />

                    <TouchableOpacity onPress={ImageHandle}>
                      <View
                        style={{
                          height: 50,
                          marginHorizontal: 20,
                          marginVertical: 10,
                          backgroundColor: '#eee',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 4,
                          borderColor:validateImg ? 'red' : '#eee',
                          borderWidth: validateImg ? 2 : 0,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                          }}>
                          {imgplaceholder}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View>
                      <Text
                        style={{
                          marginHorizontal: 20,
                          fontSize: 18,
                          color: '#000',
                        }}>
                        City
                      </Text>
                      <RNPickerSelect
                        onValueChange={(value, index) => {
                          setFieldValue('cityId', value);
                          handleArea(value);
                        }}
                        placeholder={{
                          label: 'Select City',
                          value: null,
                        }}
                        items={cityarr}
                        value={values.cityId}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={touched.cityId && errors.cityId}>
                        {touched.cityId && errors.cityId}
                      </HelperText>
                    </View>

                    <View>
                      <Text
                        style={{
                          marginHorizontal: 20,
                          fontSize: 18,
                          color: '#000',
                        }}>
                        Area
                      </Text>
                      <RNPickerSelect
                        onValueChange={(value, index) => {
                          setFieldValue('areaId', value);
                        }}
                        placeholder={{
                          label: 'Select Area',
                          value: null,
                        }}
                        items={areaarr}
                        value={values.areaId}
                      />
                      <HelperText
                        type="error"
                        style={{marginHorizontal: 20}}
                        visible={touched.areaId && errors.areaId}>
                        {touched.areaId && errors.areaId}
                      </HelperText>
                    </View>

                    <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="CNIC"
                      name="cnic"
                      onChangeText={value => {
                        //in cnic add - automtic
                        const cnic = value
                          .replace(/\D/g, '')
                          .replace(/(\d{5})(\d{7})(\d{1})/, '$1-$2-$3');
                        setFieldValue('cnic', cnic);
                      }}
                      value={values.cnic}
                      onBlur={handleBlur('cnic')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.cnic && errors.cnic}>
                      {touched.cnic && errors.cnic}
                    </HelperText>

                    <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="Father/Guardian"
                      name="FatherOccupation"
                      onChangeText={handleChange('FatherOccupation')}
                      value={values.FatherOccupation}
                      onBlur={handleBlur('FatherOccupation')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={
                        touched.FatherOccupation && errors.FatherOccupation
                      }>
                      {touched.FatherOccupation && errors.FatherOccupation}
                    </HelperText>

                    <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="Present Address"
                      name="presentAddress"
                      onChangeText={handleChange('presentAddress')}
                      value={values.presentAddress}
                      onBlur={handleBlur('presentAddress')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={touched.presentAddress && errors.presentAddress}>
                      {touched.presentAddress && errors.presentAddress}
                    </HelperText>

                    <TextInput
                      style={styles.input}
                      mode="flat"
                      placeholder="Facebook Account"
                      name="facebookAccount"
                      onChangeText={handleChange('facebookAccount')}
                      value={values.facebookAccount}
                      onBlur={handleBlur('facebookAccount')}
                      activeUnderlineColor={color.primary}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={
                        touched.facebookAccount && errors.facebookAccount
                      }>
                      {touched.facebookAccount && errors.facebookAccount}
                    </HelperText>

                    {/* <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="Instagram Account"
                      name="instagramAccount"
                      onChangeText={handleChange('instagramAccount')}
                      value={values.instagramAccount}
                      onBlur={handleBlur('instagramAccount')}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={
                        touched.instagramAccount && errors.instagramAccount
                      }>
                      {touched.instagramAccount && errors.instagramAccount}
                    </HelperText> */}

                    {/* <TextInput
                      style={{marginHorizontal: 20, marginVertical: 10}}
                      mode="flat"
                      placeholder="LinkedIn Account"
                      name="instagramAccount"
                      onChangeText={handleChange('linkedinAccount')}
                      value={values.linkedinAccount}
                      onBlur={handleBlur('linkedinAccount')}
                    />
                    <HelperText
                      type="error"
                      style={{marginHorizontal: 20}}
                      visible={
                        touched.linkedinAccount && errors.linkedinAccount
                      }>
                      {touched.linkedinAccount && errors.linkedinAccount}
                    </HelperText> */}

                    <View>
                      <Button
                        mode="contained"
                        style={{
                          backgroundColor: color.primary,
                          marginHorizontal: 10,
                          marginVertical: 15,
                        }}
                        onPress={handleOpenPress}>
                          
                        Submit
                      </Button>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <Button
                          mode="text"
                          color={color.primary}
                          style={{
                            marginHorizontal: 10,
                            marginVertical: 15,
                          }}
                          onPress={resetForm}>
                          Clear
                        </Button>
                        <Recaptcha
                          ref={$recaptcha}
                          lang="en"
                          headerComponent={
                            <SafeAreaView>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                  paddingVertical: 10,
                                }}>
                                <Icon
                                  name="close"
                                  size={30}
                                  style={{marginRight: 10}}
                                  onPress={handleClosePress}
                                />
                              </View>
                            </SafeAreaView>
                          }
                          loadingComponent={
                            <>
                              <ActivityIndicator color="green" />
                              <Text style={{color: '#fff'}}>
                                Loading reCaptcha...
                              </Text>
                            </>
                          }
                          siteKey="6LfkbEMgAAAAAIkc9Cd-pls5ZspaVywaGQfgG4Dl"
                          baseUrl="http://127.0.0.1"
                          size={size}
                          theme="light"
                          onError={err => {
                            alert('SOMETHING WENT WRONG');
                            // console.warn(err);
                          }}
                          onExpire={() => alert('TOKEN EXPIRED')}
                          onVerify={token => {
                            axios
                              .post(`${BASE_URL}/Auth/Recaptcha?token=${token}`)
                              .then(res => {
                                if (res.data === true) {
                                  handleSubmit();
                                } else {
                                  alert('Verification failed');
                                }
                              })
                              .catch(err => {
                                console.log(err);
                              });
                            console.log(token);
                            handleSubmit();
                          }}
                        />

                        {/* <Button
                        mode='text'
                        color={color.primary}
                        style={{
                          marginHorizontal: 10,
                          marginVertical: 15,
                        }}
                        onPress={skipHandle}>
                        Skip
                      </Button> */}
                      </View>
                    </View>
                  </ScrollView>
                </View>
              </>
            )}
          </Formik>
        </>
      )}
    </>
  );
};

export default StudentRegistration;

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 20,
    marginVertical: 10,
    height: 65,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

{
  /* <ScrollView style={{marginBottom: 90}}>
<Formik
  initialValues={{
    name: '',
    fatherName: '',
    phone: '',
    email: '',
    gender: '',
    cnic: '',
    income: '',
    domicile: '',
    occupation: '',
    religion: '',
    district: '',
    address: '',
  }}
  onSubmit={values => {
    console.log(values);
  }}>
  {({handleChange, handleBlur, handleSubmit, values}) => (
    <>
      <View style={styles.container}>
        <Text
          style={{
            marginHorizontal: 20,
            marginVertical: 10,
            color: color.black,
          }}>
          Basic Information
        </Text>
        <Divider style={{borderWidth: 1, borderColor: color.divider}} />
        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          placeholder="Name"
          name="name"
          onChangeText={handleChange('name')}
          value={values.name}
          onBlur={handleBlur('name')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={touched.name && errors.name}>
          {touched.name && errors.name}
        </HelperText>

        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          placeholder="Father Name"
          name="fatherName"
          onChangeText={handleChange('fatherName')}
          value={values.fatherName}
          onBlur={handleBlur('fatherName')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={
            touched.fatherName && errors.fatherName
          }>
          {touched.fatherName && errors.fatherName}
        </HelperText>

        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          keyboardType="numeric"
          placeholder="Phone Number"
          name="phone"
          onChangeText={handleChange('phone')}
          value={values.phone}
          onBlur={handleBlur('phone')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={touched.phone && errors.phone}>
          {touched.phone && errors.phone}
        </HelperText>

        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          keyboardType="email-address"
          placeholder="Email"
          name="email"
          onChangeText={handleChange('email')}
          value={values.email}
          onBlur={handleBlur('email')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={touched.email && errors.email}>
          {touched.email && errors.email}
        </HelperText>

        <Text style={{marginHorizontal: 20, color: color.black}}>
          Gender
        </Text>
        <RadioButton.Group
          onValueChange={handleChange('gender')}
          value={values.gender}>
          <RadioButton.Item
            color={color.primary}
            style={{marginHorizontal: 20}}
            label="Male"
            value="Male"
          />
          <RadioButton.Item
            color={color.primary}
            style={{marginHorizontal: 20}}
            label="Female"
            value="Female"
          />
        </RadioButton.Group>
        <Divider style={{borderWidth: 1, borderColor: color.divider}} />
        <Text
          style={{
            marginHorizontal: 20,
            marginVertical: 10,
            color: color.black,
          }}>
          Personal Information
        </Text>
        <Divider style={{borderWidth: 1, borderColor: color.divider}} />
        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          placeholder="CNIC"
          name="cnic"
          onChangeText={handleChange('cnic')}
          value={values.cnic}
          onBlur={handleBlur('cnic')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={touched.cnic && errors.cnic}>
          {touched.cnic && errors.cnic}
        </HelperText>

        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          placeholder="Father Monthly Income"
          name="income"
          onChangeText={formik.handleChange('income')}
          value={formik.values.income}
          onBlur={formik.handleBlur('income')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={formik.touched.income && formik.errors.income}>
          {formik.touched.income && formik.errors.income}
        </HelperText>

        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          placeholder="
    Father Occupation"
          name="occupation"
          onChangeText={formik.handleChange('occupation')}
          value={formik.values.occupation}
          onBlur={formik.handleBlur('occupation')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={
            formik.touched.occupation && formik.errors.occupation
          }>
          {formik.touched.occupation && formik.errors.occupation}
        </HelperText>

        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          placeholder="Domicile"
          name="domicile"
          onChangeText={formik.handleChange('domicile')}
          value={formik.values.domicile}
          onBlur={formik.handleBlur('domicile')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={formik.touched.domicile && formik.errors.domicile}>
          {formik.touched.domicile && formik.errors.domicile}
        </HelperText>

        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          placeholder="Religion"
          name="religion"
          onChangeText={formik.handleChange('religion')}
          value={formik.values.religion}
          onBlur={formik.handleBlur('religion')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={formik.touched.religion && formik.errors.religion}>
          {formik.touched.religion && formik.errors.religion}
        </HelperText>

        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          placeholder="District"
          name="district"
          onChangeText={formik.handleChange('district')}
          value={formik.values.district}
          onBlur={formik.handleBlur('district')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={formik.touched.district && formik.errors.district}>
          {formik.touched.district && formik.errors.district}
        </HelperText>

        <TextInput
          style={{marginHorizontal: 20, marginVertical: 10}}
          mode="flat"
          placeholder="Present Address"
          name="address"
          onChangeText={formik.handleChange('address')}
          value={formik.values.address}
          onBlur={formik.handleBlur('address')}
        />
        <HelperText
          type="error"
          style={{marginHorizontal: 20}}
          visible={formik.touched.address && formik.errors.address}>
          {formik.touched.address && formik.errors.address}
        </HelperText>

        <Divider style={{borderWidth: 1, borderColor: color.divider}} />
        <Text
          style={{
            marginHorizontal: 20,
            marginVertical: 10,
            color: color.black,
          }}>
          Education & Qualification
        </Text>
        <Divider style={{borderWidth: 1, borderColor: color.divider}} />
      </View>

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Certificate</DataTable.Title>
          <DataTable.Title>Year</DataTable.Title>
          <DataTable.Title>Grade</DataTable.Title>
          <DataTable.Title>School & Collage</DataTable.Title>
        </DataTable.Header>
        <DataTable.Row>
          <DataTable.Cell>SSC</DataTable.Cell>
          <DataTable.Cell>SSC</DataTable.Cell>
          <DataTable.Cell>SSC</DataTable.Cell>
          <DataTable.Cell>SSC</DataTable.Cell>
        </DataTable.Row>
      </DataTable>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={{marginHorizontal: 20, marginVertical: 10}}
                mode="flat"
                placeholder="Certificate"
                name="certificate"
                onChangeText={eduformik.handleChange('certificate')}
                value={eduformik.values.certificate}
                onBlur={eduformik.handleBlur('certificate')}
              />
              <HelperText
                type="error"
                style={{marginHorizontal: 20}}
                visible={
                  eduformik.touched.certificate &&
                  eduformik.errors.certificate
                }>
                {eduformik.touched.certificate &&
                  eduformik.errors.certificate}
              </HelperText>

              <TextInput
                style={{marginHorizontal: 20, marginVertical: 10}}
                mode="flat"
                placeholder="Year"
                name="year"
                onChangeText={eduformik.handleChange('year')}
                value={eduformik.values.year}
                onBlur={eduformik.handleBlur('year')}
              />
              <HelperText
                type="error"
                style={{marginHorizontal: 20}}
                visible={
                  eduformik.touched.year && eduformik.errors.year
                }>
                {eduformik.touched.year && eduformik.errors.year}
              </HelperText>
              <TextInput
                style={{marginHorizontal: 20, marginVertical: 10}}
                mode="flat"
                placeholder="Grade"
                name="grade"
                onChangeText={eduformik.handleChange('grade')}
                value={eduformik.values.grade}
                onBlur={eduformik.handleBlur('grade')}
              />
              <HelperText
                type="error"
                style={{marginHorizontal: 20}}
                visible={
                  eduformik.touched.grade && eduformik.errors.grade
                }>
                {eduformik.touched.grade && eduformik.errors.grade}
              </HelperText>
              <TextInput
                style={{marginHorizontal: 20, marginVertical: 10}}
                mode="flat"
                placeholder="School & Collage"
                name="school"
                onChangeText={eduformik.handleChange('school')}
                value={eduformik.values.school}
                onBlur={eduformik.handleBlur('school')}
              />
              <HelperText
                type="error"
                style={{marginHorizontal: 20}}
                visible={
                  eduformik.touched.school && eduformik.errors.school
                }>
                {eduformik.touched.school && eduformik.errors.school}
              </HelperText>

              <Button
                style={{
                  marginHorizontal: 20,
                  marginVertical: 10,
                  backgroundColor: color.primary,
                }}
                mode="contained"
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
                Add
              </Button>
            </View>
          </View>
        </Modal>
        <Button
          style={{
            marginHorizontal: 20,
            marginVertical: 10,
            backgroundColor: color.primary,
          }}
          mode="contained"
          onPress={() => setModalVisible(true)}>
          Add Education
        </Button>
      </View>
      {/* EDUCATION SECTION */
}

{
  /* Experiences SECTION */
}
//       <Divider style={{borderWidth: 1, borderColor: color.divider}} />
//       <Text
//         style={{
//           marginHorizontal: 20,
//           marginVertical: 10,
//           color: color.black,
//         }}>
//         Experiences
//       </Text>
//       <Divider style={{borderWidth: 1, borderColor: color.divider}} />
//       <DataTable>
//         <DataTable.Header>
//           <DataTable.Title>Post</DataTable.Title>
//           <DataTable.Title>Depart Name</DataTable.Title>
//           <DataTable.Title>Year</DataTable.Title>
//         </DataTable.Header>
//         <DataTable.Row>
//           <DataTable.Cell>SSC</DataTable.Cell>
//           <DataTable.Cell>SSC</DataTable.Cell>
//           <DataTable.Cell>SSC</DataTable.Cell>
//         </DataTable.Row>
//       </DataTable>
//       <View style={styles.centeredView}>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalExp}
//           onRequestClose={() => {
//             Alert.alert('Modal has been closed.');
//             setModalExp(!modalExp);
//           }}>
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <TextInput
//                 style={{marginHorizontal: 20, marginVertical: 10}}
//                 mode="flat"
//                 placeholder="Post"
//               />
//               <TextInput
//                 style={{marginHorizontal: 20, marginVertical: 10}}
//                 mode="flat"
//                 placeholder="Depart Name"
//               />
//               <TextInput
//                 style={{marginHorizontal: 20, marginVertical: 10}}
//                 mode="flat"
//                 placeholder="Year"
//               />

//               <Button
//                 style={{
//                   marginHorizontal: 20,
//                   marginVertical: 10,
//                   backgroundColor: color.primary,
//                 }}
//                 mode="contained"
//                 onPress={() => {
//                   setModalExp(!modalExp);
//                 }}>
//                 Add
//               </Button>
//             </View>
//           </View>
//         </Modal>
//         <Button
//           style={{
//             marginHorizontal: 20,
//             marginVertical: 10,
//             backgroundColor: color.primary,
//           }}
//           mode="contained"
//           onPress={() => setModalExp(true)}>
//           Add Experience
//         </Button>
//       </View>
//       {/* Experiences SECTION */}

//       {/* Course Information & Admission */}
//       <Divider style={{borderWidth: 1, borderColor: color.divider}} />
//       <Text
//         style={{
//           marginHorizontal: 20,
//           marginVertical: 10,
//           color: color.black,
//         }}>
//         Course Information & Admission
//       </Text>
//       <Divider style={{borderWidth: 1, borderColor: color.divider}} />
//       <DataTable>
//         <DataTable.Header>
//           <DataTable.Title>Prefernces</DataTable.Title>
//           <DataTable.Title>Depart Name</DataTable.Title>
//           <DataTable.Title>Trade Name</DataTable.Title>
//           <DataTable.Title>District</DataTable.Title>
//         </DataTable.Header>
//         <DataTable.Row>
//           <DataTable.Cell>SSC</DataTable.Cell>
//           <DataTable.Cell>SSC</DataTable.Cell>
//           <DataTable.Cell>SSC</DataTable.Cell>
//           <DataTable.Cell>SSC</DataTable.Cell>
//         </DataTable.Row>
//       </DataTable>
//       <View style={styles.centeredView}>
//         <Modal
//           animationType="slide"
//           transparent={true}
//           visible={modalcia}
//           onRequestClose={() => {
//             Alert.alert('Modal has been closed.');
//             setModalcia(!modalcia);
//           }}>
//           <View style={styles.centeredView}>
//             <View style={styles.modalView}>
//               <TextInput
//                 style={{marginHorizontal: 20, marginVertical: 10}}
//                 mode="flat"
//                 placeholder="Prefernces"
//               />
//               <TextInput
//                 style={{marginHorizontal: 20, marginVertical: 10}}
//                 mode="flat"
//                 placeholder="Depart Name"
//               />
//               <TextInput
//                 style={{marginHorizontal: 20, marginVertical: 10}}
//                 mode="flat"
//                 placeholder="Trade Name"
//               />
//               <TextInput
//                 style={{marginHorizontal: 20, marginVertical: 10}}
//                 mode="flat"
//                 placeholder="District"
//               />

//               <Button
//                 style={{
//                   marginHorizontal: 20,
//                   marginVertical: 10,
//                   backgroundColor: color.primary,
//                 }}
//                 mode="contained"
//                 onPress={() => {
//                   setModalcia(!modalcia);
//                 }}>
//                 Add
//               </Button>
//             </View>
//           </View>
//         </Modal>
//         <Button
//           style={{
//             marginHorizontal: 20,
//             marginVertical: 10,
//             backgroundColor: color.primary,
//           }}
//           mode="contained"
//           onPress={() => setModalcia(true)}>
//           Add Course Information & Admission
//         </Button>
//       </View>
//       {/* Course Information & Admission */}
//     </>
//   )}
// </Formik>
// </ScrollView>
// {/* SUBMIT BTN */}
// <View
// style={{
//   bottom: 0,
//   left: 0,
//   right: 0,
//   backgroundColor: '#fff',
//   padding: 10,
//   position: 'absolute',
// }}>
// <Button
//   style={{marginHorizontal: 20, marginVertical: 10}}
//   mode="contained"
//   onPress={() => {
//     formik.handleSubmit();
//   }}
//   disabled={false}>
//   Submit
// </Button>
// </View>
// SUBMIT BTN */}
