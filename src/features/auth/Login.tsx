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
import { globalStyles } from '../../style/global';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';

const LoginScreen = ({ route, navigation }: any) => {
  const dispatch = useDispatch();
  const { user, loading, status } = useSelector(
    (state: RootStateOrAny) => state.user,
  );
  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const phoneInput = useRef<PhoneInput>(null);

  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log(user);
  }, [user]);

  useEffect(() => {
    if (status !== null) {
      setMessage(status);
    }
  }, [status]);

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
  const onSubmit = (data: any) => {
    console.log(data);
    // navigation.navigate('Register');
    dispatch(userLogin(data));

  };

  return (
    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Container>
          <View style={globalStyles.centerView}>
            <Image
              source={require('./../../../assets/images/logo.png')}
              style={globalStyles.verticalLogo}
            />
          </View>
          <View>
            <Text style={globalStyles.largeHeading}>Login</Text>
          </View>
          <View>
            <BasicView style={globalStyles.centerView}>
              <Text style={globalStyles.errorMessage}>{message}</Text>
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop10,
                ]}>
                Phone
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PhoneInput
                    ref={phoneInput}
                    placeholder="700 111 222"
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
            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                Password
              </Text>

              <View style={globalStyles.passwordInputContainer}>
                <Controller
                  control={control}
                  rules={{
                    maxLength: 12,
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
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
              {errors.phone && (
                <Text style={globalStyles.errorMessage}>
                  Password is required.
                </Text>
              )}
            </BasicView>

            <BasicView>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ForgotPassword');
                }}
                style={[
                  globalStyles.touchableOpacityPlain,
                  globalStyles.marginTop10,
                ]}>
                <Text style={globalStyles.touchablePlainTextSecondary}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>Login</ButtonText>
              </Button>
            </BasicView>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Register');
              }}
              style={[globalStyles.marginTop20, globalStyles.centerView]}>
              <Text style={globalStyles.touchablePlainTextSecondary}>
                Don't have an account? Register
              </Text>
            </TouchableOpacity>
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
