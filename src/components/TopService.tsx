import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import React from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';
import LinearGradient from 'react-native-linear-gradient';
import { colors } from '../utils/colors';

const TopService = ({ onPress, service }) => {
  const { isDarkMode } = useSelector((state: RootStateOrAny) => state.theme);
  const selectedLanguage = useSelector(selectLanguage);

  const shadowStyle = isDarkMode
    ? {
        ios: {
          shadowColor: 'rgba(255, 255, 255, 0.3)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }
    : {
        ios: {
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.touchableOpacityStyles,
        { backgroundColor: isDarkMode ? colors.blackBackground : colors.whiteBackground },
        shadowStyle[Platform.OS],
      ]}
      key={service.id}
    >
      <Image
        source={{ uri: service.images[0].img_url }}
        style={styles.serviceImage}
      />
      {/* <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'transparent']}
        style={styles.gradientOverlay}
      /> */}
      <View style={styles.serviceTextContainer}>
        <Text style={styles.serviceText}>
          {selectedLanguage === 'en' ? service?.name?.en : service?.name?.sw}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableOpacityStyles: {
    width: '41%',
    height: 150,
    borderRadius: 16,
    marginHorizontal:15,
    marginVertical: 8,
    overflow: 'hidden',
    alignSelf:'center'
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  gradientOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 18,
  },
  serviceTextContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },
  serviceText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default TopService;
