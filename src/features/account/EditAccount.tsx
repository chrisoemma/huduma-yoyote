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
} from 'react-native';


import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
import { globalStyles } from '../../styles/global';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useTranslation } from 'react-i18next';
import { userRegiter } from '../auth/userSlice';
import GooglePlacesInput from '../../components/GooglePlacesInput';

const EditAccount = ({ route, navigation }: any) => {


  const dispatch = useAppDispatch();
  const { user, loading, status } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const phoneInput = useRef<PhoneInput>(null);

  const [location, setLocation] = useState({} as any);

  const [message, setMessage] = useState('');

  const { t } = useTranslation();


  const makeid = (length: any) => {

    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  useEffect(() => {
    if (status !== '') {
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
      email: '',
      name: '',
    },
  });


  const selectLocation = (locationSelected: any) => {
    console.log('Location selected ::');
    console.log(locationSelected);
    setLocation(locationSelected);
  };


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const onSubmit = async (data: any) => {
      data.user_type='client';
     data.email=`${data.phone}@gmail.com`
    dispatch(userRegiter(data))
    .unwrap()
    .then(result => {
      console.log('resultsss', result);
      if (result.status) {
        console.log('excuted this true block')
        ToastAndroid.show("User created successfuly!", ToastAndroid.SHORT);
        navigation.navigate('Login', {
          screen: 'Login',
          message: message
        });
      } 

   
    })

  }

  console.log('user phone',user.phone);

  return (

    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Container>
          <View>
            <BasicView style={globalStyles.centerView}>
              <Text style={globalStyles.errorMessage}>{message}</Text>
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                  {t('auth:phone')}
              </Text>

              <Controller
                control={control}
                rules={{
                  maxLength: 12,
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                   // placeholder= {t('auth:enterName')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || user?.phone}
                    keyboardType='numeric'
                  />
                )}
                name="phone"
              />
              {errors.phone && (
                <Text style={globalStyles.errorMessage}>
                  {t('auth:phoneRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
               {t('auth:name')}
              </Text>

              <Controller
                control={control}
                rules={{
                  maxLength: 12,
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder= {t('auth:enterName')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || user?.client.name}
                  />
                )}
                name="name"
              />
              {errors.name && (
                <Text style={globalStyles.errorMessage}>
                  {t('auth:nameRequired')}
                </Text>
              )}
            </BasicView>

            
            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
               {t('auth:email')}
              </Text>

              <Controller
                control={control}
                rules={{
                  maxLength: 12,
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder= {t('auth:enterEmail')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value || user?.email}
                  />
                )}
                name="email"
              />
              {errors.name && (
                <Text style={globalStyles.errorMessage}>
                  {t('auth:emailRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView style={globalStyles.marginTop20}>
            <GooglePlacesInput
              setLocation={selectLocation}
              placeholder="What's your location?"
            />
          </BasicView>

            <BasicView>
              <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{t('navigate:editAccount')}</ButtonText>
              </Button>
            </BasicView>
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAccount;
