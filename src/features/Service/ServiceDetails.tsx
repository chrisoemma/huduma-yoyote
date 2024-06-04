import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Text, View, Image, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import Animated, { useSharedValue, withTiming, runOnJS } from "react-native-reanimated";
import Carousel, {
  ICarouselInstance,
} from "react-native-reanimated-carousel";
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook from React Navigation
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from react-native-vector-icons
import { BasicView } from "../../components/BasicView";
import { useSelector } from "react-redux";
import { selectLanguage } from "../../costants/languageSlice";
import { useTranslation } from "react-i18next";
import Divider from "../../components/Divider";
import { colors } from "../../utils/colors";
import { useAppDispatch } from "../../app/store";
import { globalStyles } from "../../styles/global";
import TopService from "../../components/TopService";
import { getSimilarService, getSingleService, getSubserviceByService } from "./ServiceSlice";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import ContentServiceList from '../../components/ContentServiceList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

const ServiceDetails = ({ route }: any) => {

  const selectedLanguage = useSelector(selectLanguage);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { service:serviceData,similarServices, subServiceByService } = useSelector(
    (state: RootStateOrAny) => state.services,
  );


  const { service,source } = route.params;

     let serviceId=service?.id
    if(source){
      if(source=='search'){
        serviceId=service?.name?.id
      }else{
        serviceId=service?.name?.service_id
      } 
      }else{
        serviceId=service?.id
      }

  useEffect(() => {
    dispatch(getSingleService(serviceId))
    dispatch(getSimilarService(service?.id));
    dispatch(getSubserviceByService(service?.id));
  }, [service])
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const navigation = useNavigation();

  const [activeIndex, setActiveIndex] = React.useState<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
    setActiveIndex(index);
  };

  const handleBackNavigation = () => {
    navigation.goBack();
  };

  const handleFindProviders = () => {
    navigation.navigate('Service providers', {
      service: serviceData,
    });
  };

  const handleServicePress = (service) => {
    navigation.navigate('Service Details', {
      service: service,
    })
  }

  const renderServiceItem = ({ item }) => (
    <TopService key={item.id} service={item} onPress={() => handleServicePress(item)} />
  );


  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [sheetTitle, setSheetTitle] = useState('');

  const snapPoints = useMemo(() => ['25%', '100%'], []);

  // callbacks
  const handlePresentModalPress = useCallback((title: any) => {
    setSheetTitle(title);
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    //console.log('handleSheetChanges', index);
  }, [])

  const stylesGlobal = globalStyles();

  return (
    <View style={[stylesGlobal.scrollBg,{flex:1}]}>
      <GestureHandlerRootView style={{ flex:1}}>
        <Carousel
          ref={ref}
          width={width}
          height={width * 0.8}
          data={serviceData?.images}
          renderItem={({ item }) => (
            <View style={{ position: 'relative' }}>
              <TouchableOpacity onPress={handleBackNavigation} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
                <Ionicons name="arrow-back" size={30} color="white" />
              </TouchableOpacity>
              <Image
                source={{ uri: item?.img_url }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            </View>
          )}
        />

        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          {serviceData?.images?.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onPressPagination(index)}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: index === activeIndex ? 'blue' : 'gray',
                marginHorizontal: 5,
              }}
            />
          ))}
        </View>

        <TouchableOpacity style={[styles.floatingButton, { backgroundColor: colors.secondary }]} onPress={handleFindProviders}>
          <Text style={styles.buttonText}>{t('screens:findProviders')}</Text>
        </TouchableOpacity>

        <BasicView style={{flexDirection:'row',justifyContent:'space-between'}}>
          <Text style={styles.categoryText}>{selectedLanguage == 'en' ? serviceData?.name?.en : serviceData?.name?.sw}</Text>
          <TouchableOpacity style={[stylesGlobal.chooseBtn,{backgroundColor:colors.darkGrey}]}
            onPress={() => handlePresentModalPress('Services')}
          >
            <Text style={{ color: colors.white }}>{t('navigate:viewServices')}</Text>
          </TouchableOpacity>
        </BasicView>
        <Divider />
        <BasicView>
          <Text style={styles.description}>{t('screens:description')}</Text>
          <Text style={styles.descriptionText}>{selectedLanguage == 'en' ? serviceData?.description?.en : serviceData?.description?.sw}</Text>
        </BasicView>


        <View style={{ flex:1,height:'100%', marginBottom:50 , marginTop:20 }}>
          <Text style={[stylesGlobal.serviceText, { justifyContent: 'center', alignSelf: 'center' }]}>{t('screens:sameCategoryService')}</Text>
          <FlatList
            data={similarServices}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderServiceItem}
            showsVerticalScrollIndicator={false}
            numColumns={2}

          />
        </View>
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={1}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView
                contentContainerStyle={styles.contentContainer}
              >
                <Text style={styles.title}>{t('screens:Services')}</Text>


                <View style={stylesGlobal.subCategory}>
                  <ContentServiceList
                    navigation={navigation}
                    subServices={subServiceByService}
                    providerSubServices={[]}
                    toggleSubService={{}}
                    selectedSubServices={[]}
                    screen="requested"
                  />
                </View>

              </BottomSheetScrollView>
            </BottomSheetModal>
          </View>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
}

const styles = StyleSheet.create({

  container:{
 //  flex:1,
  },
  contentContainer: {
    marginHorizontal: 10
},
title: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold'
},
  categoryText: {
    fontSize: 20,
    fontFamily: 'Prompt-SemiBold'
  },
  description: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 10
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'blue',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
    zIndex:1000
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});

export default ServiceDetails;
