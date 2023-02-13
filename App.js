import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  Image,
  PermissionsAndroid,
  Platform,
  Button,
  Alert,
} from 'react-native';
import Weather from './components/Weather';
import SearchBar from './components/SearchBar';
import FiveDayForecast from './components/FiveDayForecast';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Navigation } from 'react-native-navigation';
// import { createStackNavigator } from 'react-navigation-stack';
import Favorite from './components/Favorite';
import { Fontisto } from '@expo/vector-icons';

// const API_KEY = "46a9246bebba16d42b36aac3fc3ba8af";
const API_KEY = '244d6c48fa63a6d22eb3af1c7ca57865';

// Navigation.events().registerAppLaunchedListener(() => {
//   Navigation.setRoot({
//     root: {
//       stack: {
//         children: [
//           {
//             component: {
//               name: 'com.myApp.WelcomeScreen',
//             },
//           },
//         ],
//       },
//     },
//   });
// });

// const AppNavigator = createStackNavigator({
//   Home: {
//     screen: HomeScreen,
//   },
//   Details: {
//     screen: DetailsScreen,
//   },
// });

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const [fiveDayForecast, setFiveDayForecast] = useState(null);

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const [lati, setLati] = useState();
  const [long, setLong] = useState();

  const [favoriteList, setFavoriteList] = useState([]);
  const [cityName, setCityName] = useState('');

  const [showFavorite, setShowFavorite] = useState(false);

  async function fetchFavoritePlaceList() {
    const data = await AsyncStorage.getItem('favoritePlaceList');
    if (data) setFavoriteList(JSON.parse(data));
  }

  useEffect(() => {
    fetchFavoritePlaceList();
  }, []);

  Geolocation.requestAuthorization();

  Geolocation.getCurrentPosition(
    (position) => {
      // console.log(position);
      setLati(position.coords.latitude);
      setLong(position.coords.longitude);
    },
    (error) => {
      console.log(error.message);
    },
    { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
  );

  // console.log({ location, error });
  // console.log({ lati, long });
  console.log({ favoriteList });

  async function fetchWeatherData1(cityName) {
    let API1 = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
    let API2 = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}`;

    try {
      const response1 = await fetch(API1);
      const response2 = await fetch(API2);
      const data1 = await response1.json();
      const data2 = await response2.json();
      if (response1.status == 200 && response2.status == 200) {
        setWeatherData(data1);
        setFiveDayForecast(data2);
      }
      if (response1.status === 404) {
        setWeatherData(null)
        console.log(data1);
        console.log(data1.message);
        Alert.alert('Alert Title', 'My Alert Msg', [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      }
      setLoaded(false);
    } catch (error) {
      Alert.alert(
        'My Alert Title',
        'My Alert Message',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          { text: 'OK', onPress: () => console.log('OK Pressed') },
        ],
        { cancelable: false }
      );
      console.log(error);
      setLoaded(false);
    }
  }

  console.log({ weatherData });
  // console.log({ fiveDayForecast });
  // console.log({ cityName });

  async function fetchWeatherData2() {
    let API1 = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&units=metric&appid=${API_KEY}`;
    let API2 = `https://api.openweathermap.org/data/2.5/forecast?lat=${lati}&lon=${long}&appid=${API_KEY}`;

    try {
      const response1 = await fetch(API1);
      const response2 = await fetch(API2);
      if (response1.status == 200 && response2.status == 200) {
        const data1 = await response1.json();
        const data2 = await response2.json();
        setWeatherData(data1);
        setFiveDayForecast(data2);
      }
      setLoaded(false);
    } catch (error) {
      console.log(error);
      setLoaded(false);
    }
  }

  useEffect(() => {
    fetchWeatherData1('Delhi');
  }, []);

  useEffect(() => {
    fetchWeatherData1(cityName);
    // console.log('calling');
  }, [cityName]);

  useEffect(() => {
    fetchWeatherData2();
  }, [lati, long]);

  if (loaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color="gray" size={36} />
      </View>
    );
  } else if (weatherData === null && loaded == false) {
    return (
      <View style={styles.container}>
        <SearchBar cityName={cityName} setCityName={setCityName} />
        <Text style={styles.primaryText}>
          City Not Found! Try Different City
        </Text>
      </View>
    );
  }

  return (
    <>
      {/* <NavigationContainer> */}
      {/* <AppNavigator /> */}
      {weatherData && fiveDayForecast ? (
        <View style={styles.container}>
          

        

          <Weather
            weatherData={weatherData}
            fiveDayForecast={fiveDayForecast}
            favoriteList={favoriteList}
            setFavoriteList={setFavoriteList}
            cityName={cityName}
            setCityName={setCityName}
            setShowFavorite={setShowFavorite}
            showFavorite={showFavorite}
          />
        </View>
      ) : (
        <Text style={styles.primaryText}>Loading</Text>
      )}
      {/* </NavigationContainer> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    margin: 20,
    fontSize: 28,
  },
});
