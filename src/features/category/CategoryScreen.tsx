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

import { globalStyles } from '../../styles/global';

import { useTranslation } from 'react-i18next';
import VerticalTabs from '../../components/VerticalTabs';
import ContentList from '../../components/ContentList';
import { useSelector,RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getCategoryServices } from './CategorySlice';


const CategoryScreen = ({ route, navigation }: any) => {

  const { loading, category_services, } = useSelector(
    (state: RootStateOrAny) => state.categories,
);

const { isDarkMode } = useSelector(
  (state: RootStateOrAny) => state.theme,
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
    style={globalStyles().scrollBg}
    >
         <View style={globalStyles().mainContainer}>
          <View style={globalStyles().side}>
           <VerticalTabs tabs={category_services} isDarkMode={isDarkMode}  activeTab={activeTab} 
           onTabPress={handleTabPress} />
          </View>
          <View style={globalStyles().sub}>
          <ContentList data={contentData}  isDarkMode={isDarkMode}  navigation={navigation}/>
          </View>
         </View>
    </SafeAreaView>
  )
};

export default CategoryScreen;