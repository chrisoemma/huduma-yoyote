import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Alert, Image, Text, View } from 'react-native';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useTranslation } from 'react-i18next';
//import { userLogout } from './../features/auth/userSlice';
import { colors } from '../utils/colors';
import { userLogout } from '../features/auth/userSlice';
import { useDispatch, useSelector,RootStateOrAny } from 'react-redux';
import { makePhoneCall } from '../utils/utilts';



const DrawerHeader = styled.View`
  height: 150px;
  align-items: flex-start;
  justify-content: center;
  padding-left: 5px;
  margin-bottom: 40px;
  background-color: ${colors.secondary};
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

const DrawerRow = styled.TouchableOpacity`
  flex-direction: row;
  padding-vertical: 2px;
  align-items: center;
  background-color: ${props => props.isDarkMode ? colors.black :colors.whiteBackground};
`;

const DrawerIconContainer = styled.View`
  padding: 15px;
  padding-right: 20px;
  width: 75px;
`;

const DrawerRowsContainer = styled.View`
  margin-top: 10px;
`;


const CustomDrawerContent = (props: any) => {

  const { t } = useTranslation();

  const { user, loading } = useSelector((state: RootStateOrAny) => state.user);

  const { isDarkMode } = props;
  React.useEffect(() => {
  }, [user]);

  const phoneNumber='+255714055666';

  let  drawerItems=[];
  
    if(user.client && user.status=='Active'){
   drawerItems = [
      {
        name: 'Home',
        icon: 'home',
        language:'home',
        screen: 'Home',
        options: {
          screen: 'BottomHomeTabNavigator',
        },
      },
      {
        name: 'Settings',
        icon: 'cogs',
        language:'settings',
        screen: 'Settings',
        options: {
          screen: 'Settings',
        },
      },
     
    ]
  }
//}
 const dispatch = useDispatch();


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

 const WhatsappChatBot =()=>{

 }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader isDarkMode={isDarkMode}>
        <Image
          source={require('./../../assets/images/logo-white.png')}
          style={{
            width: '60%',
            height: 60,
          }}
        />
        <View>
          <Text style={{
            marginTop: 10,
            color:colors.white,
            fontWeight: 'bold'
          }}>
           ESPE SERVICE
          </Text>
        </View>
      </DrawerHeader>

      <DrawerRowsContainer>
        {drawerItems.map(item => {
          return (
            <DrawerRow
              key={item.name}
              onPress={() => {
                props.navigation.navigate(item.screen, item.options);
              }}
              isDarkMode={isDarkMode}
            >
              <DrawerIconContainer>
                <FontAwesome5
                  name={item.icon}
                  color={isDarkMode ? colors.white : colors.alsoGrey}
                  size={25}
                />
              </DrawerIconContainer>
              <Text style={{ color: isDarkMode ? colors.white : colors.black }}>
              {t(`navigate:${item.language}`)}
            </Text>
            </DrawerRow>
          );
        })}

<DrawerRow
          onPress={() => {
      
            WhatsappChatBot();
          }}
          isDarkMode={isDarkMode}
        >
          <DrawerIconContainer>
            <FontAwesome5
              name="whatsapp"
              color={isDarkMode ? colors.white : colors.alsoGrey}
              size={25}
            />
          </DrawerIconContainer>
          <Text
            style={{
              color: isDarkMode ? colors.white : colors.black,
            }}>
            {t('navigate:whatsapp')}
          </Text>
        </DrawerRow>

          <DrawerRow
          onPress={() => {
              makePhoneCall(phoneNumber)
          }}
          isDarkMode={isDarkMode}
        >
          <DrawerIconContainer>
            <FontAwesome5
              name="phone"
              color={isDarkMode ? colors.white : colors.alsoGrey}
              size={25}
            />
          </DrawerIconContainer>
          <Text
            style={{
              color: isDarkMode ? colors.white : colors.black,
            }}>
            {t('navigate:support')}
          </Text>
        </DrawerRow>

        <DrawerRow
          onPress={() => {
            confirmLogout();
          }}
          isDarkMode={isDarkMode}
        >
          <DrawerIconContainer>
            <FontAwesome5
              name="sign-out-alt"
              color={isDarkMode ? colors.white : colors.alsoGrey}
              size={25}
            />
          </DrawerIconContainer>
          <Text
            style={{
              color: isDarkMode ? colors.white :colors.black, 
            }}>
            {t('navigate:logout')}
          </Text>
        </DrawerRow>
      </DrawerRowsContainer>
    </DrawerContentScrollView>

  );
};

export default CustomDrawerContent;
