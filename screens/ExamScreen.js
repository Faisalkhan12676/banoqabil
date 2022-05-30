import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  RadioButton,
} from 'react-native-paper';
import CheckBox from '@react-native-community/checkbox';
import {color} from '../components/Colors';
import CountDown from 'react-native-countdown-component';
import {Formik} from 'formik';
import * as Yup from 'yup';

const ExamScreen = () => {
  const handleStart = () => {};

  const [examobj, setExamobj] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [examData, setExamData] = useState([]);

  const examquestionsfromapi = [
    {
      id: 1,
      questionType: 'Checkbox',
      question: 'What is the capital of India?',
      option1: 'New Delhi',
      option2: 'Mumbai',
      option3: 'Chennai',
      option4: 'Kolkata',
    },
  ];

  console.log('ExamScreen', examData);

  return (
    <>
      {/* ADD QUESTION ONE DATA INTO OBJECT */}
      <Text>{examquestionsfromapi[questionIndex].question}</Text>
      <CheckBox
        value={examData.some(
          item => item.option1 === examquestionsfromapi[questionIndex].option1,
        )}
        onValueChange={() => {
          //check
          if (
            examData.some(
              item =>
                item.option1 === examquestionsfromapi[questionIndex].option1,
            )
          ) {
            //uncheck
            setExamData(
              examData.filter(
                item =>
                  item.option1 !== examquestionsfromapi[questionIndex].option1,
              ),
            );
          }
          //uncheck
          else {
            setExamData({
              ...examData,
              Option1: examquestionsfromapi[questionIndex].option1,
            });
          }
        }}
      />

      <CheckBox
        value={examData.some(
          item => item.option2 === examquestionsfromapi[questionIndex].option2,
        )}
        onValueChange={() => {
          //check
          if (
            examData.some(
              item =>
                item.option2 === examquestionsfromapi[questionIndex].option2,
            )
          ) {
            setExamData(
              examData.filter(
                item =>
                  item.option2 !== examquestionsfromapi[questionIndex].option2,
              ),
            );
          }
          //uncheck
          else {
            setExamData({
              ...examData,
              Option2: examquestionsfromapi[questionIndex].option2,
            });
          }
        }}
      />

      {/* <View
        style={{
          height: 70,
          width: '100%',
          backgroundColor: color.primary,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <CountDown
          until={60 * 30 + 0}
          size={20}
          onFinish={() => alert('Finished')}
          digitStyle={{backgroundColor: '#FFF'}}
          digitTxtStyle={{color: color.primary}}
          timeToShow={['M', 'S']}
          timeLabels={{m: '', s: ''}}
          showSeparator
        />
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <ScrollView
          style={{
            flex: 1,
          }}>
          <Card
            style={{
              margin: 10,
            }}>
            <Card.Content>
              <Title>Q:1 What is Your Name?</Title>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginVertical: 5,
                }}>
                <CheckBox />
                <Paragraph>Faisal</Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginVertical: 5,
                }}>
                <CheckBox />
                <Paragraph>Mubbashir</Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginVertical: 5,
                }}>
                <CheckBox />
                <Paragraph>Moid</Paragraph>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: 15,
                  marginVertical: 5,
                }}>
                <CheckBox />
                <Paragraph>Muammar</Paragraph>
              </View>
            </Card.Content>
          </Card>

          <Card
            style={{
              margin: 10,
            }}>
            <Card.Content>
              <Title>Q:1 What is Your Name?</Title>
              <RadioButton.Group>
                <RadioButton.Item
                  color={color.primary}
                  value="Male"
                  labelStyle={{
                    textAlign: 'left',
                  }}
                  label="Pakistan"
                  position="leading"
                />
                <RadioButton.Item
                  color={color.primary}
                  value="Male"
                  labelStyle={{
                    textAlign: 'left',
                  }}
                  label="India"
                  position="leading"
                />
                <RadioButton.Item
                  color={color.primary}
                  value="Male"
                  labelStyle={{
                    textAlign: 'left',
                  }}
                  label="USA"
                  position="leading"
                />
              </RadioButton.Group>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>

      <View
        style={{
          height: 70,
          width: '100%',
          backgroundColor: color.divider,
          justifyContent: 'center',
          paddingHorizontal: 30,
        }}>
        <Button
          mode="contained"
          style={{
            backgroundColor: color.primary,
          }}
          onPress={handleStart}>
          Start Exam
        </Button>
      </View> */}
    </>
  );
};

export default ExamScreen;

const styles = StyleSheet.create({});
