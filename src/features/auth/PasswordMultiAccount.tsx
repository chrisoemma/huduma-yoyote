import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';

import PhoneInput from 'react-native-phone-number-input';
import {useForm, Controller} from 'react-hook-form';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useAppDispatch} from '../../app/store';

import {forgotPassword, multiAccountByRegister} from './userSlice';
import Icon from 'react-native-vector-icons/Feather';
import {BasicView} from '../../components/BasicView';
import {ButtonText} from '../../components/ButtonText';
import Button from '../../components/Button';
import {globalStyles} from '../../styles/global';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/colors';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import showToast from '../../components/ShowToast/showToast';


const PasswordMultiAccount = ({route, navigation}: any) => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const {userData}=route?.params


  const styles = globalStyles();

  const { loading} = useSelector(
    (state: RootStateOrAny) => state.user,
  );


  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
  useTogglePasswordVisibility();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      password: '',
    },
  });
  const onSubmit = (data: any) => {
        data.phone=userData?.phone;
        data.app_type='agent';
    dispatch(multiAccountByRegister(data))
      .unwrap()
      .then(result => {
    
        if (result.status) {
            navigation.navigate('New account');
        } else {
          showToast(`${result.error}`,'long','danger')
        }
      })
      .catch(rejectedValueOrSerializedError => {
        // handle error here
        console.log('error');
        console.log(rejectedValueOrSerializedError);
      });
  };

  return (
    <SafeAreaView style={styles.scrollBg}>
      
      <ScrollView contentInsetAdjustmentBehavior="automatic" >
        <View>
          <Text style={[styles.largeHeading,{fontSize:40}]}>{t('auth:accountVerification')}</Text>
        </View>

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
    
          <BasicView style={styles.marginTop30}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>{t('auth:confirmAccount')}</ButtonText>
            </Button>
          </BasicView>

          <BasicView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              style={[styles.marginTop20, styles.centerView]}>
              <Text style={styles.touchablePlainTextSecondary}>
               {t('auth:alreadyHaveAccount')}
              </Text>
            </TouchableOpacity>
          </BasicView>
     
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasswordMultiAccount;
