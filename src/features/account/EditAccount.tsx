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
import {globalStyles} from '../../styles/global';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { useTranslation } from 'react-i18next';
import { updateUserInfo} from '../auth/userSlice';
import GooglePlacesInput from '../../components/GooglePlacesInput';
import { validateTanzanianPhoneNumber } from '../../utils/utilts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import showToast from '../../components/ShowToast/showToast';

const EditAccount = ({ route, navigation }: any) => {


  const dispatch = useAppDispatch();
  const { user, loading, status } = useSelector(
    (state: RootStateOrAny) => state.user,
  );


  const phoneInput = useRef<PhoneInput>(null);

  const [location, setLocation] = useState({} as any);

  const [message, setMessage] = useState('');

  const { t } = useTranslation();

  const stylesGlobal = globalStyles();

  const [gLocation,setGLocation]=useState({})


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
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      email: '',
      name:'',
    },
  });

  useEffect(() => {
    const cleanedPhone = user?.phone?.replace(/\+/g, '');
    setValue('name', user?.client.name);
    setValue('phone', cleanedPhone);
    setValue('email', user?.email);
    setGLocation({latitude:user?.client?.latitude,longitude:user?.client?.longitude})
}, [route.params]);

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

    if (Object.keys(location).length === 0) {
  
      data.latitude = user?.client?.latitude;
      data.longitude = user.client?.longitude;
    } else {
      data.latitude = location.lat;
      data.longitude = location.lng;
    }
    data.phone = validateTanzanianPhoneNumber(data.phone);

    dispatch(updateUserInfo({ data: data, userType: 'client', userId: user?.id }))
      .unwrap()
      .then(result => {
        console.log('resultsss', result);
        if (result.status) {
          console.log('excuted this true block')
          showToast(`${t('screens:userUpdated')}`,'success','long')
          navigation.navigate('Account', {
            screen: 'Account',
            message: message
          });
        }else{
       
          if (result.error) {
            showToast(result.error,'danger','long')
          } else {
            showToast(result.message,'danger','long')
       
          }
        }
      })
  }


  return (

    <SafeAreaView
    style={stylesGlobal.scrollBg}
    >
      <ScrollView contentInsetAdjustmentBehavior="automatic">
      
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
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInputField
          placeholder={t('screens:enterPhone')}
          onBlur={onBlur}
          onChangeText={(text) => {
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
          maxLength={12}
          editable={!user?.phone_verified_at} 
        />
        {user?.phone_verified_at && (
          <Icon name="check-circle" size={24} color={colors.successGreen} style={{ marginLeft: 10 }} />
        )}
      </View>
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
                    placeholder= {t('auth:enterName')}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
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

            <BasicView>
              <Text
                style={[
                  stylesGlobal.inputFieldTitle,
                  stylesGlobal.marginTop20,
                ]}>
                {t('auth:email')}
              </Text>

              <Controller
                control={control}
                rules={{
                
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, // Regular expression for email validation
                    message: 'Invalid email address',
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder={t('auth:enterEmail')}
                    onBlur={onBlur}
                    keyboardType='email-address'
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="email"
              />
              {errors.email && (
                <Text style={stylesGlobal.errorMessage}>
                  {t('auth:emailRequired')}
                </Text>
              )}
            </BasicView>

            <BasicView style={stylesGlobal.marginTop20}>
              <Text style={stylesGlobal.inputFieldTitle}>{t('screens:location')}:</Text>
              <GooglePlacesInput
                setLocation={selectLocation}
                placeholder={t('screens:whatsYourLocation')}
                defaultValue={gLocation}
              />
            </BasicView>

            <BasicView>
              <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>{t('navigate:editAccount')}</ButtonText>
              </Button>
            </BasicView>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditAccount;
