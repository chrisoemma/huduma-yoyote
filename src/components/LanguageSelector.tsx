import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { colors } from '../utils/colors';

import { useDispatch, useSelector } from 'react-redux';
import { selectLanguage,setLanguage } from '../costants/languageSlice';


const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'sw', label: 'Kiswahili' }
];

const Selector = () => {
  const { t, i18n } = useTranslation();
  const selectedLanguage = useSelector(selectLanguage);
 
  const dispatch = useDispatch();
  const changeLanguage = (code) => {
    dispatch(setLanguage(code)); // Dispatch Redux action
    i18n.changeLanguage(code);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.title}>{t('common:languageSelector')}</Text>
        <Ionicons color='#444' size={28} name='chevron-down' />
      </View>
      {LANGUAGES.map(language => {
        const lang = language.code === selectedLanguage;

        return (
          <Pressable
            key={language.code}
            style={styles.buttonContainer}
            disabled={lang}
            onPress={() => changeLanguage(language.code)}
          >
            <Text
              style={[lang ? styles.selectedText : styles.text]}
            >
              {language.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingHorizontal: 16
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    color:colors.white,
    fontSize: 28,
    fontWeight: '600'
  },
  buttonContainer: {
    marginTop: 10
  },
  text: {
    fontSize: 18,
    color:colors.primary,
    paddingVertical: 4
  },
  selectedText: {
    fontSize: 18,
    fontWeight: '600',
    color:colors.white,
    paddingVertical: 4
  }
});

export default Selector;