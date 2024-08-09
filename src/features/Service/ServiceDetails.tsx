import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Text, View, Image, TouchableOpacity, StyleSheet, Animated,FlatList, ActivityIndicator } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
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
import { clearSimilarServices, clearSingleService, clearSubserviceByService, getSimilarService, getSingleService, getSubserviceByService } from "./ServiceSlice";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import ContentServiceList from '../../components/ContentServiceList';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const width = Dimensions.get("window").width;

const ServiceDetails = ({ route }) => {
  const selectedLanguage = useSelector(selectLanguage);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { service: serviceData, similarServices, subServiceByService,loading } = useSelector(
    (state) => state.services,
  );

  const { service, source, requestFrom } = route.params;

  const serviceId = useMemo(() => {
    
    if (requestFrom == 'normal') {
      if (source) {
        if (source == 'search') {
          return service?.name?.id ?? '';
        } else {
          return service?.name?.service_id ?? '';
        }
      } else {
        return service?.id ?? '';
      }
    } else {
      return service?.id ?? '';
    }

  }, [service, requestFrom,source]);


  console.log(loading);  
  console.log(serviceId);

  useEffect(() => {
  
    if(serviceId) {
    dispatch(getSingleService(serviceId));
    dispatch(getSimilarService(serviceId));
    dispatch(getSubserviceByService(serviceId));
  }

    return () => {
     
      dispatch(clearSingleService());
      dispatch(clearSimilarServices());
      dispatch(clearSubserviceByService());
    };
  }, [dispatch, serviceId]);

  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue(0);
  const navigation = useNavigation();

  const [activeIndex, setActiveIndex] = useState(0);

  const onPressPagination = (index) => {
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

  const handleServicePress = (servicePress) => {
    navigation.navigate('Service Details', {
      service: servicePress,
    });
  };


  const renderServiceItem = ({ item }) => (
    <TopService key={item.id} service={item} onPress={() => handleServicePress(item)} />
  );

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [sheetTitle, setSheetTitle] = useState('');

  const snapPoints = useMemo(() => ['43%', '85%'], []);



  const handlePresentModalPress = useCallback((title) => {
    setSheetTitle(title);
    bottomSheetModalRef.current?.present();
  }, []);

  useEffect(() => {
    bottomSheetModalRef.current?.present(); 
  }, []);

  const handleSheetChanges = useCallback((index) => {}, []);

  const stylesGlobal = globalStyles();
  const { isDarkMode } = useSelector((state) => state.theme);


  const HandleComponent = ({ onPress }) => {
  
    const translateY = new Animated.Value(0);
  
    const animateUpDown = () => {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: -10, 
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0, // Original position
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    };
  
    return (
      <TouchableOpacity
        style={styles.handleContainer}
        onPress={() => {
          onPress();
          animateUpDown(); // Trigger animation on press
        }}
      >
        <Animated.View style={[styles.handleIcon, { transform: [{ translateY }] }]}>
          <Ionicons name="chevron-down-circle" size={30} color="white" />
        </Animated.View>
      </TouchableOpacity>
    );
  };


  const renderHeader = () => (
    <>

{loading && (
        <View style={{ ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}

      {!loading && (
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
      )}

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

      <BasicView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <View />
        <TouchableOpacity style={[stylesGlobal.chooseBtn, { backgroundColor: isDarkMode ? colors.white : colors.darkGrey }]}
          onPress={() => handlePresentModalPress('Services')}
        >
          <Text style={{ color: isDarkMode ? colors.blue : colors.white, fontWeight: 'bold' }}>{t('navigate:viewServices')}</Text>
        </TouchableOpacity>
      </BasicView>

      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
        <Text style={[styles.categoryText, { color: isDarkMode ? colors.white : colors.black, fontSize: 20, fontWeight: 'bold' }]}>
          {selectedLanguage == 'en' ? serviceData?.name?.en : serviceData?.name?.sw}
        </Text>
      </View>

      <View style={{ marginVertical: 20 }}>
        <BasicView>
          <Text style={[styles.description, { color: isDarkMode ? colors.white : colors.black }]}>{t('screens:description')}</Text>
          <Text style={[styles.descriptionText, { color: isDarkMode ? colors.white : colors.black }]}>
            {selectedLanguage == 'en' ? serviceData?.description?.en : serviceData?.description?.sw}
          </Text>
        </BasicView>
      </View>
     
      <Divider />
      <Text style={[stylesGlobal.serviceText, { justifyContent: 'center', alignSelf: 'center',marginBottom:10 }]}>{t('screens:sameCategoryService')}</Text>
    </>
  );

  return (
    <View style={[stylesGlobal.scrollBg, { flex: 1 }]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        
    <FlatList
  data={similarServices}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderServiceItem}
  ListHeaderComponent={renderHeader}
  showsVerticalScrollIndicator={false}
  numColumns={2}
  contentContainerStyle={{ paddingBottom: 50 }}
  ListEmptyComponent={() => (
    loading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    ) : null
  )}
/>
        
<TouchableOpacity style={[styles.floatingButton, { backgroundColor: colors.secondary }]} onPress={handleFindProviders}>
        <Text style={styles.buttonText}>{t('screens:findProviders')}</Text>
      </TouchableOpacity>
        <BottomSheetModalProvider>
          <View style={styles.container}>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView
                contentContainerStyle={styles.contentContainer}
              >
                <HandleComponent onPress={() => bottomSheetModalRef.current?.dismiss()} />
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
  container: {
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
    zIndex: 1000
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top:0,
    right: 10,
    zIndex: 1,
  },
  handleIcon: {
    backgroundColor:colors.secondary, 
    borderRadius: 30,
    padding: 5,
  },
});

export default ServiceDetails;
