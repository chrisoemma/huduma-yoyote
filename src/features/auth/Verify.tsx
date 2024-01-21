import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';

import {useForm, Controller} from 'react-hook-form';
import {RootStateOrAny, useSelector} from 'react-redux';
import {globalStyles} from '../../styles/global';

import {BasicView} from '../../components/BasicView';
import Button from '../../components/Button';
import {ButtonText} from '../../components/ButtonText';
import {useAppDispatch} from '../../app/store';
import {userVerify} from './userSlice';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/colors';

const VerifyScreen = ({route, navigation}: any) => {
  const {nextPage} = route?.params;
  const { t } = useTranslation();

  const {user, loading, status} = useSelector(
    (state: RootStateOrAny) => state.user,
  );

    useEffect(() => {
    if (status !== null) {
      setMessage(status);
    }
  }, [status]);

  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);


  useEffect(() => {
   
  }, [user]);


  const inputs = Array(6).fill(0).map((_, i) => React.createRef());

  const handleVerificationCodeChange = (index, value) => {
   
    const newVerificationCode = [...verificationCode];
    newVerificationCode[index] = value;
    setVerificationCode(newVerificationCode);
  
    // Move focus to the next input if there is a value and the next input exists
    if (value !== '' && index < 5 && inputs[index + 1]) {
      inputs[index + 1].current.focus();
    }
  };

  const numericCode = parseInt(verificationCode.join(''), 10);

  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };


  const onSubmit =async () => {

    if (numericCode.toString().length === 6) {
    if (nextPage === 'PasswordReset') {
      
       const  {phone}=route?.params;
     const result= await dispatch(userVerify({phone:phone, code:numericCode,app_type:'client'})).unwrap();
        if(result.status){
          navigation.navigate('PasswordReset', {verificationCode: numericCode});
        }else{
          setDisappearMessage(result.message); 
        }
    } else {
      dispatch(userVerify({user_id: user.id, code:numericCode,app_type:'client'}));
    }
  }else{
    
    setDisappearMessage('Please enter correct code'); 
  }
  };


  const stylesGlobal = globalStyles();
  
  return (
    <SafeAreaView style={stylesGlobal.scrollBg} >
      <ScrollView contentInsetAdjustmentBehavior="automatic">
      
          <BasicView style={{marginVertical:50}}>
            <Text style={stylesGlobal.smallHeading}>{t('auth:enterVerificationCode')}</Text>
          </BasicView>

          <BasicView>
            <Text style={stylesGlobal.errorMessage}>{message}</Text>
          </BasicView>

      <BasicView style={{marginVertical:50}}>
          <View style={styles.inputContainer}>
        {verificationCode.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={digit}
            onChangeText={(value) => handleVerificationCodeChange(index, value)}
            maxLength={1}
            keyboardType="numeric"
            ref={inputs[index]}
          />
        ))}
      </View>
      </BasicView>

          <BasicView style={stylesGlobal.marginTop30}>
            <Button loading={loading} onPress={()=>onSubmit()}>
              <ButtonText>{t('auth:verify')}</ButtonText>
            </Button>
          </BasicView>

          <BasicView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              style={[stylesGlobal.marginTop20, stylesGlobal.centerView]}>
              <Text style={stylesGlobal.touchablePlainTextSecondary}>
                {t('auth:alreadyHaveAccount')}
              </Text>
            </TouchableOpacity>
          </BasicView>
      
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent:'center'
  },
  input: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    textAlign: 'center',
    fontSize: 18,
    backgroundColor:colors.white,
    color:colors.black
  },
});

export default VerifyScreen;
