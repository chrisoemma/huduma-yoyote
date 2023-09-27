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

//import { globalStyles } from '../style/global';
import { colors } from '../utils/colors';
import { userLogout } from '../features/auth/userSlice';
import { useDispatch } from 'react-redux';
//import TextView from '../components/TextView';
//import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
//import { services } from '../utils/app-services';

const DrawerHeader = styled.View`
  height: 150px;
  align-items: flex-start;
  justify-content: center;
  padding-left: 5px;
  margin-bottom:40px;
  background-color:#82D0D4;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius:10px;

`;

const DrawerRow = styled.TouchableOpacity`
  flex-direction: row;
  padding-vertical: 2px;
  align-items: center;
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

  //const { user, loading } = useSelector((state: RootStateOrAny) => state.user);

  // React.useEffect(() => {
  // }, [user]);

 // let drawerItems = [];

  // if (user.business == null) {
  //   drawerItems = [
  //     {
  //       name: 'Dashboard',
  //       icon: 'shield-alt',
  //       screen: 'Dashboard',
  //       options: {
  //         screen: 'Dashboard',
  //       },
  //     },
  //     // {
  //     //   name: 'Home Visit',
  //     //   icon: 'home',
  //     //   screen: 'SearchStack',
  //     //   options: {
  //     //     screen: 'Search',
  //     //     params: {
  //     //       currentService: services[0],
  //     //     },
  //     //   },
  //     // },
  //     // {
  //     //   name: 'Hospital Appointments',
  //     //   icon: 'hospital-user',
  //     //   screen: 'SearchStack',
  //     //   options: {
  //     //     screen: 'Search',
  //     //     params: {
  //     //       currentService: services[1],
  //     //     },
  //     //   },
  //     // },
  //     {
  //       name: 'Orders',
  //       icon: 'dolly',
  //       screen: 'PatientOrders',
  //       options: {}
  //     },
  //     // {
  //     //   name: 'Family Dr. / Abroad Hospitals',
  //     //   icon: 'user-md',
  //     //   screen: 'SearchStack',
  //     //   options: {
  //     //     screen: 'Search',
  //     //     params: {
  //     //       currentService: services[2],
  //     //     },
  //     //   },
  //     // },
  //     {
  //       name: 'Ambulance',
  //       icon: 'ambulance',
  //       screen: 'AmbulancePage',
  //       options: {},
  //     },
  //     {
  //       name: 'Requests & Consultations',
  //       icon: 'stethoscope',
  //       screen: 'ConsultationsStack',
  //       options: {},
  //     },
  //     {
  //       name: 'Ambulance Requests',
  //       icon: 'ambulance',
  //       screen: 'AmbulanceRequestsStack',
  //       options: {
  //         screen: 'AmbulanceRequests',
  //       },
  //     },

  //     {
  //       name: 'Pharm/Insurance',
  //       icon: 'capsules',
  //       screen: 'Businesses',
  //       options: {},
  //     },
  //     // {
  //     //   name: 'Blog',
  //     //   icon: 'newspaper',
  //     //   screen: 'Blog',
  //     //   options: {},
  //     // },
  //     {
  //       name: 'Account',
  //       icon: 'user-circle',
  //       screen: 'Account',
  //       options: {},
  //     },

  //     {
  //       name: 'Contact Us',
  //       icon: 'phone',
  //       screen: 'Contact',
  //       options: {},
  //     },
  //   ];

  // } else {
  let  drawerItems = [
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
      {
        name: 'Whatsapp',
        icon: 'whatsapp',
        language:'whatsapp',
       
      },
      {
        name: 'Support',
        icon: 'phone',
        language:'support',
        screen: 'Support',
        options: {
          screen: 'Suport',
        },
      },
      
    ]
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

  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader>
        <Image
          source={require('./../../assets/images/logo.jpg')}
          style={{
            width: '60%',
            height: 60,
          }}
        />
        <View>
          <Text style={{
            marginTop:10,
            color:colors.white,
            fontWeight:'bold'
          }}>
            Huduma popote
          </Text>
        </View>
      </DrawerHeader>

      <DrawerRowsContainer>
        {drawerItems.map(item => {
          return (
            <DrawerRow
              onPress={() => {
                props.navigation.navigate(item.screen, item.options);
              }}>
              <DrawerIconContainer>
                <FontAwesome5
                  name={item.icon}
                  color={colors.alsoGrey}
                  size={25}
                />
              </DrawerIconContainer>
              <Text
              >
                
                {t(`navigate:${item.language}`)}
              </Text>
            </DrawerRow>
          );
        })}

        <DrawerRow
          onPress={() => {
            confirmLogout();
          }}>
          <DrawerIconContainer>
            <FontAwesome5
              name="sign-out-alt"
              color={colors.alsoGrey}
              size={25}
            />
          </DrawerIconContainer>
          <Text
        >
            {t('navigate:logout')}
          </Text>
        </DrawerRow>
      </DrawerRowsContainer>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
