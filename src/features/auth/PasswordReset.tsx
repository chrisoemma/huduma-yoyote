import React, {useEffect, useRef, useState} from 'react';
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

import {useForm, Controller} from 'react-hook-form';
import {RootStateOrAny, useSelector} from 'react-redux';
import {useAppDispatch} from '../../app/store';
import {globalStyles} from '../../style/global';
import {useTogglePasswordVisibility} from '../../hooks/useTogglePasswordVisibility';
import PhoneInput from 'react-native-phone-number-input';
import {colors} from '../../utils/colors';
import {Container} from '../../components/Container';
import {BasicView} from '../../components/BasicView';
import Button from '../../components/Button';
import {ButtonText} from '../../components/ButtonText';
import {resetPassword} from './userSlice';

const PasswordResetScreen = ({route, navigation}: any) => {
  const dispatch = useAppDispatch();

  const {verificationCode} = route.params;

  const {user, loading, status} = useSelector(
    (state: RootStateOrAny) => state.user,
  );
  const {passwordVisibility, rightIcon, handlePasswordVisibility} =
    useTogglePasswordVisibility();

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
      password: '',
    },
  });
  const onSubmit = (data: any) => {
    console.log(data);
    dispatch(
      resetPassword({
        phone: user.phone,
        code: verificationCode,
        password: data.password,
      }),
    )
      .unwrap()
      .then(result => {
        // handle result here
        console.log('result');
        console.log(result);

        if (result.status) {
          console.log('Navigate to login');
          navigation.navigate('Login');
        } else {
          console.log('Message with error should be set');
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
            <Text style={globalStyles.mediumHeading}>Reset{'\n'}Password</Text>
          </BasicView>

          <BasicView>
            <Text style={globalStyles.errorMessage}>{message}</Text>
          </BasicView>

          <BasicView>
            <Text
              style={[globalStyles.inputFieldTitle, globalStyles.marginTop20]}>
              Password
            </Text>

            <View style={globalStyles.passwordInputContainer}>
              <Controller
                control={control}
                rules={{
                  maxLength: 12,
                  required: true,
                }}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={globalStyles.passwordInputField}
                    secureTextEntry={passwordVisibility}
                    placeholder="Enter Password"
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
              <Text style={globalStyles.errorMessage}>
                Password is required.
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
                navigation.navigate('Register');
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

export default PasswordResetScreen;
