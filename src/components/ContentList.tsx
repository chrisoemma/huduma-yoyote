import React from 'react';
import { FlatList, View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const ContentList = ({ data,navigation }: any) => {
  const itemsPerRow = 3;
  const screenWidth = Dimensions.get('window').width;

  const renderItem = ({ item }: any) => (
    <TouchableOpacity 
    style={[styles.contentItem, { width: screenWidth / itemsPerRow }]}
    onPress={()=>{}}
    >
      <Image
        source={require('./../../assets/images/banner-3.jpg')}
        style={{
          resizeMode: 'cover',
          width: 55,
          height: 55,
          borderRadius: 10,
        }}
        
      />
      <Text>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
    <FlatList
      data={data}
      keyExtractor={(item) => item.name.toString()}
      renderItem={renderItem}
      numColumns={itemsPerRow}
      contentContainerStyle={styles.contentContainer}
      
    />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      // flex: 1,
        paddingTop: 20,
        paddingHorizontal: 10,
        paddingVertical: 20,
      },
      contentContainer: {
        
        // flexDirection: 'row',
        // flexWrap: 'wrap', // Allow items to wrap within a row
           justifyContent: 'space-between',
        
      },
      contentItem: {
         flex:1,
       alignItems: 'center',
       padding: 10,
       margin:2
      },
});

export default ContentList;
