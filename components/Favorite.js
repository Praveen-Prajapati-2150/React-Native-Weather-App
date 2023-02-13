import React from 'react';
import { View, Text } from 'react-native-web';

const Favorite = ({ favoriteList, setCityName, setShowFavorite }) => {
  return (
    <View>
      {favoriteList?.map((item, index) => {
        return (
          <Text
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              fontSize: 20,
              fontWeight: 500,
              marginTop: 10,
            }}
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
