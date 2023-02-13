import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from '../styles/fivedayforecast.css';

export default function FiveDayForecast({ fiveDayData }) {
  let [date, setDate] = useState();
  let [max, setMax] = useState();
  let [min, setMin] = useState();

  function DateStamp(dateString) {
    let date = new Date(dateString);
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    let result = date.toLocaleDateString('en-US', options).split(' ');

    return [result[1], result[0].substring(0, 3)];
  }

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

  function setMaxAndMin(temp) {
    console.log({ temp });
    setMax(temp);
    // let max = 0;
    // let min = 0;
    // setMin(temp);
    if (temp > max) {
      setMax(temp);
    } else if (temp < min) {
      //   setMin(temp);
    }
  }

  console.log({ min, max });

  useEffect(() => {
    setDate(DateStamp(fiveDayData[0].dt_txt));
    // console.log(DateStamp(fiveDayData[0].dt_txt));
  }, [fiveDayData]);

  useEffect(() => {
    setMin(0);
    setMax(0);
    fiveDayData?.map((item, index) => {
      return setMaxAndMin(parseFloat(item.main.temp - 273).toFixed(2));
    });
  }, [fiveDayData]);

  return (
    <View style={styles.main}>
      <View>
        <Text style={styles.date}>{date}</Text>
        {/* <Text style={styled.line}>{date}</Text> */}
        {/* <Text>
          min{min}, max{max}
        </Text> */}
      </View>
      <View style={styles.tempRow}>
        {fiveDayData &&
          fiveDayData?.map((item, index) => {
            return (
              <View kye={index} style={styles.tempDiv}>
                <Text style={styles.fiveDay}>
                  {parseFloat(item.main.temp - 273).toFixed(2) + ' '}°C
                </Text>
                <Text style={styles.text}>{TimeStamp__(item.dt_txt)}</Text>
              </View>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: 'auto',
    alignItems: 'flex-start',
    overflow: 'scroll',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  tempRow: {
    display: 'flex',
    flexDirection: 'row',
    paddingRight: 10,
    alignItems: 'center',
    overflow: 'scroll',
    // backgroundColor: 'grey',
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // backgroundBlur: '5px',
    // backgroundImage:
    //   'linear-gradient(45deg, rgba(255, 255, 255, 0.2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.2) 50%, rgba(255, 255, 255, 0.2) 75%, transparent 75%, transparent)',
    boxShadow: '0 0 10px 2px rgba(0, 0, 0, 0.1)',
    backfaceVisibility: 'hidden',

    // background-size: 20px 20px,
    // border-radius: 50%,
    backdropFilter: 'blur(20)',
  },
  tempDiv: {
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: 'center',
    // overflow: 'scroll',
    color: 'white',
  },

  fiveDay: {
    color: 'white',
    fontSize: 20,
  },

  text: {
    color: 'white',
  },

  date: {
    fontSize: 18,
    fontStyle: 'bold',
    fontWeight: 600,
    color: 'gray',
  },
});
