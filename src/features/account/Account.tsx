import { View, Text, SafeAreaView, Image,StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors'
import Icon from 'react-native-vector-icons/AntDesign';
import Divider from '../../components/Divider';
import { makePhoneCall } from '../../utils/utilts';
import { useTranslation } from 'react-i18next';
import { useSelector,RootStateOrAny } from 'react-redux';

const Account = ({navigation}:any) => {

  const { t } = useTranslation();

  const {user } = useSelector(
    (state: RootStateOrAny) => state.user,
);

  const phoneNumber = `${user.phone}`;
  return (
    <SafeAreaView
      style={globalStyles.scrollBg}
    >
      <View style={globalStyles.appView}>

      <View style={styles.btnView}>
              <TouchableOpacity style={{marginRight:10,alignSelf:'flex-end'}}
                 onPress={() => {navigation.navigate('Edit Account',{
                   client:user?.client
                 })}}
                >
                <Icon    
                  name="edit"
                  color={colors.black}
                  size={25}
                  />
              </TouchableOpacity>
              </View>

        <View style={[globalStyles.circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>
          <Image
            source={require('../../../assets/images/profile.png')}
            style={{
              resizeMode: "cover",
              width: 90,
              height: 95,
              borderRadius: 90,
              alignSelf: 'center'
            }}
          />
           <TouchableOpacity style={styles.cameraDiv} onPress={()=>{}}>
          <Icon
            name="camera"
            size={23}
            color={colors.white}
            style={styles.camera}
          />
        </TouchableOpacity>
        </View>
        <Text style={{ color: colors.secondary, fontWeight: 'bold', alignSelf: 'center' }}>{user.name}</Text>
        <View>
          <TouchableOpacity style={{ flexDirection: 'row', margin: 10 }}
            onPress={() => makePhoneCall(phoneNumber)}
          >
            <Icon
              name="phone"
              color={colors.black}
              size={25}
            />
            <Text style={{ paddingHorizontal: 10 }}>{user.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10 }}>
            <Icon
              name="mail"
              color={colors.black}
              size={25}
            />
            <Text style={{ paddingLeft: 10 }}>{user.email}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 5 }}>
            <Icon
              name="enviroment"
              color={colors.black}
              size={25}
            />
            <Text style={{ paddingLeft: 10 }}>{user.location}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Divider />
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 5 }}>
          <Icon
            name="lock1"
            color={colors.secondary}
            size={25}
          />
          <Text style={{ paddingLeft: 10, fontWeight: 'bold' }}>{t('screens:changePassword')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 10 }}>
          <Icon
            name="logout"
            color={colors.dangerRed}
            size={25}
          />
          <Text style={{ paddingLeft: 10, fontWeight: 'bold' }}>{t('navigate:logout')}</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
btnView:{
  flexDirection:'row',
  justifyContent:'flex-end'
 },

 camera: {
  padding:5,
},
cameraDiv: {
  borderRadius: 15,
  backgroundColor: colors.dangerRed,
  marginTop: -20,
  marginLeft:50,
  position: "relative",
},

});

export default Account