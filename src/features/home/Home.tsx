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


const Home = ({ route, navigation }: any) => {

  let bannerImages = [
    {
      img_url:''
    },
    {
      img_url:''
    }
  ]

  let categories = [
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
    // {
    //   name:'Dobi',
    //   icon:''
    // },
    // {
    //   name:'Upambaji',
    //   icon:''
    // },
    // {
    //   name:'Fundi nguo',
    //   icon:''
    // },
  ]
  const  services =[
    {
      name:'kushonea wigi'
    },
    {
      name:'Kuuza dread original'
    },
    {
      name:'suti'
    },
    {
      name:'Kutengeneza sofa'
    }
  ]

  const handleCategoryPress = (category)=>{
    console.log('category',category);
        navigation.navigate('Single category',{
          category:category,
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
            <Text style={globalStyles.seeAll}>View All</Text>
          </TouchableOpacity>
          <Text style={globalStyles.serviceText}>Top Service</Text>
          <View style={globalStyles.topServices}>
            {services.map(service=>(
               <TopService service={service} />
            ))
            }
           
          </View>
          <TouchableOpacity
            style={{ alignItems: "flex-end" }}
            onPress={() => {}}
          >
            <Text style={globalStyles.seeAll}>View All</Text>
          </TouchableOpacity>
         </View>
        
        </Container>
      </ScrollView>
    </SafeAreaView>
  )
};

export default Home;