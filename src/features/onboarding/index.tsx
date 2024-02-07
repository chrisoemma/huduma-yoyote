import { View, Text, SafeAreaView, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { globalStyles } from '../../styles/global';
import { colors } from '../../utils/colors';
import { useSelector,RootStateOrAny, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectLanguage, setLanguage } from '../../costants/languageSlice';
import { setOnboardingCompleted } from './OnboardingSlice';



const OnBoarding = ({navigation}:any) => {


    const stylesGlobal=globalStyles();

    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
    );
   
    const selectedLanguage = useSelector(selectLanguage);
    const { t, i18n } = useTranslation();


 
    const dispatch = useDispatch();

    const handleLanguageSelect = (code) => {
       dispatch(setLanguage(code));
       i18n.changeLanguage(code);
    };

   const handleGetStarted = ()=>{
      dispatch(setOnboardingCompleted(true))
   }
  

    return (
        <SafeAreaView>
            <ScrollView style={stylesGlobal.scrollBg}>
                <View style={stylesGlobal.appView}>
                    <View style={styles.onboardingImage}>
                        <Image
                            source={require('./../../../assets/images/help.png')}
                            style={{
                                resizeMode: 'cover',
                                width: '90%',
                                height: 250,
                                alignSelf: 'center',
                            }}
                        />
                    </View>
                    <View style={styles.textContent}>
                        <Text style={[styles.welcomeText,{color:isDarkMode?colors.white:colors.black}]}>
                           {t('screens:onbordingWelcome')}
                        </Text>
                        <Text style={[styles.languageText,{color:isDarkMode?colors.white:colors.black}]}>
                           {t('screens:chooseLanguage')}
                        </Text>
                    </View>
                    <View style={styles.languageButton}>
                        <TouchableOpacity 
                        
                        style={[
                            styles.selectButton,
                            selectedLanguage === 'en' && {
                              borderColor: colors.primary,
                             
                            },
                          ]}
                          onPress={() => handleLanguageSelect('en')}
                          
                          >
                            <Image
                                source={require('./../../../assets/images/america.png')}
                                style={{
                                    resizeMode: 'cover',
                                    width: 20,
                                    height: 20,
                                    alignSelf: 'center',

                                }}
                            />
                           <View style={{ flex: 1 }}>
                <Text style={[styles.text, selectedLanguage === 'en' && { color: colors.primary },
                {color:isDarkMode?colors.white:colors.black}
            ]}>English</Text>
              </View>
              <View style={[styles.circle, selectedLanguage === 'en' && { backgroundColor: colors.primary },
              
            ]} />
         
                        </TouchableOpacity>

                        <TouchableOpacity
              style={[
                styles.selectButton,
                selectedLanguage === 'sw' && {
                  borderColor: colors.primary,
                
                },
              ]}
              onPress={() => handleLanguageSelect('sw')}
            >
              <Image
                source={require('./../../../assets/images/tanzania.png')}
                style={{
                  resizeMode: 'cover',
                  width: 20,
                  height: 20,
                  alignSelf: 'center',
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.text, (selectedLanguage === 'sw' && { color: colors.primary }),
                  {color:isDarkMode?colors.white:colors.black}
            ]}>Kiswahili</Text>
              </View>
              <View style={[styles.circle, selectedLanguage === 'sw' && { backgroundColor: colors.primary }]} />
            </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.startedBtn}
                            onPress={handleGetStarted}
                        >
                            <Text style={styles.startedText}>{t('screens:getStarted')}</Text>

                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    onboardingImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        marginTop: '5%',
    },
    textContent: {
        marginTop: '5%',
        marginHorizontal: '3%',
    },
    welcomeText: {
        fontSize: 20,
        textAlign: 'center',
        lineHeight: 30,
        marginBottom: 15,
        fontFamily: 'Roboto-Light'

    },
    languageText: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Prompt-SemiBold'
    },
    selectButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.grey,
        paddingHorizontal: 30,
        paddingVertical: 20,
        marginBottom: '8%'

    },
    languageButton: {
        marginVertical: 20,
        alignItems: 'center',
        marginHorizontal: 30
    },
    circle: {
        height: 15,
        width: 15,
        borderRadius: 15,
        backgroundColor: colors.alsoGrey
    },
    text: {
        marginLeft: '12%',
        color:colors.black
    },
    startedBtn: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        marginVertical: '10%',
        width: '100%', 
        alignSelf: 'center', 
    },
    startedText: {
        fontSize: 19,
        fontFamily: 'Roboto-Bold',
        color: colors.white,
        textAlign: 'center',
        paddingVertical: '8%',
    },
});

export default OnBoarding;
