import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,

} from 'react-native';
import { globalStyles } from '../../styles/global';
import { useTranslation } from 'react-i18next';
import ContentList from '../../components/ContentList';
import { useAppDispatch } from '../../app/store';
import { getSingleCategory } from './CategorySlice';
import { useSelector, RootStateOrAny } from 'react-redux';
import { selectLanguage } from '../../costants/languageSlice';


const SingleCategory = ({ route, navigation }: any) => {

  const { category, source } = route.params;
  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const { loading, singleCategory } = useSelector(
    (state: RootStateOrAny) => state.categories,
  );

  const selectedLanguage = useSelector(selectLanguage);

  const dispatch = useAppDispatch();
  let title = selectedLanguage == 'en' ? category?.name?.en : category?.name?.sw;
  let categoryId = category?.id

  if (source) {
    title = selectedLanguage == 'en' ? category?.name.name?.en : category?.name?.name?.sw;
    categoryId = category?.name.id
  } else {
    title = selectedLanguage == 'en' ? category?.name?.en : category?.name?.sw;
    categoryId = category?.id
  }

  React.useLayoutEffect(() => {
    if (category) {
      navigation.setOptions({ title: title });
    }
  }, [navigation, category]);


  useEffect(() => {
    if (category) {
      dispatch(getSingleCategory(categoryId));
    }
  }, [dispatch])


  const { t } = useTranslation();
  return (
    <SafeAreaView
      style={globalStyles().scrollBg}
    >
      <View style={globalStyles().subCategory}>
        <ContentList data={singleCategory?.services} isDarkMode={isDarkMode} navigation={navigation} />
      </View>
    </SafeAreaView>
  )
};

export default SingleCategory;