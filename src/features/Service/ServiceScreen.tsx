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
import ContentServiceList from '../../components/ContentServiceList';


const ServiceScreen = ({ route, navigation }: any) => {

  let services = [
    {
      name:'Urembo',
      icon:'dingding'
    },
    {
      name:'Massage',
      icon:'aliwangwang-o1'
    },
    {
      name:'Chakula',
      icon:'weibo'
    },
    {
      name:'Dobi',
      icon:''
    },
    {
      name:'Upambaji',
      icon:''
    },
    {
      name:'Fundi nguo',
      icon:''
    },
    {
      name:'Dobi1',
      icon:''
    },
    {
      name:'Upambaji1',
      icon:''
    },
    {
      name:'Fundi nguo1',
      icon:''
    },
    {
      name:'Dobi2',
      icon:''
    },
    {
      name:'Upambaji2',
      icon:''
    },
    {
      name:'Fundi nguo2',
      icon:''
    },
    {
      name:'Dobi3',
      icon:''
    },
    {
      name:'Upambaji3',
      icon:''
    },
    {
      name:'Fundi nguo3',
      icon:''
    },
    {
      name:'Dobi4',
      icon:''
    },
    {
      name:'Upambaji4',
      icon:''
    },
    {
      name:'Fundi nguo4',
      icon:''
    },
  ]

  const [activeTab, setActiveTab] = useState(0);
  const [contentData, setContentData] = useState([]);

  const handleTabPress = async (tabIndex:any) => {
    setActiveTab(tabIndex);
    // const newData = await fetchDataForTab(tabIndex);
    setContentData(services);
  };

  const { t } = useTranslation();
  return (
    <SafeAreaView
    style={globalStyles.scrollBg}
    >
         <View style={globalStyles.mainContainer}>
          <View style={globalStyles.side}>
           <VerticalTabs tabs={services} activeTab={activeTab} onTabPress={handleTabPress} />
          </View>
          <View style={globalStyles.sub}>
          <ContentServiceList data={services} />
          </View>
         </View>
    </SafeAreaView>
  )
};

export default ServiceScreen;