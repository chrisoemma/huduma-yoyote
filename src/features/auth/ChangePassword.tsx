import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import {useForm, Controller} from 'react-hook-form';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useAppDispatch} from '../../app/store';
import {globalStyles} from '../../styles/global';
import {useTogglePasswordVisibility} from '../../hooks/useTogglePasswordVisibility';
import {Container} from '../../components/Container';
import {BasicView} from '../../components/BasicView';
import Button from '../../components/Button';
import {ButtonText} from '../../components/ButtonText';
import {changePassword} from './userSlice';
import { useTranslation } from 'react-i18next';

const ChangePassword = ({route, navigation}: any) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();


  const {user, loading, status} = useSelector(
    (state: RootStateOrAny) => state.user,
  );


  const [message, setMessage] = useState('');

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    if (status !== '') {
      setMessage(status);
    }
  }, [status]);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      old_password: '',
      new_password:'',
      comfirm_password:''
    },
  });
  const onSubmit = (data: any) => {
    
    
    if (data.new_password === data.comfirm_password) {
    dispatch(changePassword({data:data,userId:user.id}))
      .unwrap()
      .then(result => {
        // handle result here
        console.log('result');
        console.log(result);

        if (result.status) {
            ToastAndroid.show('Password changed successfully', ToastAndroid.SHORT);
          
          navigation.navigate('Home');
        } else {
          console.log('Message with error should be set');
        }
      })
      .catch(rejectedValueOrSerializedError => {
        // handle error here
        console.log('error');
        console.log(rejectedValueOrSerializedError);
      });
    }else{
        setPasswordsMatch(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Container>
          <BasicView>
            <Text style={globalStyles.errorMessage}>{message}</Text>
          </BasicView>

          <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                {t('auth:oldPassword')}
              </Text>

              <View style={globalStyles.passwordInputContainer}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={globalStyles.passwordInputField}
                
                      placeholder={t('auth:enterOldPassword')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="old_password"
                />

              </View>
              {errors.old_password && (
                <Text style={globalStyles.errorMessage}>
                  {t('auth:oldPasswordRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                {t('auth:newPassword')}
              </Text>

              <View style={globalStyles.passwordInputContainer}>
                <Controller
                  control={control}
                  rules={{
               
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={globalStyles.passwordInputField}
                  
                      placeholder={t('auth:enterNewPassword')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="new_password"
                />

              </View>
              {errors.new_password && (
                <Text style={globalStyles.errorMessage}>
                  {t('auth:newPasswordRequired')}
                </Text>
              )}
            </BasicView>


            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                {t('auth:comfirmNewPassword')}
              </Text>

              <View style={globalStyles.passwordInputContainer}>
                <Controller
                  control={control}
                  rules={{
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={globalStyles.passwordInputField}
                      placeholder={t('auth:enterComfirmPassword')}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="comfirm_password"
                />

              </View>
              {errors.comfirm_password && (
                <Text style={globalStyles.errorMessage}>
                  {t('auth:oldPasswordRequired')}
                </Text>
              )}
              {!passwordsMatch && (
    <Text style={globalStyles.errorMessage}>
         {t('auth:passwordMatch')}
    </Text>
  )}
            </BasicView>

          <BasicView style={globalStyles.marginTop30}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>{t('screens:changePassword')}</ButtonText>
            </Button>
          </BasicView>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePassword;
