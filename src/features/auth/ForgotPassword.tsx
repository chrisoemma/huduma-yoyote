import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, Text, TouchableOpacity} from 'react-native';

import PhoneInput from 'react-native-phone-number-input';
import {useForm, Controller} from 'react-hook-form';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useAppDispatch} from '../../app/store';

import {forgotPassword} from './userSlice';


import {Container} from '../../components/Container';
import {BasicView} from '../../components/BasicView';
import {ButtonText} from '../../components/ButtonText';
import Button from '../../components/Button';
import { globalStyles } from '../../styles/global';

const ForgotPasswordScreen = ({route, navigation}: any) => {
  const dispatch = useAppDispatch();
  const {user, loading, status} = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const phoneInput = useRef<PhoneInput>(null);

  const [message, setMessage] = useState('');

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
      phone: '',
    },
  });
  const onSubmit = (data: any) => {
    console.log(data);
    dispatch(forgotPassword(data))
      .unwrap()
      .then(result => {
        // handle result here
        console.log('result');
        console.log(result);

        if (result.status) {
          console.log('Navigate to verify');
          navigation.navigate('Verify', {nextPage: 'PasswordReset'});
        } else {
          console.log('dont navigate');
        }
      })
      .catch(rejectedValueOrSerializedError => {
        // handle error here
        console.log('error');
        console.log(rejectedValueOrSerializedError);
      });
  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Container>
          <BasicView style={globalStyles.marginTop60}>
            <Text style={globalStyles.mediumHeading}>
              Forgot{'\n'}Password?
            </Text>
          </BasicView>

          <BasicView>
            <Text style={globalStyles.errorMessage}>{message}</Text>
          </BasicView>

          <BasicView style={globalStyles.marginTop30}>
            <Text
              style={[globalStyles.inputFieldTitle, globalStyles.marginTop10]}>
              Phone
            </Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, onBlur, value}}) => (
                <PhoneInput
                  ref={phoneInput}
                  placeholder="700 111 222"
                  defaultValue={value}
                  defaultCode="TZ"
                  countryPickerProps={{
                    countryCodes: ['TZ'],
                  }}
                  layout="first"
                  // onChangeText={}
                  onChangeFormattedText={text => {
                    onChange(text);
                  }}
                  withDarkTheme
                  withShadow
                  autoFocus
                  containerStyle={globalStyles.phoneInputContainer}
                  textContainerStyle={globalStyles.phoneInputTextContainer}
                  textInputStyle={globalStyles.phoneInputField}
                  textInputProps={{
                    maxLength: 9,
                  }}
                />
              )}
              name="phone"
            />
            {errors.phone && (
              <Text style={globalStyles.errorMessage}>
                Phone number is required.
              </Text>
            )}
          </BasicView>

          <BasicView style={globalStyles.marginTop30}>
            <Button loading={loading} onPress={handleSubmit(onSubmit)}>
              <ButtonText>Request Password Reset</ButtonText>
            </Button>
          </BasicView>

          <BasicView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              style={[globalStyles.marginTop20, globalStyles.centerView]}>
              <Text style={globalStyles.touchablePlainTextSecondary}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </BasicView>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ForgotPasswordScreen;
