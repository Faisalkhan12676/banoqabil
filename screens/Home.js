import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
} from 'react-native';
import React, {useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Paper from 'react-native-vector-icons/Ionicons';
import Cap from 'react-native-vector-icons/FontAwesome';
import Award from 'react-native-vector-icons/MaterialCommunityIcons';
import ProjectIcon from 'react-native-vector-icons/FontAwesome5';
import Slider from '../components/Swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {color} from '../components/Colors';
import {useNavigation} from '@react-navigation/native';
import Logout from '../components/Logout';
import {useDispatch} from 'react-redux';
import Info from 'react-native-vector-icons/MaterialIcons';
import AdmissionForm from './AdmissionForm';


const Home = () => {
  

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handlelogout = () => {
    //remove only login information
    AsyncStorage.removeItem('@userlogininfo')
      .then(() => {
        dispatch({type: 'LOGOUT'});
        navigation.navigate('Login');
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        <View
          style={{
            height: 70,
            width: 150,
          }}>
          <Image
            source={require('../assets/Bano-Qabil-Logo-Green.png')}
            style={styles.logo}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
          }}>
          <TouchableOpacity onPress={() => navigation.navigate('details')}>
            <Info name="person" color={color.primary} size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('admitCard')}>
            <Info name="info" color={color.primary} size={30} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginLeft: 10,
            }}
            onPress={handlelogout}>
            <Logout />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView>
        <Slider />
        <View style={styles.container}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('courses')}>
            <View style={styles.card}>
              <Paper name="bulb-outline" size={60} style={styles.clr} />
              <Text style={styles.clr}>IT Skills</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('awards')}>
            <View style={styles.card}>
              <Award name="trophy-award" size={50} style={styles.clr} />
              <Text style={styles.clr}>Nimatullah Khan Talent Awards</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('masterpage')}>
            <View style={styles.card}>
              <Icon name="book" size={50} style={styles.clr} />
              <Text style={styles.clr}>Masters </Text>
              <Text style={styles.clr}>Scholarship</Text>
            </View>
          </TouchableOpacity>

        

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('fyp')}>
            <View style={styles.card}>
              <ProjectIcon
                name="project-diagram"
                size={32}
                style={styles.clr}
              />
              <Text style={styles.clr}>FYP Funding</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('shortfilms')}>
            <View style={styles.card}>
              <Cap name="video-camera" size={38} style={styles.clr} />
              <View>
                <Text style={styles.clr}>Short</Text>
                <Text style={styles.clr}>Film Funding</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('exam')}>
          <View style={styles.card}>
            <Paper name="copy-outline" size={38} style={styles.clr} />
            <Text style={styles.clr}>Exam</Text>
          </View>
        </TouchableOpacity> */}
        </View>
      </ScrollView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    backgroundColor: color.light,
    height: 70,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 22,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 140,
    height: 140,
    backgroundColor: color.primary,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
    borderColor: color.divider,
    borderWidth: 2.5,
  },
  clr: {
    color: '#fff',
    textAlign: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
