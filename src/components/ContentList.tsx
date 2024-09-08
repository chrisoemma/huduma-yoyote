import React from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../utils/colors';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';


const ContentList = ({ data, navigation, isDarkMode }: any) => {
  const itemsPerRow = 3;
  const screenWidth = Dimensions.get('window').width;
  const selectedLanguage = useSelector(selectLanguage);

  const handleServicePress = (service) => {
    navigation.navigate('Service Details', {
      service: service,
    });
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.contentItem, { width: screenWidth / itemsPerRow }]}
      onPress={() => handleServicePress(item)}
    >
      <Image
        source={{ uri: item?.images[0]?.img_url }}
        style={styles.image}
      />
      <Text style={{ color: isDarkMode ? colors.white : colors.black, fontSize:12.7,   fontFamily: 'Prompt-Regular', }}>
        {selectedLanguage === 'en' ? item?.name?.en : item?.name?.sw}
      </Text>
    </TouchableOpacity>
  );



  

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item?.id.toString()}
        renderItem={renderItem}
        numColumns={itemsPerRow}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  contentContainer: {
    justifyContent:'space-between'
  },
  contentItem: {
   // flex: 1,
    padding: 10,
    margin: 2,
   // alignSelf: 'center',
  },
  image: {
    resizeMode: 'cover',
    width: 55,
    height: 55,
    borderRadius: 10,
  },
});

export default ContentList;
