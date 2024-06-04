import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../../styles/global';
import RatingStars from '../../components/RatinsStars';
import { makePhoneCall } from '../../utils/utilts';
import IconOnline from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/AntDesign';
import { colors } from '../../utils/colors';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getProviderProfile } from '../serviceproviders/ServiceProviderSlice';


const ProviderProfile = ({ route }: any) => {

  const { provider, source } = route.params;


   //console.log('provider1234',provider?.name?.id)

  const { providerProfile } = useSelector(
    (state: RootStateOrAny) => state.providers,
);

const { user,isOnline } = useSelector(
  (state: RootStateOrAny) => state.user,
);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getProviderProfile(provider?.name?.id))
  }, [])

  const { t } = useTranslation();

  const stylesGlobal = globalStyles();

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );


 // console.log('providerssss',providerProfile)

  const PhoneNumber = `${providerProfile?.phone}`;

  return (
    <ScrollView style={stylesGlobal.scrollBg}>
      <View>

        <View>
          <View style={[stylesGlobal.circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>


            <Image
              source={
                providerProfile?.profile_img?.startsWith('https://')
                  ? { uri: providerProfile.profile_img }
                  : providerProfile?.user.profile_img?.startsWith('https://')
                    ? { uri: providerProfile.profile_img }
                    : require('../../../assets/images/profile.png') // Default static image
              }
              style={{
                resizeMode: 'cover',
                width: providerProfile?.user?.profile_img?.startsWith('https://') ? 90 : 90,
                height: providerProfile?.user?.profile_img?.startsWith('https://') ? 95 : 95,
                borderRadius: providerProfile?.profile_img?.startsWith('https://') ? 90 : 90,
                alignSelf: 'center',
              }}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View>
            {providerProfile?.ratings && providerProfile.ratings.length > 0 && (
    <>
    </>
  )}
              <Text style={{ marginVertical: 5, color: colors.black }}>{providerProfile?.name}</Text>
              {providerProfile.ratings.map((rating: any) => (
        <View key={rating.id}>
          <RatingStars rating={parseInt(rating.rating)} />
        </View>
      ))}     
            </View>
            <TouchableOpacity style={{
              flexDirection: 'row',
              marginHorizontal: 30,
              marginVertical: 20,
              alignItems: 'flex-end'
            }}
              onPress={() => makePhoneCall(PhoneNumber)}
            >
              <Icon
                name="phone"
                color={isDarkMode ? colors.white : colors.black}
                size={20}
              />
              <Text style={{
                paddingHorizontal: 5, fontWeight: 'bold',
                color: isDarkMode ? colors.white : colors.black
              }}>{PhoneNumber}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divOnline}>
            <IconOnline name={isOnline ? 'checkmark-circle' : 'close-circle'} size={24} color={isOnline ? 'green' : colors.darkGrey} />
            <Text style={styles.text}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
          <View style={[stylesGlobal.chooseServiceBtn, { justifyContent: 'space-between', marginBottom: 50 }]}>


            {/* <TouchableOpacity style={[stylesGlobal.otherBtn, { backgroundColor: getStatusBackgroundColor(request_status) }]}>
                                <Text style={{ color: colors.white }}>{getStatusTranslation(request_status)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={stylesGlobal.chooseBtn}
                                onPress={() => handlePresentModalPress('Near providers')}
                            >
                                <Text style={{ color: colors.white }}>{t('navigate:requestedServices')}</Text>
              </TouchableOpacity> */}
          </View>
        </View>

      </View>
    </ScrollView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: 10
  },
  title: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold'
  },
  divOnline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    marginLeft: 5,
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    marginBottom: '10%',
  },
})

export default ProviderProfile