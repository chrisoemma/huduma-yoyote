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
import Selector from '../../components/LanguageSelector';
import { Container } from '../../components/Container';
import { globalStyles } from '../../styles/global';
import Icon from 'react-native-vector-icons/EvilIcons';
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import Banner from '../../components/Banner';
import Category from '../../components/Category';
import TopService from '../../components/TopService';
import VerticalTabs from '../../components/VerticalTabs';
import ContentList from '../../components/ContentList';
import { useAppDispatch } from '../../app/store';
import { getSingleCategory} from './CategorySlice';
import { useSelector,RootStateOrAny } from 'react-redux';


const SingleCategory = ({ route, navigation }: any) => {

  const { params } = route;

  const { loading, singleCategory } = useSelector(
    (state: RootStateOrAny) => state.categories,
);

const dispatch = useAppDispatch();

  React.useLayoutEffect(() => {
    if (params && params.category) {
      navigation.setOptions({ title: params.category.name });
    }
  }, [navigation, params]);


  useEffect(() => {
     if(params.category.id){
      console.log('not null',params.category.id);
      dispatch(getSingleCategory(params.category.id));
     }
  }, [dispatch])


  const { t } = useTranslation();
  return (
    <SafeAreaView
      style={globalStyles.scrollBg}
    >
      <View style={globalStyles.subCategory}>
        <ContentList data={singleCategory?.services}  navigation={navigation}/>
      </View>
    </SafeAreaView>
  )
};

export default SingleCategory;