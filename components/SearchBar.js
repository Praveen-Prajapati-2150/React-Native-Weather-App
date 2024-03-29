import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';

export default function SearchBar({ cityName, setCityName }) {
  const [name, setName] = useState('');

  function fetchWeatherData() {
    setCityName(name);
  }

  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.input}
        placeholder="Enter City name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <EvilIcons
        name="search"
        size={28}
        color="black"
        onPress={() => fetchWeatherData()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    // backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  searchBar: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('screen').width - 20,
    borderWidth: 1.5,
    paddingVertical: 5,
    borderRadius: 25,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    // backgroundColor: 'lightgray',
    // borderColor: 'lightgray',
    borderColor: 'rgba(255, 255, 255, 1)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',

  },
});
