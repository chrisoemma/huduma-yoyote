import { View, Text, SafeAreaView, Image,StyleSheet, Alert,TouchableOpacity, ActivityIndicator, PermissionsAndroid, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import {globalStyles} from '../../styles/global'
import { colors } from '../../utils/colors'
import Icon from 'react-native-vector-icons/AntDesign';
import Divider from '../../components/Divider';
import { breakTextIntoLines, getLocationName, makePhoneCall } from '../../utils/utilts';
import { useTranslation } from 'react-i18next';
import { useSelector,RootStateOrAny, useDispatch } from 'react-redux';
import { firebase } from '@react-native-firebase/storage';
import RNFS from 'react-native-fs';
import { updateProfile, userLogout } from '../auth/userSlice';
import DocumentPicker, { types } from 'react-native-document-picker'

const Account = ({navigation}:any) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { loading, user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const {  isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );


  const [profile, setProfile] = useState(null)
  const [uploadingPic, setUploadingPic] = useState(false)
  const [message, setMessage] = useState('');



  const data = {
    image_url: '',
    doc_type: ''
  }


  const makeid = (length: any) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };


const [locationName, setLocationName] = useState(null);
useEffect(() => {
  getLocationName(user?.client?.latitude, user?.client?.longitude)
    .then((locationName) => {
      setLocationName(locationName);
      console.log('Location Name:', locationName);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}, [locationName]);

const confirmLogout = () =>
Alert.alert(`${t('screens:logout')}`, `${t('screens:areYouSureLogout')}`, [
  {
    text: `${t('screens:cancel')}`,
    onPress: () => console.log('Cancel Logout'),
    style: 'cancel',
  },
  {
    text: `${t('screens:ok')}`,
    onPress: () => {
      dispatch(userLogout());
    },
  },
]);

const getPathForFirebaseStorage = async (uri: any) => {

  const destPath = `${RNFS.TemporaryDirectoryPath}/text`;
  await RNFS.copyFile(uri, destPath);

  return (await RNFS.stat(destPath)).path;
};
const handleSaveProfilePicture = async() => {
  if (!profile) return false;

  const [file] = profile;
  const { type: doc_type, uri: doc_uri } = file;

  const fileExtension = doc_type.split("/").pop();
  const fileName = `${makeid(10)}.${fileExtension}`;
  const storageRef = firebase.storage().ref(`profile/${fileName}`);

  try {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]);

    if (granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED) {
      setUploadingPic(true);

      const snapshot = await storageRef.putFile(await getPathForFirebaseStorage(doc_uri));

      if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
        const downloadUrl = await storageRef.getDownloadURL();
        data.doc_type = doc_type;
        data.image_url = downloadUrl;

        const result = await dispatch(updateProfile({data:data,userId:user.id})).unwrap();

        if (result.status) {
          setUploadingPic(false)
          console.log('executed this true block');
          ToastAndroid.show("Picture successfully!", ToastAndroid.SHORT);
        } else {
          setDisappearMessage('Unable to process request. Please try again later.');
          console.log('don\'t navigate');
        }

        console.log(result);
      }
    }
  } catch (error) {
    console.warn(error);
    return false;
  }


};

const selectProfile = async () => {
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.images, DocumentPicker.types.images],
    });
    setProfile(res);

  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      setProfile(null);

    } else {
      // For Unknown Error
      alert("Unknown Error: " + JSON.stringify(error));
      throw error;
    }
  }
};

  const phoneNumber = `${user?.phone}`;
  return (
    <SafeAreaView
      style={globalStyles().scrollBg}
    >
      <View style={globalStyles().appView}>

      <View style={styles.btnView}>
           {profile ==null ?(<View />):(
                <TouchableOpacity
                onPress={handleSaveProfilePicture}
                style={styles.picture_save}
                disabled={loading || uploadingPic} // Disable the button when loading or uploadingPic is true
              >
                {loading || uploadingPic ? (
                  // Render loader when loading or uploadingPic is true
                  <View style={{flexDirection:'row'}}>
                    <Text style={{ marginHorizontal: 3, color: isDarkMode ? colors.black : colors.white }}>
  {t('screens:uploding')}
</Text>
                    <ActivityIndicator size="small" color={colors.white} />
                  </View>
                ) : (
               
                  <Text style={{
                    paddingVertical: 3,
                    paddingHorizontal: 6,
                    color: colors.white
                  }}>
                    {t('screens:updatePicture')}
                  </Text>
                )}
              </TouchableOpacity>
           )}

              <TouchableOpacity style={{marginRight:10,alignSelf:'flex-end'}}
                 onPress={() => {navigation.navigate('Edit Account',{
                   client:user?.client
                 })}}
                >
               <Icon    
                name="edit"
                color={isDarkMode ? colors.white : colors.black}
                size={25}
/>
              </TouchableOpacity>
              </View>

        <View style={[globalStyles().circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>
      
          
          
          <Image
            source={ !user.profile_img ? (profile ==null ? require('../../../assets/images/profile.png'):{ uri: profile[0]?.uri}):{uri:user.profile_img}}
            style={{
              resizeMode: "cover",
              width: 90,
              height: 95,
              borderRadius: 90,
              alignSelf: 'center'
            }}
          />
           <TouchableOpacity style={styles.cameraDiv} onPress={selectProfile}>
          <Icon
            name="camera"
            size={23}
            color={isDarkMode ? colors.white : colors.black}
            style={styles.camera}
          />
        </TouchableOpacity>
        </View>
        <Text style={{ color: isDarkMode ? colors.white : colors.secondary, fontWeight: 'bold', alignSelf: 'center' }}>{user.name}</Text>

        <View>
          <TouchableOpacity style={{ flexDirection: 'row', margin: 10 }}
            onPress={() => makePhoneCall(phoneNumber)}
          >
            <Icon
              name="phone"
              color={isDarkMode ? colors.white : colors.black}
              size={25}
            />
            <Text style={{ paddingHorizontal: 10,color: isDarkMode ? colors.white : colors.secondary }}>{user.phone}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10 }}>
            <Icon
              name="mail"
              color={isDarkMode ? colors.white : colors.black}
              size={25}
            />
            <Text style={{ paddingLeft: 10,color: isDarkMode ? colors.white : colors.secondary }}>{user.email}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 5 }}>
            <Icon
              name="enviroment"
              color={isDarkMode ? colors.white : colors.black}
              size={25}
            />
            {
              locationName==null?(<View />):(<Text style={{ paddingLeft: 10,color:isDarkMode ? colors.white : colors.black }}>{breakTextIntoLines(locationName, 20)}</Text>)
            }
            
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: 20 }}>
          <Divider />
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 5 }}
          onPress={() => { navigation.navigate("Change Password") }}
        >
          <Icon
            name="lock1"
            color={isDarkMode ? colors.white : colors.secondary}
            size={25}
          />
          <Text style={{ paddingLeft: 10, fontWeight: 'bold',color: isDarkMode ? colors.white : colors.secondary }}>{t('screens:changePassword')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 10 }}
          onPress={() => {
            confirmLogout();
          }}
        >
          <Icon
            name="logout"
            color={colors.dangerRed}
            size={25}
          />
          <Text style={{ paddingLeft: 10, fontWeight: 'bold', color: isDarkMode ? colors.white : colors.secondary }}>{t('navigate:logout')}</Text>
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

 picture_save: {
  marginRight: 25,
  marginTop: 10,
  backgroundColor: colors.secondary,
  borderRadius: 10

},

camera: {
  paddingVertical: 5,
  paddingHorizontal: 10
},
cameraDiv: {
  borderRadius: 15,
  backgroundColor: colors.secondary,
  marginTop: -20,
  marginLeft: 55,
  position: "relative",
},

});

export default Account