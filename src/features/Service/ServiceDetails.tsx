import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Text, View, Image, TouchableOpacity, StyleSheet, Animated, FlatList, ActivityIndicator } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
import CustomBackground from '../../components/CustomBgBottomSheet';

const width = Dimensions.get("window").width;

const ServiceDetails = ({ route }) => {
  const selectedLanguage = useSelector(selectLanguage);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { service: serviceData, similarServices, subServiceByService, loading } = useSelector(
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
  }, [service, requestFrom, source]);

  useEffect(() => {
    if (serviceId) {
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
          animateUpDown();
        }}
      >
        <Animated.View style={[styles.handleIcon, { transform: [{ translateY }] }]}>
          <Ionicons name="chevron-down-circle" size={30} color={isDarkMode ? colors.white : colors.white} />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {!loading && (
        <Carousel
          ref={ref}
          width={width}
          height={width * 0.8}
          data={serviceData?.images}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <TouchableOpacity onPress={handleBackNavigation} style={styles.backButton}>
                <Ionicons name="arrow-back" size={30} color={colors.white} />
              </TouchableOpacity>
              <Image
                source={{ uri: item?.img_url }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            </View>
          )}
        />
      )}

      <View style={styles.paginationContainer}>
        {serviceData?.images?.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onPressPagination(index)}
            style={[
              styles.paginationDot,
              { backgroundColor: index === activeIndex ? colors.primary : colors.grey },
            ]}
          />
        ))}
      </View>

      <BasicView style={styles.buttonContainer}>
        <TouchableOpacity style={[stylesGlobal.chooseBtn, { backgroundColor: isDarkMode ? colors.white : colors.darkGrey }]}
          onPress={() => handlePresentModalPress('Services')}
        >
          <Text style={{ color: isDarkMode ? colors.blue : colors.white, fontFamily: 'Prompt-SemiBold' }}>
            {t('navigate:viewServices')}
          </Text>
        </TouchableOpacity>
      </BasicView>

      <View style={styles.titleContainer}>
        <Text style={[styles.categoryText, { color: isDarkMode ? colors.white : colors.black }]}>
          {selectedLanguage === 'en' ? serviceData?.name?.en : serviceData?.name?.sw}
        </Text>
      </View>

      <View style={styles.descriptionContainer}>
        <BasicView>
          <Text style={[styles.description, { color: isDarkMode ? colors.white : colors.black }]}>
            {t('screens:description')}
          </Text>
          <Text style={[styles.descriptionText, { color: isDarkMode ? colors.white : colors.black }]}>
            {selectedLanguage === 'en' ? serviceData?.description?.en : serviceData?.description?.sw}
          </Text>
        </BasicView>
      </View>

      <Divider />
      <Text style={[stylesGlobal.serviceText, { justifyContent: 'center', alignSelf: 'center', marginBottom: 10 }]}>
        {t('screens:sameCategoryService')}
      </Text>
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
          contentContainerStyle={styles.flatListContent}
          ListEmptyComponent={() => (
            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
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
              backgroundComponent={CustomBackground}
              index={0}
              snapPoints={snapPoints}
              onChange={handleSheetChanges}
            >
              <BottomSheetScrollView
                contentContainerStyle={styles.contentContainer}
              >
                <HandleComponent onPress={() => bottomSheetModalRef.current?.dismiss()} />
                <Text style={[styles.title,{color:isDarkMode?colors.white:colors.black}]}>{t('screens:Services')}</Text>

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
    // Additional styling if needed
  },
  contentContainer: {
    marginHorizontal: 10,
  },
  title: {
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'Prompt-SemiBold'
  },
  categoryText: {
    fontSize: 20,
    fontFamily: 'Prompt-SemiBold'
  },
  description: {
    fontSize: 15,
    marginTop: 10,
    fontFamily: 'Prompt-Bold'
  },
  descriptionText: {
    fontSize: 13,
    fontFamily: 'Prompt-Regular',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 5,
    zIndex: 1000
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontFamily: 'Prompt-Regular'
  },
  handleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 10,
    zIndex: 1,
  },
  handleIcon: {
    backgroundColor: colors.secondary,
    borderRadius: 30,
    padding: 5,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselItem: {
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginTop: 15,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  descriptionContainer: {
    marginVertical: 20,
  },
  flatListContent: {
    paddingBottom: 50,
  },
});

export default ServiceDetails;
