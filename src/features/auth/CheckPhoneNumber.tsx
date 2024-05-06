import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from 'react-native';

import PhoneInput from 'react-native-phone-number-input';
import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';

import { findNumber, forgotPassword } from './userSlice';

import { BasicView } from '../../components/BasicView';
import { ButtonText } from '../../components/ButtonText';
import Button from '../../components/Button';
import { globalStyles } from '../../styles/global';
import { useTranslation } from 'react-i18next';

const CheckPhoneNumber = ({ route, navigation }: any) => {
    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const { user, loading, status } = useSelector(
        (state: RootStateOrAny) => state.user,
    );

    const styles = globalStyles();

    const phoneInput = useRef<PhoneInput>(null);

    const [message, setMessage] = useState('');

    useEffect(() => {
        console.log(user);
    }, [user]);

    //   useEffect(() => {
    //     if (status !== '') {
    //       setMessage(status);
    //     }
    //   }, [status]);

    const setDisappearMessage = (message: any) => {
        setMessage(message);

        setTimeout(() => {
            setMessage('');
        }, 8000);
    };


    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            phone: '',
        },
    });
    const onSubmit = (data: any) => {
        data.app_type = 'client'; 
        dispatch(findNumber(data))
            .unwrap()
            .then(result => {
                // handle result here
                console.log('result');
                console.log(result);

                if (result.status) {
                    console.log('navigting to verify')
                    navigation.navigate('Verify', { nextPage: 'CreateNewPassword', phone: data.phone });

                } else {
                    if (result.error) {
                        setDisappearMessage(result.error
                        );
                    } else {
                        setDisappearMessage(result.message);
                    }
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
            <ScrollView contentInsetAdjustmentBehavior="automatic">

                <BasicView style={styles.marginTop60}>
                    <Text style={styles.mediumHeading}>
                        {t('auth:checkNumber')}
                    </Text>
                </BasicView>

                <BasicView>
                    <Text style={styles.errorMessage}>{message}</Text>
                </BasicView>

                <BasicView>
                    <Text
                        style={[
                            styles.inputFieldTitle,
                            styles.marginTop10,
                        ]}>
                        {t('auth:phone')}
                    </Text>
                    <Controller
                        control={control}
                        rules={{
                            required: true,
                        }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <PhoneInput
                                ref={phoneInput}
                                placeholder="714 055 666"
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
                                containerStyle={styles.phoneInputContainer}
                                textContainerStyle={styles.phoneInputTextContainer}
                                textInputStyle={styles.phoneInputField}
                                textInputProps={{
                                    maxLength: 9,
                                }}
                            />
                        )}
                        name="phone"
                    />
                    {errors.phone && (
                        <Text style={styles.errorMessage}>
                            {t('auth:phoneRequired')}
                        </Text>
                    )}
                </BasicView>


                <BasicView style={styles.marginTop30}>
                    <Button loading={loading} onPress={handleSubmit(onSubmit)}>
                        <ButtonText>{t('auth:checkPhoneNumber')}</ButtonText>
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

export default CheckPhoneNumber;
