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

import Icon from 'react-native-vector-icons/Feather';

import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { globalStyles } from '../../styles/global';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import { changePassword, createAccountPassword } from './userSlice';
import { useTranslation } from 'react-i18next';
import { colors } from '../../utils/colors';
import showToast from '../../components/ShowToast/showToast';

const CreateNewPassword = ({ route, navigation }: any) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();


    const { user, loading, status } = useSelector(
        (state: RootStateOrAny) => state.user,
    );


    const stylesGlobal = globalStyles();

    const [message, setMessage] = useState('');

    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const { passwordVisibility, rightIcon, handlePasswordVisibility } =
        useTogglePasswordVisibility();

    useEffect(() => {
    }, [user]);

    //   useEffect(() => {
    //     if (status !== '') {
    //       setMessage(status);
    //     }
    //   }, [status]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            password: '',
            comfirm_password: ''
        },
    });
    const onSubmit = (data: any) => {

        const { phone } = route?.params;
        data.phone = phone;

        //    console.log('phonenne',data)
        // return 
        if (data.password === data.comfirm_password) {
          
            dispatch(createAccountPassword(data))
                .unwrap()
                .then(result => {


                    if (result.status) {
                   
                        showToast(`${t('screens:accountPasswordCreated')}`,'success','long')
                    } else {
                        showToast(`${t('screens:requestFail')}`,'danger','long')
                        // console.log('Message with error should be set');
                    }
                })
                .catch(rejectedValueOrSerializedError => {
                    // handle error here
                    console.log('error');
                    console.log(rejectedValueOrSerializedError);
                });
        } else {
            setPasswordsMatch(false);
        }
    };

    return (
        <SafeAreaView style={stylesGlobal.scrollBg}>
            <ScrollView contentInsetAdjustmentBehavior="automatic">

                <BasicView style={stylesGlobal.marginTop60}>
                    <Text style={stylesGlobal.mediumHeading}>
                        {t('auth:createAccountPassword')}
                    </Text>
                </BasicView>

                <BasicView>
                    <Text style={stylesGlobal.errorMessage}>{message}</Text>
                </BasicView>

                <BasicView>
                    <Text
                        style={[
                            stylesGlobal.inputFieldTitle,
                            stylesGlobal.marginTop20,
                        ]}>
                        {t('auth:password')}
                    </Text>

                    <View style={stylesGlobal.passwordInputContainer}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[stylesGlobal.passwordInputField,
                                    { backgroundColor: colors.white, color: colors.black }
                                    ]}
                                    secureTextEntry={passwordVisibility}
                                    placeholder={t('auth:password')}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    passwordRules="minlength:4"
                                    
                                />
                            )}
                            name="password"
                        />

                        <TouchableOpacity onPress={handlePasswordVisibility}>
                            <Icon name={rightIcon} size={20} color={colors.grey} />
                        </TouchableOpacity>

                    </View>
                    {errors.password && (
                        <Text style={stylesGlobal.errorMessage}>
                            {t('auth:passwordRequired')}
                        </Text>
                    )}
                </BasicView>

                <BasicView>
                    <Text
                        style={[
                            stylesGlobal.inputFieldTitle,
                            stylesGlobal.marginTop20,
                        ]}>
                        {t('auth:comfirmNewPassword')}
                    </Text>

                    <View style={stylesGlobal.passwordInputContainer}>
                        <Controller
                            control={control}
                            rules={{
                                required: true,
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[stylesGlobal.passwordInputField,
                                    { backgroundColor: colors.white, color: colors.black }
                                    ]}
                                    placeholder={t('auth:enterComfirmPassword')}
                                    secureTextEntry={passwordVisibility}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    passwordRules="minlength:4"
                                />
                            )}
                            name="comfirm_password"
                        />

                        <TouchableOpacity onPress={handlePasswordVisibility}>
                            <Icon name={rightIcon} size={20} color={colors.grey} />
                        </TouchableOpacity>

                    </View>
                    {errors.comfirm_password && (
                        <Text style={stylesGlobal.errorMessage}>
                            {t('auth:oldPasswordRequired')}
                        </Text>
                    )}
                    {!passwordsMatch && (
                        <Text style={stylesGlobal.errorMessage}>
                            {t('auth:passwordMatch')}
                        </Text>
                    )}
                </BasicView>

                <BasicView style={stylesGlobal.marginTop30}>
                    <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                        <ButtonText>{t('screens:createPassword')}</ButtonText>
                    </Button>
                </BasicView>

            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateNewPassword;
