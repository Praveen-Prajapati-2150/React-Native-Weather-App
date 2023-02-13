import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  FlatList,
} from 'react-native';
import SearchBar from './SearchBar';
import { haze, rainy, snow, sunny } from '../assets/backgroundImages/index';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Weather({
  weatherData,
  fetchWeatherData,
  fiveDayForecast,
  favoriteList,
  setFavoriteList,
  cityName,
  setCityName,
}) {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [color, setColor] = useState('black');
  const [isFavorite, setIsFavorite] = useState(false);
  const [fiveDayData, setFiveDayData] = useState([]);

  const {
    weather,
    name,
    main: { temp, temp_max, temp_min, humidity },
    wind: { speed },
  } = weatherData;

  // console.log({ weatherData });
  // console.log({ fiveDayForecast });

  const {
    list,
    city: { population },
  } = fiveDayForecast;

  const [{ main }] = weather;

  useEffect(() => {
    setBackgroundImage(getBackgroundImg(main));
  }, [weatherData]);

  function getBackgroundImg(weather) {
    if (weather === 'Snow') return snow;
    if (weather === 'Clear') return sunny;
    if (weather === 'Rain') return rainy;
    if (weather === 'Haze') return haze;
    return haze;
  }

  function DateStamp(dateString) {
    let date = new Date(dateString);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let result = date.toLocaleDateString('en-US', options).split(' ');

    return [result[1], result[0].substring(0, 3)];
  }

  let oneDayData = [];
  let data = [];

  function TimeStamp__(timestamp) {
    let date = new Date(timestamp);
    let options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    let result = date.toLocaleDateString('en-US', options).split(' ');

    return [result[4].length == 4 ? 0 + result[4] : result[4], result[5]];
  }

  function TimeStamp(item) {
    if (data.length !== 0) {
      if (
        item.dt_txt.substring(0, 10) ==
        data[data.length - 1].dt_txt.substring(0, 10)
      ) {
        data.push(item);
      } else {
        oneDayData.push(data);
        data = [];
        data.push(item);
      }
    } else {
      data.push(item);
    }
  }

  function filteringDays() {
    list?.map((item, index) => {
      TimeStamp(item);
    });
    setFiveDayData(oneDayData);
  }

  useEffect(() => {
    filteringDays();
  }, [list]);

  useEffect(() => {
    AsyncStorage.setItem('favoritePlaceList', JSON.stringify(favoriteList));
  }, [favoriteList]);

  // console.log({ data });
  // console.log({ oneDayData });
  console.log({ fiveDayData });

  function addToFavorite(name) {
    setFavoriteList([...favoriteList, name]);
    setColor('red');
  }

  function removeFromFavorite(name) {
    setFavoriteList(favoriteList?.filter((item) => item !== name));
    setColor('black');
  }

  let textColor = backgroundImage !== sunny ? 'white' : 'black';

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="darkgray" />
      <ImageBackground
        // source={backgroundImage}
        style={styles.backgroundImg}
        resizeMode="cover"
      >
        <SearchBar cityName={cityName} setCityName={setCityName} />

        <View style={{ alignItems: 'center' }}>
          <Text
            style={{
              ...styles.headerText,
              // color: textColor,
              color: 'black',
              fontWeight: 'bold',
              fontSize: 46,
            }}
          >
            {name}
            {favoriteList.includes(name) ? (
              <AntDesign
                // onPress={() => removeFromFavorite(name)}
                onPress={() => {
                  removeFromFavorite(name);
                  // setIsFavorite(!isFavorite);
                }}
                name="heart"
                size={24}
                color="red"
              />
            ) : (
              <AntDesign
                // onPress={() => addToFavorite(name)}
                onPress={() => {
                  addToFavorite(name);
                  // setIsFavorite(!isFavorite);
                }}
                name="heart"
                size={24}
                color="black"
              />
            )}
          </Text>
          <Text
            style={{
              ...styles.headerText,
              // color: textColor,
              color: 'black',
              fontWeight: 'bold',
            }}
          >
            {main}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: 16, paddingLeft: 5 }}>Min {temp_min} °C</Text>
            <Text
              style={{
                ...styles.headerText,
                //  color: textColor,
                color: 'black',
              }}
            >
              {temp} °C
            </Text>
            <Text style={{ fontSize: 16, paddingRight: 5 }}>Max {temp_max} °C</Text>
          </View>
        </View>

        <View style={styles.extraInfo}>
          <View style={styles.info}>
            <Text style={{ fontSize: 22, color: 'white' }}>Humidity</Text>
            <Text style={{ fontSize: 22, color: 'white' }}>{humidity} %</Text>
          </View>

          <View style={styles.info}>
            <Text style={{ fontSize: 22, color: 'white' }}>Wind Speed</Text>
            <Text style={{ fontSize: 22, color: 'white' }}>{speed} m/s</Text>
          </View>
        </View>

        <View style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          5 Day Forecast
        </View>

        <View style={styles.tempRow}>
          {/* <Text>{DateStamp(fiveDayData[0].dt_txt)}</Text> */}
          {/* <View>{fiveDayData && fiveDayData[0].dt_txt}</View> */}
          {fiveDayData &&
            fiveDayData[0]?.map((item, index) => {
              return (
                <View style={styles.tempDiv}>
                  <Text style={styles.fiveDay}>
                    {parseFloat(item.main.temp - 273).toFixed(2) + ' '}°C
                  </Text>
                  <Text>{DateStamp(item.dt_txt)}</Text>
                  <Text>{TimeStamp__(item.dt_txt)}</Text>
                </View>
              );
            })}
        </View>

        <View style={styles.tempRow}>
          {fiveDayData &&
            fiveDayData[1]?.map((item, index) => {
              return (
                <View style={styles.tempDiv}>
                  <Text style={styles.fiveDay}>
                    {parseFloat(item.main.temp - 273).toFixed(2) + ' '}°C
                  </Text>
                  <Text>{DateStamp(item.dt_txt)}</Text>
                  <Text>{TimeStamp__(item.dt_txt)}</Text>
                </View>
              );
            })}
        </View>

        <View style={styles.tempRow}>
          {fiveDayData &&
            fiveDayData[2]?.map((item, index) => {
              return (
                <View style={styles.tempDiv}>
                  <Text style={styles.fiveDay}>
                    {parseFloat(item.main.temp - 273).toFixed(2) + ' '}°C
                  </Text>
                  <Text>{DateStamp(item.dt_txt)}</Text>
                  <Text>{TimeStamp__(item.dt_txt)}</Text>
                </View>
              );
            })}
        </View>

        <View style={styles.tempRow}>
          {fiveDayData &&
            fiveDayData[3]?.map((item, index) => {
              return (
                <View style={styles.tempDiv}>
                  <Text style={styles.fiveDay}>
                    {parseFloat(item.main.temp - 273).toFixed(2) + ' '}°C
                  </Text>
                  <Text>{DateStamp(item.dt_txt)}</Text>
                  <Text>{TimeStamp__(item.dt_txt)}</Text>
                </View>
              );
            })}
        </View>

        <View style={styles.tempRow}>
          {fiveDayData &&
            fiveDayData[4]?.map((item, index) => {
              return (
                <View style={styles.tempDiv}>
                  <Text style={styles.fiveDay}>
                    {parseFloat(item.main.temp - 273).toFixed(2) + ' '}°C
                  </Text>
                  <Text>{DateStamp(item.dt_txt)}</Text>
                  <Text>{TimeStamp__(item.dt_txt)}</Text>
                </View>
              );
            })}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  backgroundImg: {
    flex: 1,
    width: Dimensions.get('screen').width,
  },
  headerText: {
    fontSize: 36,
    marginTop: 10,
  },
  extraInfo: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    padding: 10,
  },
  info: {
    width: Dimensions.get('screen').width / 2.5,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    padding: 10,
    borderRadius: 15,
    justifyContent: 'center',
  },
  fiveDay: {
    marginTop: 10,
    color: 'black',
    fontSize: 20,
  },
  tempRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    alignItems: 'center',
    overflow: 'scroll',
  },
  tempDiv: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    overflow: 'scroll',
  },
});
