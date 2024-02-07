import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {globalStyles} from '../../styles/global';
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
import { getBanners } from './BannerSlice';

const Home = ({ route, navigation }: any) => {

  const { loading, categories, } = useSelector(
    
    (state: RootStateOrAny) => state.categories,
);

const {services} = useSelector(
  (state: RootStateOrAny) => state.services,
);
const { banners } = useSelector((state: RootStateOrAny) => state.banners);

const dispatch = useAppDispatch();

useEffect(() => {
  dispatch(getCategories());
  dispatch(getServices());
  dispatch(getBanners());
}, [])

const stylesGlobal = globalStyles();


  const handleCategoryPress = (category)=>{
   // console.log('category',category);
        navigation.navigate('Single category',{
          category:category,
        })
  }

  
  const handleServicePress = (service)=>{
        navigation.navigate('Service providers',{
          service:service,
        })
  }

  const renderCategoryItem = ({ item }) => (
    <Category category={item} onPress={() => handleCategoryPress(item)} />
  );

  const renderServiceItem = ({ item }) => (
    <TopService key={item.id} service={item} onPress={() => handleServicePress(item)} />
  );

  const { t } = useTranslation();
  return (
    <SafeAreaView>
      <View style={{height:'100%'}}>
      
         <View style={stylesGlobal.homepageHeader}>
           <View style={stylesGlobal.searchContainer}>
               <TouchableOpacity style={stylesGlobal.search}
                onPress={()=>navigation.navigate('Search')}
               >
                 <View style={stylesGlobal.searchContent}>
                 <Icon    
                  name="search"
                  color={colors.white}
                  size={30}
                  />
                  <Text style={stylesGlobal.searchText}>{t('screens:searchText')}</Text>
                 </View>
               </TouchableOpacity>
           </View>
         </View>
         <View style={stylesGlobal.banner}>
            {banners?.length > 0 ? (
              <Banner BannerHeight={180} BannerImgs={banners} />
            ) : (
              <View />
            )}
          </View>
           
           
          <View >
          <FlatList
              data={categories}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              renderItem={renderCategoryItem}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: 'row' }}
            />
          </View>
          <TouchableOpacity
            style={{ alignItems: "flex-end" }}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={stylesGlobal.seeAll}>{t('screens:viewAll')}</Text>
          </TouchableOpacity>


          <View style={{flex:1,marginBottom:10}}>
          <Text style={stylesGlobal.serviceText}>{t('screens:topService')}</Text>
            <FlatList
              data={services}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderServiceItem}
              showsVerticalScrollIndicator={false}
              numColumns={2}
             
            />
            <TouchableOpacity
              style={{ alignItems: 'flex-end' }}
              onPress={() => navigation.navigate('Categories')}
            >
              <Text style={stylesGlobal.seeAll}>{t('screens:viewAll')}</Text>
            </TouchableOpacity>
          </View>
       
      </View>
    
    </SafeAreaView>
  )
};

export default Home;