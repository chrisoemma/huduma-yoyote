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
import { useSelector,RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getCategoryServices } from './CategorySlice';


const CategoryScreen = ({ route, navigation }: any) => {

  const { loading, category_services, } = useSelector(
    (state: RootStateOrAny) => state.categories,
);

const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(getCategoryServices());
}, [dispatch])

  const [activeTab, setActiveTab] = useState(0);
  const [contentData, setContentData] = useState([]);

  const handleTabPress = async (tabIndex:any) => {
    setActiveTab(tabIndex);
    console.log('tabIndex',tabIndex)
    // const newData = await fetchDataForTab(tabIndex);
    const categoryServices = category_services.find(
      (entry) => entry.id === tabIndex
    );
    
    if (categoryServices) {
      setContentData(categoryServices.services);
    }
  };

  const { t } = useTranslation();
  return (
    <SafeAreaView
    style={globalStyles.scrollBg}
    >
         <View style={globalStyles.mainContainer}>
          <View style={globalStyles.side}>
           <VerticalTabs tabs={category_services} activeTab={activeTab} 
           onTabPress={handleTabPress} />
          </View>
          <View style={globalStyles.sub}>
          <ContentList data={contentData}  navigation={navigation}/>
          </View>
         </View>
    </SafeAreaView>
  )
};

export default CategoryScreen;