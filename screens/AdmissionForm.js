import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Button,
  Paragraph,
  TextInput,
  HelperText,
  DataTable,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import {Field, Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import RNPickerSelect from 'react-native-picker-select';
import CheckBox from '@react-native-community/checkbox';
import {color} from '../components/Colors';
import {StackActions, useNavigation} from '@react-navigation/native';

const AdmissionForm = () => {
  const navigate = useNavigation();
  const [stdID, setStdId] = useState(null);
  const [course, setCourse] = useState([]);
  const [token, setToken] = useState(null);
  const [getcourse, setGetCourse] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');

  useEffect(() => {
    //get login token from asyncstorage
    const getToken = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);
          setToken(data.token);

          await axios
            .get(`${BASE_URL}/StudentAdmissionDetail/GetAllCourse`, {
              headers: {Authorization: 'Bearer ' + data.token},
            })
            .then(res => {
              setGetCourse(res.data);
              const x = res.data
                .filter(e => e.active === 'True')
                .map(e => e.active);
              if (x.includes('True')) {
                navigate.dispatch(StackActions.replace('TabNavigator'));
              }
              setIsLoading(false);
            })
            .catch(err => {
              console.log(err);
              console.log('ERROR COURSEALL');
            });
        }
      } catch (error) {
        // Error retrieving data
      }
    };
    getToken();

    const getStdId = async () => {
      axios
        .get(`${BASE_URL}/Course/GetAll`, {
          headers: {Authorization: 'Bearer ' + token},
        })
        .then(res => {
          setCourse(res.data);
          console.log('COURSE  RESPONSE');
        })
        .catch(err => {
          console.log('ERROR COURSE');
        });
    };
    getStdId();

    // const backAction = () => {
    //   Alert.alert("Hold on!", "Are you sure you want to go back?", [
    //     {
    //       text: "Cancel",
    //       onPress: () => null,
    //       style: "cancel"
    //     },
    //     { text: "YES", onPress: () => BackHandler.exitApp() }
    //   ]);
    //   return true;
    // };

    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   backAction
    // );

    // return () => backHandler.remove();
  }, []);

  const validation = Yup.object().shape({});

  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  const x = getcourse.filter(e => e.active === 'True').map(e => e.active);
  console.log(x);

  return (
    <>
      {isloading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator animating={true} color={Colors.green400} />
        </View>
      ) : (
        <>
          <View
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '100%',
                paddingHorizontal: 20,
                paddingVertical: 40,
              }}>
              <Text style={styles.modalText}>Courses</Text>

              <Formik
                initialValues={{
                  checked: [],
                }}
                onSubmit={async (values, {resetForm}) => {
                  console.log(values.checked);
                  resetForm();
                  await axios
                    .post(
                      `${BASE_URL}/StudentAdmissionDetail/AddRangeMulti`,
                      values.checked,
                      {
                        headers: {
                          Authorization: 'Bearer ' + token,
                        },
                      },
                    )
                    .then(res => {
                      console.log(res.data);
                      console.log('COURSE ADDED');
                      navigate.replace('TabNavigator');
                    })
                    .catch(err => {
                      console.log(err);
                    });
                }}
                validationSchema={validation}>
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <>
                    {/* SELCET ONLY 1 CHECK BOX */}

                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title>Course Name</DataTable.Title>
                      </DataTable.Header>
                      {course.map((item, i) => (
                        <>
                          <DataTable.Row
                            key={i}
                            style={{
                              justifyContent: 'flex-start',
                            }}>
                            <CheckBox
                              style={{
                                marginTop: 13,
                              }}
                              value={values.checked.some(
                                e => e.courseId === item.id,
                              )}
                              checked={values.checked.some(
                                e => e.courseId === item.id,
                              )}
                              onValueChange={() => {
                                //uncheck
                                if (
                                  values.checked.some(
                                    e => e.courseId === item.id,
                                  )
                                ) {
                                  setFieldValue(
                                    'checked',
                                    values.checked.filter(
                                      (e, i) => e.courseId !== item.id,
                                    ),
                                  );
                                } else {
                                  //check
                                  setFieldValue('checked', [
                                    ...values.checked,
                                    {
                                      studentId: parseInt(stdID),
                                      courseId: item.id,
                                    },
                                  ]);
                                }
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                setModalVisible(true);
                                setDescription(item.description);
                              }}>
                              <Text
                                style={{
                                  marginTop: 15,
                                  width: '100%',
                                }}>
                                {item.name}
                              </Text>
                            </TouchableOpacity>
                          </DataTable.Row>
                        </>
                      ))}

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
                            <Text
                              style={{
                                fontSize: 20,
                                textAlign: 'center',
                                fontWeight: 'bold',
                              }}>
                              Course Detail
                            </Text>

                            <ScrollView
                              style={{
                                width: '100%',
                                height: 450,
                                marginVertical: 10,
                              }}>
                              <Text
                                style={{
                                  fontSize: 15,
                                  textTransform: 'capitalize',
                                }}>
                                {description}
                              </Text>
                            </ScrollView>

                            <Button
                              style={{
                                backgroundColor: color.primary,
                              }}
                              mode="contained"
                              onPress={() => setModalVisible(!modalVisible)}>
                              Close
                            </Button>
                          </View>
                        </View>
                      </Modal>
                    </DataTable>

                    <View>
                      <Text
                        style={{
                          color: 'red',
                          marginVertical: 10,
                          textAlign: 'center',
                        }}>
                        {values.checked.length > 3
                          ? 'Choose Only 3 Courses'
                          : ''}
                      </Text>
                      <Button
                        style={{
                          backgroundColor: color.primary,
                        }}
                        disabled={values.checked.length > 3 || values.checked.length < 1  ? true : false}
                        mode="contained"
                        onPress={handleSubmit}>
                        Submit
                      </Button>
                    </View>
                  </>
                )}
              </Formik>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default AdmissionForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
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
    backgroundColor: color.primary,
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
    fontSize: 20,
    fontWeight: 'bold',
  },
});

{
  /* <CheckBox
value={values.checked.some(
  e => e.courseId === item.id,
)}
checked={values.checked.some(
  e => e.courseId === item.id,
)}
onValueChange={() => {
  //uncheck
  if (
    values.checked.some(e => e.courseId === item.id)
  ) {
    setFieldValue(
      'checked',
      values.checked.filter(
        (e, i) => e.courseId !== item.id,
      ),
    );
  } else {
    //check
    setFieldValue('checked', [
      ...values.checked,
      {
        studentId: parseInt(stdID),
        courseId: item.id,
      },
    ]);
  }
}}
/> */
}
