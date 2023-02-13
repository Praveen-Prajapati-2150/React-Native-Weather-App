import React from 'react';
import { View, Text } from 'react-native-web';

const Favorite = ({ favoriteList, setCityName, setShowFavorite }) => {
  return (
    <View>
      {favoriteList?.map((item, index) => {
        return (
          <Text
            onPress={() => {
              setShowFavorite(false);
              setCityName(item);
            }}
            key={index}
          >
            {item}
          </Text>
        );
      })}
    </View>
  );
};

export default Favorite;
