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
import { useSelector,RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store'
import { getCategories } from '../category/CategorySlice';
import { getServices } from '../Service/ServiceSlice';


const Home = ({ route, navigation }: any) => {

  const { loading, categories, } = useSelector(
    (state: RootStateOrAny) => state.categories,
);
const {services} = useSelector(
  (state: RootStateOrAny) => state.services,
);

const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(getCategories());
  dispatch(getServices());
}, [])

  let bannerImages = [
    {
      id:1,
      img_url:'banner.jpg'
    },
    { id:2,
      img_url:'banner-1.jpg'
    },
   
  ]


  //console.log('services',services);

  const handleCategoryPress = (category)=>{
   // console.log('category',category);
        navigation.navigate('Single category',{
          category:category,
        })
  }

  
  const handleServicePress = (service)=>{
   // console.log('service',service);
        navigation.navigate('Service providers',{
          service:service,
        })
  }

  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <ScrollView 
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      >
        <Container>
         <View style={globalStyles.homepageHeader}>
           <View style={globalStyles.searchContainer}>
               <TouchableOpacity style={globalStyles.search}>
                 <View style={globalStyles.searchContent}>
                 <Icon    
                  name="search"
                  color={colors.white}
                  size={30}
                  />
                  <Text style={globalStyles.searchText}>{t('screens:searchText')}</Text>
                 </View>
               </TouchableOpacity>
           </View>
         </View>
         <View style={globalStyles.banner}>
            {bannerImages?.length > 0 ? (
              <Banner BannerHeight={180} BannerImgs={bannerImages} />
            ) : (
              <Text>Hello</Text>
            )}
          </View>
          
         <View style={globalStyles.appView}>
          <View style={globalStyles.categoryWrapper}>
           {categories.map(category=>(
             <Category  
             category={category} 
             onPress={() => handleCategoryPress(category)} 
             />
           ))

           }
          </View>
          <TouchableOpacity
            style={{ alignItems: "flex-end" }}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={globalStyles.seeAll}>{t('screens:viewAll')}</Text>
          </TouchableOpacity>
          <Text style={globalStyles.serviceText}>{t('screens:topService')}</Text>
          <View style={globalStyles.topServices}>
            {services?.map(service=>(
               <TopService 
               service={service}
               onPress={() => handleServicePress(service)} 
                />
            ))
            }
          </View>
          <TouchableOpacity
            style={{ alignItems: "flex-end" }}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={globalStyles.seeAll}>{t('screens:viewAll')}</Text>
          </TouchableOpacity>
         </View>
        
        </Container>
      </ScrollView>
    </SafeAreaView>
  )
};

export default Home;