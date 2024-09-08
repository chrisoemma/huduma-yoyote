import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
  StyleSheet,
} from 'react-native';
import ToastNotification from '../../components/ShowToast/showToast';


import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
import { multiRegister, setFirstTime, userLogout, userRegiter } from './userSlice';
import { globalStyles } from '../../styles/global';
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';

import { useTranslation } from 'react-i18next';

import { colors } from '../../utils/colors';
import ToastMessage from '../../components/ToastMessage';

const NewAccount = ({ route, navigation }: any) => {

  const dispatch = useAppDispatch();
  const { user, loading, status, isFirstTimeUser } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const [message, setMessage] = useState('');
  const [nidaError, setNidaError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [nidaLoading, setNidaLoading] = useState(false)
  const [open, setOpen] = useState(false);
  const [value, setProffValue] = useState([]);
  const [designationError, setDesignationError] = useState('')

  const WIDTH = Dimensions.get("window").width;


  const { t } = useTranslation();

  useEffect(() => {
    if (isFirstTimeUser) {
      dispatch(setFirstTime(false))
    }
  }, []);




  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      name:'',
    },
  });


  useEffect(() => {
    const cleanedPhone = user?.phone?.replace(/\+/g, '');
    setValue('phone', cleanedPhone);
    setValue('nida',user?.agent?.nida);
    setValue('email', user?.email);
    if(user?.agent){
    setValue('name', user?.agent?.name); 
    setValue('first_name', user?.agent.first_name);
    setValue('last_name', user?.agent.last_name);
    
    }else if(user?.provider){
        setValue('name', user?.provider?.first_name+' '+user?.provider?.last_name); 
        setValue('first_name', user?.provider?.first_name);
        setValue('last_name', user?.provider?.last_name);
    }else{
        setValue('name', user?.employee?.name); 
        setValue('nida',user?.employee?.nida);
    }
   
}, [route.params]);


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 8000);
  };


  const [toastMessage, setToastMessage] = useState(''); // State for toast message content
  const [showToast, setShowToast] = useState(false); // State to control visibility of toast message

  // Function to toggle visibility of toast message
  const toggleToast = () => {
    setShowToast(!showToast);
  };



  // Function to show the toast message
  const showToastMessage = (message) => {
    setToastMessage(message);
    toggleToast(); 
    setTimeout(() => {
      toggleToast(); 
    }, 5000); // Adjust duration as per your requirement
  };



  const onSubmit = async (data: any) => {

    data.app_type = 'client';
    if(user?.provider){
    data.account_from='provider'
    }else if(user.agent){
        data.account_from='agent'
    }else{
        data.account_from='employee' 
    }


      setShowToast(false)
      dispatch(multiRegister({ data, userId: user?.id }))
        .unwrap()
        .then(result => {

          if (result.status) {
            console.log('excuted this true block')
            ToastNotification(`${t('screens:userMultiAccountCreated')}`,'success','long')
           
          } else {
            if (result.error) {
              setDisappearMessage(result.error);
              setShowToast(true)
              showToastMessage(t('screens:errorOccured'));
            } else {
              setDisappearMessage(result.message);
            }
          }

        })
        .catch(rejectedValueOrSerializedError => {
          // handle error here
          console.log('error');
          console.log(rejectedValueOrSerializedError);
        });

  };



  const stylesGlobal = globalStyles();

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  return (

    <SafeAreaView style={stylesGlobal.scrollBg}>
     
     {showToast && <ToastMessage message={toastMessage} onClose={toggleToast} />}
      
      
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text style={stylesGlobal.largeHeading}>{t('auth:register')}</Text>
        </View>
        <View>
        
          <BasicView style={stylesGlobal.centerView}>
            <Text style={stylesGlobal.errorMessage}>{message}</Text>
          </BasicView>

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:phone')}
            </Text>

            <Controller
              control={control}
              rules={{
                minLength: 10,
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                 placeholderTextColor={colors.alsoGrey}
                
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    // Remove any non-numeric characters
                    const cleanedText = text.replace(/\D/g, '');


                    if (cleanedText.startsWith('0') && cleanedText.length <= 10) {
                      onChange(cleanedText);
                    } else if (
                      (cleanedText.startsWith('255') ||
                        cleanedText.startsWith('+255')) &&
                      cleanedText.length <= 12
                    ) {
                      onChange(cleanedText);
                    }
                  }}
                  value={value}
                  keyboardType="phone-pad"
                  editable={user?.agent || user?.provider?false:true}
                  style={user?.agent || user?.provider? styles.disabledTextInput : null}

                />
              )}
              name="phone"
            />
            {errors.phone && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:phoneRequired')}
              </Text>
            )}
          </BasicView>

          <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:name')}
            </Text>

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                placeholderTextColor={colors.alsoGrey}
                  placeholder={t('auth:enterName')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  editable={user?.agent || user?.provider?false:true}
                  style={user?.agent || user?.provider? styles.disabledTextInput : null}
                />
              )}
              name="name"
            />

            {errors.name && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:nameRequired')}
              </Text>
            )}
          </BasicView>


          {/* <BasicView>
            <Text
              style={[
                stylesGlobal.inputFieldTitle,
                stylesGlobal.marginTop20,
              ]}>
              {t('auth:nida')}
            </Text>


            <Controller
              control={control}
              rules={{
                required: true,
                validate: (value) => {
                  if (value.length !== 20) {
                    setNidaError(t('auth:nida20numbers'));
                    return false;
                  }
                  setNidaError('');
                  return true;
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputField
                  placeholder={t('auth:enterNida')}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType='numeric'
                  editable={user?.agent || user?.provider ?false:true}
                  style={user?.agent || user?.provider ? styles.disabledTextInput : null}
                />
              )}
              name="nida"
            />
             {errors.nida && (
              <Text style={stylesGlobal.errorMessage}>
                {t('auth:nidaEmptyError')}
              </Text>
            )}
            {nidaError && (
              <Text style={stylesGlobal.errorMessage}>
                {nidaError}
              </Text>
            )}
          </BasicView> */}

          <BasicView>
            <Button loading={nidaLoading || loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>{t('auth:register')}</ButtonText>
            </Button>
          </BasicView>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 80 }}>
            <TouchableOpacity
               disabled={loading}
              onPress={() => {
                dispatch(userLogout());
              }}
              style={[stylesGlobal.marginTop20, stylesGlobal.centerView]}>
              <Text style={stylesGlobal.touchablePlainTextSecondary}>
                {t('screens:cancelAccount')}
              </Text>
            </TouchableOpacity>
         
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({

  loading: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 50,
    zIndex: 15000,
  },
  disabledTextInput: {
    backgroundColor: 'lightgray', 
  },
});

export default NewAccount;
