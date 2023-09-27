import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity} from 'react-native';

import {useForm, Controller} from 'react-hook-form';
import {RootStateOrAny, useSelector} from 'react-redux';
import {globalStyles} from '../../styles/global';
import {useTogglePasswordVisibility} from '../../hooks/useTogglePasswordVisibility';
import PhoneInput from 'react-native-phone-number-input';
import {Container} from '../../components/Container';
import {BasicView} from '../../components/BasicView';
import Button from '../../components/Button';
import {ButtonText} from '../../components/ButtonText';
import {TextInputField} from '../../components/TextInputField';
import {useAppDispatch} from '../../app/store';
import {userVerify} from './userSlice';
import { useTranslation } from 'react-i18next';

const VerifyScreen = ({route, navigation}: any) => {
  const {nextPage} = route.params;
  const { t } = useTranslation();

  const {user, loading, status} = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('user dataaaa',user);
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
      code: '',
    },
  });
  const onSubmit = (data: any) => {
    console.log(user.id);
    console.log(data);

    if (nextPage === 'PasswordReset') {
      navigation.navigate('PasswordReset', {verificationCode: data.code});
    } else {
      dispatch(userVerify({user_id: user.id, code: data.code}));
    }
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Container>
          <BasicView style={globalStyles.marginTop60}>
            <Text style={globalStyles.mediumHeading}>{t('auth:verify')}</Text>
          </BasicView>

          <BasicView>
            <Text style={globalStyles.errorMessage}>{message}</Text>
          </BasicView>

          <BasicView>
            <Text
              style={[globalStyles.inputFieldTitle, globalStyles.marginTop20]}>
              {t('auth:code')}
            </Text>

            <Controller
              control={control}
              rules={{
                maxLength: 12,
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInputField
                  placeholder="Enter Verification Code"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="code"
            />

            {errors.code && (
              <Text style={globalStyles.errorMessage}>
                {t('auth:verifyCode')}
              </Text>
            )}
          </BasicView>

          <BasicView style={globalStyles.marginTop30}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>{t('auth:verify')}</ButtonText>
            </Button>
          </BasicView>

          <BasicView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('PasswordReset');
              }}
              style={[globalStyles.marginTop20, globalStyles.centerView]}>
              <Text style={globalStyles.touchablePlainTextSecondary}>
                {t('auth:alredyHaveAccount')}
              </Text>
            </TouchableOpacity>
          </BasicView>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyScreen;
