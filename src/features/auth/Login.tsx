import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { userLogin } from './userSlice';
import {globalStyles} from '../../styles/global';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useTranslation } from 'react-i18next';

const LoginScreen = ({ route, navigation }: any) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const styles = globalStyles();

  const { user, loading, status } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const phoneInput = useRef<PhoneInput>(null);

  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(user);
  }, [user]);


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      password: '',
    },
  });
  const onSubmit = async(data: any) => {

    try {
     data.app_type='client';
    const result = await dispatch(userLogin(data)).unwrap(); 

    if (result.status) {
       return  true 
    } else {
      setDisappearMessage(result.error); 
    }

   } catch (error) {
      console.warn(error);
      return false;
    }
  };

  return (
    <SafeAreaView style={styles.scrollBg}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        
          <View style={styles.centerView}>
            <Image
              source={isDarkMode? require('./../../../assets/images/logo-white.png'): require('./../../../assets/images/logo.png')}
              style={[styles.verticalLogo,{height:100,marginTop:20}]}
            />
          </View>
          <View>
            <BasicView style={styles.centerView}>
              <Text style={styles.errorMessage}> {message} </Text>
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
              {errors.phone && (
                <Text style={styles.errorMessage}>
                  {t('auth:passwordRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ForgotPassword');
                }}
                style={[
                  styles.touchableOpacityPlain,
                  styles.marginTop10,
                ]}>
                <Text style={styles.touchablePlainTextSecondary}>
                 {t('auth:forgotPassword')}
                </Text>
              </TouchableOpacity>

              <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{t('auth:login')}</ButtonText>
              </Button>
            </BasicView>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}
              style={[styles.marginTop20, styles.centerView]}>
              <Text style={styles.touchablePlainTextSecondary}>
              {t('auth:dontHaveAccount')}
              </Text>
            </TouchableOpacity>
          </View>
      
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
