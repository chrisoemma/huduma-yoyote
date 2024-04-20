import { View, Text, SafeAreaView, ScrollView,TouchableOpacity } from 'react-native'
import React from 'react'
import { globalStyles } from '../../styles/global';
import { useSelector, RootStateOrAny } from 'react-redux';
import { BasicView } from '../../components/BasicView';
import { useTranslation } from 'react-i18next';
import Notification from '../../components/Notification';
import { userLogout } from './userSlice';
import { useAppDispatch } from '../../app/store';

const WelcomeNewAccount = ({navigation}:any) => {


  const stylesGlobal = globalStyles();
  const { t } = useTranslation();

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const { user, loading } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={stylesGlobal.scrollBg}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <BasicView style={stylesGlobal.marginTop60}>
          <Text style={[stylesGlobal.mediumHeading,{fontWeight:'bold'}]}>{t('screens:hello')}, {user?.agent ? user.agent?.first_name + ' ' + user.agent?.last_name : user?.name} {t('screens:welcome')}.</Text>
        </BasicView>
         <View style={{marginVertical:'5%'}}>
         <Notification
          message={`${t('screens:accountCreationWelcome')}`}
          type="info"
          duration = {120000}
          allowClose = {false}
          autoDismiss ={false}
          textSize={23}
        />
         </View>

         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 80 }}>
            <TouchableOpacity
             onPress={() =>{  dispatch(userLogout());}}
            
              style={[stylesGlobal.marginTop20, stylesGlobal.centerView]}>
              <Text style={stylesGlobal.touchablePlainTextSecondary}>
                {t('screens:returnBack')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                
                  navigation.navigate('New account');
                }}
              style={[stylesGlobal.marginTop20, stylesGlobal.centerView]}>
              <Text style={stylesGlobal.touchablePlainTextSecondary}>
                {t('screens:proceedtoCreateAccount')}
              </Text>
            </TouchableOpacity>
          </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default WelcomeNewAccount