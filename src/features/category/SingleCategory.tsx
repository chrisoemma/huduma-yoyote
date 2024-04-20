import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  View,

} from 'react-native';
import {globalStyles} from '../../styles/global';
import { useTranslation } from 'react-i18next';
import ContentList from '../../components/ContentList';
import { useAppDispatch } from '../../app/store';
import { getSingleCategory} from './CategorySlice';
import { useSelector,RootStateOrAny } from 'react-redux';
import { selectLanguage } from '../../costants/languageSlice';


const SingleCategory = ({ route, navigation }: any) => {

  const { params } = route;
  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const { loading, singleCategory } = useSelector(
    (state: RootStateOrAny) => state.categories,
);


const selectedLanguage = useSelector(selectLanguage);

const dispatch = useAppDispatch();

  React.useLayoutEffect(() => {
    if (params && params?.category) {
      navigation.setOptions({ title: selectedLanguage=='en'?params?.category?.name?.en:params?.category?.name?.sw });
    }
  }, [navigation, params]);


  useEffect(() => {
     if(params.category.id){
      dispatch(getSingleCategory(params?.category?.id));
     }
  }, [dispatch])


  const { t } = useTranslation();
  return (
    <SafeAreaView
      style={globalStyles().scrollBg}
    >
      <View style={globalStyles().subCategory}>
        <ContentList data={singleCategory?.services} isDarkMode={isDarkMode} navigation={navigation}/>
      </View>
    </SafeAreaView>
  )
};

export default SingleCategory;