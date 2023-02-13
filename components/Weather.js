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
import FiveDayForecast from './FiveDayForecast';
import { Fontisto } from '@expo/vector-icons';
import Favorite from './Favorite';

export default function Weather({
  weatherData,
  fetchWeatherData,
  fiveDayForecast,
  favoriteList,
  setFavoriteList,
  cityName,
  setCityName,
  setShowFavorite,
  showFavorite,
}) {
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [color, setColor] = useState('black');
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
  // console.log({ fiveDayData });

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
        source={backgroundImage}
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
            <Text style={{ fontSize: 16, paddingLeft: 5 }}>
              <AntDesign name="arrowdown" size={24} color="black" />
              {temp_min} °C
            </Text>
            <Text
              style={{
                ...styles.headerText,
                //  color: textColor,
                color: 'black',
              }}
            >
              {temp} °C
            </Text>
            <Text style={{ fontSize: 16, paddingRight: 5 }}>
              <AntDesign name="arrowup" size={24} color="black" />
              Max {temp_max} °C
            </Text>
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

        <View
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            width: '100%',
            padding: 10,
          }}
        >
          <Text
            style={{
              display: 'flex',
              // alignItems: 'center',
              // justifyContent: 'center',
              width: '100%',
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            5 Day Forecast
          </Text>
          <Fontisto
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginTop: '10',
              marginRight: '10',
            }}
            name="favorite"
            size={24}
            color="black"
            onPress={() => setShowFavorite(!showFavorite)}
          />
        </View>

        {showFavorite ? (
          <Favorite
            favoriteList={favoriteList}
            setCityName={setCityName}
            setShowFavorite={setShowFavorite}
            style={{
              backgroundColor: 'green',
            }}
          />
        ) : null}

        {fiveDayData &&
          fiveDayData?.map((item, index) => {
            return (
              <FiveDayForecast kye={index} fiveDayData={fiveDayData[index]} />
            );
          })}
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
    marginTop: 10,
    justifyContent: 'space-between',
    padding: 6,
  },
  info: {
    width: Dimensions.get('screen').width / 2.5,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    paddingLeft: 10,
    paddingRight: 10,
    padding: 6,
    borderRadius: 10,
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
    // overflow: 'scroll',
  },
  tempDiv: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    // overflow: 'scroll',
  },
});
