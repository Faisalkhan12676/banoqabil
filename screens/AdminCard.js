import {
  StyleSheet,
  Text,
  View,
  Image,
  Share,
  PermissionsAndroid,
} from 'react-native';
import React, {useRef, useState, useEffect} from 'react';
import {
  Avatar,
  Button,
  Divider,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import ViewShot, {captureScreen} from 'react-native-view-shot';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../config';

const AdminCard = () => {
  const ViewShotref = useRef();
  const [username, setUsername] = useState([]);
  // const [data, setData] = useState([]);
  const [isloading, setIsLoading] = useState(true);
  const [imgs, setImgs] = useState('');
  useEffect(() => {
    const picture = async () => {
      try {
        const value = await AsyncStorage.getItem('@userlogininfo');
        if (value !== null) {
          // We have data!!
          const data = JSON.parse(value);
          console.log('TOKEN', data.token);

          axios
            .get(`${BASE_URL}/Student/GetImage`, {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            })
            .then(res => {
              setIsLoading(false);
              console.log('IMAGES');
              const {image} = res.data;
              setImgs(image);
            })
            .catch(err => {
              console.log(err);
              console.log('ERROR');
            });

          axios
            .get(`${BASE_URL}/Student/GetByUserIdWithRelationShip`, {
              headers: {
                Authorization: `Bearer ${data.token}`,
              },
            })
            .then(res => {
              setIsLoading(false);
              console.log(res.data);
              const {student} = res.data;
              setUsername(student);
              console.log(student.user)
              console.log("GOTITT")
            })
            .catch(err => {
              console.log(err);
              console.log('ERROR FROM STUDENT');
            });
        }
      } catch (error) {
        // Error retrieving data
        console.log(error);
      }
    };

    picture();
  }, []);

  return (
    <>
      {isloading ? (
        <>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ActivityIndicator animating={true} color={Colors.green400} />
          </View>
        </>
      ) : (
        <>
          <View style={styles.container}>
            <ViewShot
              style={styles.cardcontainer}
              ref={ViewShotref}
              options={{format: 'png', quality: 1.0}}>
              <Avatar.Image size={170} source={{uri: imgs}}  />

              <View style={styles.content}>
                <Text style={styles.title}>Name</Text>
                <Text style={styles.title}>{username.user}</Text>
              </View>
              <Divider
                style={{
                  height: 2,
                  width: '100%',
                }}
              />
              <View style={styles.content}>
                <Text style={styles.title}>Father Name</Text>
                <Text style={styles.title}>{username.fatherName}</Text>
              </View>
              <Divider
                style={{
                  height: 2,
                  width: '100%',
                }}
              />
              <View style={styles.content}>
                <Text style={styles.title}>Phone</Text>
                <Text style={styles.title}>{username.whatsappNumber}</Text>
              </View>
              <Divider
                style={{
                  height: 2,
                  width: '100%',
                }}
              />
              <View style={styles.content}>
                <Text style={styles.title}>CINC</Text>
                <Text style={styles.title}>{username.cnic}</Text>
              </View>
              <Divider
                style={{
                  height: 2,
                  width: '100%',
                }}
              />
            </ViewShot>
          </View>
        </>
      )}
    </>
  );
};

export default AdminCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 20,
  },
  cardcontainer: {
    width: '100%',
    height: 500,
    alignItems: 'center',
    backgroundColor: '#ced4da',
    marginHorizontal: 20,
    paddingVertical: 50,
    borderRadius: 10,
    //shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
    paddingHorizontal: 10,
  },

  content: {
    width: '100%',
    padding: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginHorizontal: 20,
  },
});
