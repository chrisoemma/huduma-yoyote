import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import { globalStyles } from '../../styles/global';
import Icon from 'react-native-vector-icons/EvilIcons';
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import Banner from '../../components/Banner';
import Category from '../../components/Category';
import TopService from '../../components/TopService';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getCategories } from '../category/CategorySlice';
import { getServices } from '../Service/ServiceSlice';
import { getBanners } from './BannerSlice';
import { sortByLanguage} from '../../utils/utilts';
import { selectLanguage } from '../../costants/languageSlice';

const Home = ({ navigation }: any) => {
  const { categories } = useSelector((state: RootStateOrAny) => state.categories);
  const { services } = useSelector((state: RootStateOrAny) => state.services);
  const { banners } = useSelector((state: RootStateOrAny) => state.banners);

  const selectedLanguage = useSelector(selectLanguage);


  const sortedCategories = sortByLanguage(categories, selectedLanguage);
  const sortedServices = sortByLanguage(services, selectedLanguage);

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [refreshMessage,setRefreshMessage] =useState('');
const [refreshing, setRefreshing] = useState(false);
const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
    dispatch(getServices());
    dispatch(getBanners());
  }, []);


  const callGetHomeData = React.useCallback(() => {
    setRefreshing(true);
    dispatch(getCategories());
    dispatch(getServices());
    dispatch(getBanners())
      .unwrap()
      .then(result => {
        setRefreshing(false);
        setRefreshMessage(`${t('screens:dataRefreshed')}`);
        setTimeout(() => {
          setRefreshMessage(''); 
        }, 3000); 
      })
      .catch(error => {
        
      });
  }, []);

  const stylesGlobal = globalStyles();

  const handleCategoryPress = (category: any) => {
    navigation.navigate('Single category', {
      category: category,
    });
  };

  const handleServicePress = (service: any) => {
    navigation.navigate('Service Details', {
      service: service,
    });
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <Category category={item} onPress={() => handleCategoryPress(item)} />
  );

  const renderServiceItem = ({ item }: { item: any }) => (
    <TopService key={item.id} service={item} onPress={() => handleServicePress(item)} />
  );





  const loadMoreData = () => {
    if (!loadingMore) {
      setLoadingMore(true);
      dispatch(getServices())
        .unwrap()
        .then(() => {
          setLoadingMore(false);
        })
        .catch(error => {
          setLoadingMore(false);
          // Handle errors if necessary
        });
    }
  };

  const renderHeader = () => (
    <>
      <View style={stylesGlobal.homepageHeader}>
        <TouchableOpacity
          style={stylesGlobal.searchContainer}
          onPress={() => navigation.navigate('Search')}
        >
          <View style={stylesGlobal.search}>
            <View style={stylesGlobal.searchContent}>
              <Icon name="search" color={colors.white} size={30} />
              <Text style={stylesGlobal.searchText}>{t('screens:searchText')}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      <View style={stylesGlobal.banner}>
        {banners?.length > 0 ? (
          <Banner BannerHeight={180} BannerImgs={banners} />
        ) : (
          <View />
        )}
      </View>
      <View>
        <Text style={[stylesGlobal.serviceText, { marginLeft: 10 }]}>
          {t('screens:categories')}
        </Text>
        <FlatList
          data={sortedCategories}
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
      <View style={{ marginBottom: 10 }}>
        <Text style={[stylesGlobal.serviceText, { marginLeft: 10 }]}>
          {t('screens:topService')}
        </Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[stylesGlobal.scrollBg, { flex: 1 }]}>
        <FlatList
          data={sortedServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderServiceItem}
          numColumns={2}
          ListHeaderComponent={renderHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={callGetHomeData} />
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
        />
        <TouchableOpacity
          style={{ alignItems: 'flex-end', marginBottom: 20 }}
          onPress={() => navigation.navigate('Categories')}
        >
          <Text style={stylesGlobal.seeAll}>{t('screens:viewAll')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
