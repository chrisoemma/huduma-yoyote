import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
  StyleSheet,
  Linking,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
import { setFirstTime, userRegiter } from './userSlice';
import {globalStyles} from '../../styles/global';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import messaging from '@react-native-firebase/messaging';
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useTranslation } from 'react-i18next';
import ToastMessage from '../../components/ToastMessage';

const RegisterScreen = ({ route, navigation }: any) => {


  const dispatch = useAppDispatch();
  const { user, loading, status,isFirstTimeUser} = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const phoneInput = useRef<PhoneInput>(null);

  const [message, setMessage] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deviceToken, setDeviceToken] = useState('');

  const { t } = useTranslation();

  const styles = globalStyles();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      password: '',
      confirmPassword: '',
      name: '',
    },
  });



  const [toastMessage, setToastMessage] = useState(''); // State for toast message content
  const [showToast, setShowToast] = useState(false); // State to control visibility of toast message

  // Function to toggle visibility of toast message
  const toggleToast = () => {
    setShowToast(!showToast);
  };



  // Function to show the toast message
  const showToastMessage = (message) => {
    setToastMessage(message);
    toggleToast(); // Show the toast message
    setTimeout(() => {
      toggleToast(); // Hide the toast message after a delay
    }, 5000); // Adjust duration as per your requirement
  };


  useEffect(() => {
    if(isFirstTimeUser){
        dispatch(setFirstTime(false))
    }
  }, []);



  useEffect(() => {
    const retrieveDeviceToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('new token', token);
        setDeviceToken(token);
      } catch (error) {
        console.log('Error retrieving device token:', error);
      }
    };

    retrieveDeviceToken();
  }, []);


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 10000);
  };

  const onSubmit = async (data: any) => {

    setShowToast(false)

    if (data.password !== data.confirmPassword) {
      setConfirmError(t('auth:passwordMismatch'));
      setShowToast(true)
      showToastMessage(t('screens:errorOccured'));
      return;
    } else {
      setConfirmError('');
    }
      data.app_type='client';
      data.deviceToken = deviceToken; 
    dispatch(userRegiter(data))
    .unwrap()
    .then(result => {
      console.log('resultsss', result);
      if (result.status) {
        
        ToastAndroid.show(`${t('auth:userCreatedSuccessfully')}`, ToastAndroid.LONG);
        navigation.navigate('Verify',{nextPage:'Verify'});

      }else{
        if(result.error) {
          setDisappearMessage(result.error);
      } else {
        if(result.message){
          setDisappearMessage(result.message);
        }else{
          setDisappearMessage("Something is not right please contact administartor");
        }  
      }
      setShowToast(true)
      showToastMessage(t('screens:errorOccured'));
      }

   
    })

  }

  return (

    <SafeAreaView style={styles.scrollBg}>

{showToast && <ToastMessage message={toastMessage} onClose={toggleToast} />}
      <ScrollView contentInsetAdjustmentBehavior="automatic">
       
          <View style={styles.centerView}>
            <Image
              source={isDarkMode? require('./../../../assets/images/logo-white.png'): require('./../../../assets/images/logo.png')}
              style={[styles.verticalLogo,{height:100,marginTop:20}]}
            />
          </View>
         
          <View>
            <BasicView style={styles.centerView}>
              <Text style={styles.errorMessage}>{message}</Text>
            </BasicView>

            <BasicView>
              <Text
                style={[
                  styles.inputFieldTitle,
                  styles.marginTop10,
                ]}>
                {t('auth:phone')}
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PhoneInput
                    ref={phoneInput}
                    placeholder="714 055 666"
                    defaultValue={value}
                    defaultCode="TZ"
                    countryPickerProps={{
                      countryCodes: ['TZ', 'KE', 'UG', 'RW', 'BI'],
                    }}
                    layout="first"
                    // onChangeText={}
                    onChangeFormattedText={text => {
                      onChange(text);
                    }}
                    withDarkTheme
                    withShadow
                    autoFocus
                    containerStyle={styles.phoneInputContainer}
                    textContainerStyle={styles.phoneInputTextContainer}
                    textInputStyle={styles.phoneInputField}
                    textInputProps={{
                      maxLength: 9,
                    }}
                  />
                )}
                name="phone"
              />
              {errors.phone && (
                <Text style={styles.errorMessage}>
                  {t('auth:phoneRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <Text
                style={[
                  styles.inputFieldTitle,
                  styles.marginTop20,
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
                    placeholder= {t('auth:enterName')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="name"
              />

              {errors.name && (
                <Text style={styles.errorMessage}>
                  {t('auth:nameRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <Text
                style={[
                  styles.inputFieldTitle,
                  styles.marginTop20,
                ]}>
                {t('auth:password')}
              </Text>

              <View style={styles.passwordInputContainer}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={[styles.passwordInputField,
                        {backgroundColor:colors.white,color:colors.black}
                      ]}
                      secureTextEntry={passwordVisibility}
                      placeholder={t('auth:enterPassword')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="password"
                />

                <TouchableOpacity onPress={handlePasswordVisibility}>
                  <Icon name={rightIcon} size={20} color={colors.grey} />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorMessage}>
                  {t('auth:passwordRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
            <Text
              style={[
                styles.inputFieldTitle,
                styles.marginTop20,
              ]}>
              {t('auth:confirmPassword')}
            </Text>

            <View style={styles.passwordInputContainer}>
              <Controller
                control={control}
                rules={{
                  required: true,
                  validate: (value) => value === confirmPassword,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.passwordInputField,
                    { backgroundColor: colors.white, color: colors.black }
                    ]}
                    secureTextEntry={passwordVisibility}
                    placeholderTextColor={colors.alsoGrey}
                    placeholder={t('auth:confirmPassword')}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      onChange(text);
                    }}
                    value={value}
                  />
                )}
                name="confirmPassword"
              />
              <TouchableOpacity onPress={handlePasswordVisibility}>
                <Icon name={rightIcon} size={20} color={colors.grey} />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
                <Text style={styles.errorMessage}>
                  {t('auth:confirmpasswordRequired')}
                </Text>
              )}
            {confirmError && (
              <Text style={styles.errorMessage}>
                {t('auth:passwordMismatch')}
              </Text>
            )}
          </BasicView>


            <BasicView>
              <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{t('auth:register')}</ButtonText>
              </Button>
            </BasicView>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 80 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              style={[styles.marginTop20, styles.centerView]}>
              <Text style={styles.touchablePlainTextSecondary}>
                {t('auth:alreadyHaveAccount')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('CheckPhoneNumber');
              }}
              style={[styles.marginTop20, styles.centerView]}>
              <Text style={styles.touchablePlainTextSecondary}>
                {t('auth:haveOtp')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={internalstyles.TermsConditions}>
            <Text style={styles.touchablePlainTextSecondary}>
              {t('screens:termsText')}{' '}
              <TouchableOpacity onPress={() => Linking.openURL('https://your-terms-url.com')}>
                <Text style={internalstyles.linkText}>{t('screens:termsLink')}</Text>
              </TouchableOpacity>
              {` ${t('screens:termsContinueText')} `}
              <TouchableOpacity onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>
                <Text style={internalstyles.linkText}>{t('screens:privacyPolicyLink')}</Text>
              </TouchableOpacity>
              {` ${t('screens:continuePrivacyPolicy')} `}
            </Text>
          </View>
          
          </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

const internalstyles = StyleSheet.create({
  TermsConditions: {
    marginTop: '10%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom:'3%'
  },
  linkText: {
    color: colors.secondary,
    textDecorationLine: 'underline',
    fontWeight:'bold'
  },

});

export default RegisterScreen;
