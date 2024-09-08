import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Modal, ToastAndroid, TouchableWithoutFeedback, ActivityIndicator } from 'react-native'
import { globalStyles } from '../../styles/global'
import { colors } from '../../utils/colors'
import RatingStars from '../../components/RatinsStars';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    BottomSheetModal,
    BottomSheetModalProvider,
    BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useTranslation } from 'react-i18next';
import ContentServiceList from '../../components/ContentServiceList';
import MapDisplay from '../../components/MapDisplay';
import Icon from 'react-native-vector-icons/AntDesign';
import IconBusiness from 'react-native-vector-icons/Ionicons';
import { makePhoneCall } from '../../utils/utilts';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getProviderLastLocation, getProviderSubServices } from '../serviceproviders/ServiceProviderSlice';
import { BasicView } from '../../components/BasicView';
import { createRequest } from '../requests/RequestSlice';
import { selectLanguage } from '../../costants/languageSlice';
// import IconOnline from 'react-native-vector-icons/Ionicons';
import PusherOnlineListener from '../../components/PusherOnlineListener';
import showToast from '../../components/ShowToast/showToast';
import CustomBackground from '../../components/CustomBgBottomSheet'


const ServiceRequest = ({ navigation, route }: any) => {


    const { service, provider } = route.params;
   // console.log('service1234',service.id)

    const { subServices, providerSubServices } = useSelector(
        (state: RootStateOrAny) => state.providers,
    );

    // console.log('subservice',subServices)
    // console.log('providerSubServices',providerSubServices)

    const { loading,createRequestLoading } = useSelector(
        (state: RootStateOrAny) => state.requests,
    );

    const { user, isOnline } = useSelector(
        (state: RootStateOrAny) => state.user,
    );

    const dispatch = useAppDispatch();

    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
    );

    const { providerLastLocation } = useSelector(
        (state: RootStateOrAny) => state.providers,
    );

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [sheetTitle, setSheetTitle] = useState('');

    const selectedLanguage = useSelector(selectLanguage);

    useEffect(() => {
        dispatch(getProviderLastLocation(provider?.provider_id));
    }, [])

    const [userLocation, setUserLocation] = useState(null);
    const [providerLocation, setProviderLocation] = useState(null);
    const handleLocationUpdate = useCallback((userLocation, providerLocation) => {

        setUserLocation(userLocation);
        setProviderLocation(providerLocation);
    }, []);

    //console.log('user location', userLocation)
    //console.log('provider location', providerLocation);

    // variables
    const snapPoints = useMemo(() => ['20%', '100%'], []);


  //  console.log('provider last location',providerLastLocation);

    // callbacks
    const handlePresentModalPress = useCallback((title: any) => {
        setSheetTitle(title);
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, [])


    useEffect(() => {
        dispatch(getProviderSubServices({ providerId: provider.provider_id, serviceId: service.id }));
    }, [dispatch])


    const [selectedSubservice, setSelectedSubservice] = useState([]);
    const [selectedProviderSubService, setSelectedProviderSubService] = useState([]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };
    const { t } = useTranslation();

    const toggleSubService = (type, subService) => {
        console.log('toungled_subservice', subService);
        if (type == 'subService') {
            if (selectedSubservice.includes(subService)) {
                setSelectedSubservice(selectedSubservice.filter((s) => s !== subService));
            } else {
                setSelectedSubservice([...selectedSubservice, subService]);
            }
        } else {
            if (selectedProviderSubService.includes(subService)) {
                setSelectedProviderSubService(selectedProviderSubService.filter((s) => s !== subService));
            } else {
                setSelectedProviderSubService([...selectedProviderSubService, subService]);
            }
        }
    };



    const handleClearAll = () => {
        setSelectedSubservice([]);
        setSelectedProviderSubService([])
    };

    const PhoneNumber = `${provider?.phone}`;


    //   React.useLayoutEffect(() => {
    //       if (route?.params && route?.params.service) {
    //           navigation.setOptions({ title: route?.params.service.name });
    //       }
    //   }, [navigation, route?.params]);

    const [message, setMessage] = useState("")
    const setDisappearMessage = (message: any) => {
        setMessage(message);

        setTimeout(() => {
            setMessage('');
        }, 5000);
    };

    const data = {
        service_id: '',
        client_id: '',
        provider_id: '',
        request_time: '',
        sub_service: [],
        client_latitude: 0,
        client_longitude: 0,
        provider_latitude: 0,
        provider_longitude: 0,
    };

    const sendRequest = async () => {

        data.service_id = service?.id;
        data.client_id = user?.client?.id;
        data.provider_id = provider?.provider_id;
        data.request_time = new Date().toISOString();
        data.sub_service = selectedSubservice
        data.provider_sub_service = selectedProviderSubService
        data.client_latitude = userLocation?.latitude
        data.client_longitude = userLocation?.longitude
        data.provider_latitude = providerLocation?.latitude
        data.provider_longitude = providerLocation?.longitude

        dispatch(createRequest({ data: data }))
            .unwrap()
            .then(result => {
                if (result.status) {
                    setSelectedSubservice([]);
                    setSelectedProviderSubService([])
                    
                    showToast(`${t('screens:requestSentSuccessfully')}`,'success','long')
                    navigation.navigate('Requests', {
                        screen: 'Requests',
                    });
                } else {

                    showToast(`${t('screens:requestFail')}`,'danger','long')
                
                    console.log('dont navigate');
                }
            })
            .catch(rejectedValueOrSerializedError => {
                // handle error here
                console.log('error');
                console.log(rejectedValueOrSerializedError);
            });

    }

    const stylesGlobal = globalStyles();

    return (
        <>
            <PusherOnlineListener remoteUserId={provider.user_id} />
            <SafeAreaView
                style={stylesGlobal.scrollBg}
            >
                <GestureHandlerRootView style={{ flex: 1, margin: 10 }}>
                    <View>
                        <BasicView style={stylesGlobal.centerView}>
                            <Text style={stylesGlobal.errorMessage}>{message}</Text>
                        </BasicView>
                        <TouchableWithoutFeedback onPress={toggleModal} style={[stylesGlobal.circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>


                            <Image
                                source={
                                    provider?.profile_img?.startsWith('https://')
                                        ? { uri: provider.profile_img }
                                        : provider?.user_img?.startsWith('https://')
                                            ? { uri: provider.user_img }
                                            : require('../../../assets/images/profile.png') // Default static image
                                }
                                style={{
                                    resizeMode: 'cover',
                                    width: provider?.user_img?.startsWith('https://') ? 90 : 90,
                                    height: provider?.user_img?.startsWith('https://') ? 95 : 95,
                                    borderRadius: provider?.user_img?.startsWith('https://') ? 90 : 90,
                                    alignSelf: 'center',
                                }}
                            />
                        </TouchableWithoutFeedback >
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Text style={{ marginVertical: 5, color: isDarkMode ? colors.white : colors.black, fontFamily: 'Prompt-Regular', }}>{provider?.business_name ? provider.business_name : provider?.name}</Text>
                                <RatingStars rating={provider?.average_rating == null ? 0 : provider?.average_rating} />
                                <Text style={{ marginVertical: 5, color: isDarkMode ? colors.white : colors.secondary, fontFamily: 'Prompt-Regular', }}>
                                <IconBusiness name="business" size={20} color={isDarkMode ? colors.white : colors.darkGrey} />
                                {' '}
                                    {selectedLanguage ? service?.name?.en : service?.name?.sw}</Text>
                            </View>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                marginHorizontal: 30,
                                marginVertical: 20,
                                alignItems: 'flex-end'
                            }}
                                onPress={() => makePhoneCall(PhoneNumber)}
                            >
                                <Icon
                                    name="phone"
                                    color={colors.successGreen}
                                    size={20}
                                />
                                <Text style={{ paddingHorizontal: 5,fontFamily: 'Prompt-Regular', color: isDarkMode ? colors.white : colors.blue }}>{PhoneNumber}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            {/* <View style={styles.divOnline}>
                                <IconOnline name={isOnline ? 'checkmark-circle' : 'close-circle'} size={24} color={isOnline ? 'green' : colors.darkGrey} />
                                <Text style={styles.text}>{isOnline ? 'Online' : 'Offline'}</Text>
                            </View> */}
                            {/* <Text style={{marginBottom:15}}>{selectedLanguage=='en'? service?.description?.en:service?.description?.sw}</Text> */}

                            <View style={stylesGlobal.chooseServiceBtn}>
                                <TouchableOpacity style={[stylesGlobal.chooseBtn, { marginBottom: 50 }]}
                                    onPress={() => handlePresentModalPress('Near providers')}
                                >
                                    <Text style={{ color: colors.white,fontFamily: 'Prompt-Regular' }}>{t('screens:chooseService')}</Text>
                             </TouchableOpacity>
                                {/* <TouchableOpacity style={stylesGlobal.otherBtn}>
                                    <Text style={{ color: colors.white }}>{t('screens:otherService')}</Text>
                                </TouchableOpacity> */}

                            </View>
                        </View>
                    </View>

                    <View>
                        <View style={styles.mapContainer}>
                            <MapDisplay
                                onLocationUpdate={handleLocationUpdate}
                                providerLastLocation={providerLastLocation}
                                provider={provider}
                                requestStatus="New"
                                requestLastLocation={{}}
                            />
                        </View>
                    </View>

                    <BottomSheetModalProvider>
                        <View style={styles.container}>
                            <BottomSheetModal
                                ref={bottomSheetModalRef}
                                index={1}
                                backgroundComponent={CustomBackground}
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
                                            subServices={subServices}
                                            providerSubServices={providerSubServices}
                                            toggleSubService={toggleSubService}
                                            selectedSubServices={selectedSubservice}
                                            selectedProviderSubServices={selectedProviderSubService}
                                            screen="new"
                                        />
                                    </View>

                                </BottomSheetScrollView>
                                <View style={{ flexDirection: 'row', }}>
                                    {selectedSubservice.length > 1 || selectedProviderSubService > 1 && (
                                        <TouchableOpacity
                                            style={[stylesGlobal.floatingButton, { backgroundColor: colors.dangerRed, right: '70%', }]}
                                            onPress={handleClearAll}
                                            disabled={loading}
                                        >
                                            <Text style={stylesGlobal.floatingBtnText}>{t('screens:clearAll')}</Text>
                                        </TouchableOpacity>
                                    )}

                                </View>

                                <TouchableOpacity
            style={[stylesGlobal.floatingButton, { backgroundColor: selectedSubservice.length > 0 ? colors.secondary : colors.primary }]}
            disabled={createRequestLoading} // Disable button when loading
            onPress={() => {
                if (selectedSubservice.length > 0 || selectedProviderSubService.length > 0) {
                    sendRequest();
                } else {
                      showToast(`${t('screens:pleaseAddService')}`,'warning','long')
                }
            }}
        >
            {createRequestLoading ? (
                 <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                 <ActivityIndicator size="small" color={colors.white} />
                 <Text style={[stylesGlobal.floatingBtnText, { marginLeft: 5 }]}>
                    {t('screens:loading')}
                 </Text>
             </View>
            ) : (
                <Text style={stylesGlobal.floatingBtnText}>
                    {`(${selectedSubservice.length + selectedProviderSubService.length}) ${t('screens:request')}`}
                </Text>
            )}
        </TouchableOpacity>

                            </BottomSheetModal>

                        </View>

                    </BottomSheetModalProvider>

                </GestureHandlerRootView>
            </SafeAreaView>


            <Modal visible={isModalVisible} transparent={true} onRequestClose={toggleModal}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableWithoutFeedback onPress={toggleModal}>
                        <Image
                            source={
                                provider?.profile_img?.startsWith('https://')
                                    ? { uri: provider.profile_img }
                                    : provider?.user_img?.startsWith('https://')
                                        ? { uri: provider.user_img }
                                        : require('../../../assets/images/profile.png') // Default static image
                            }
                            style={{
                                resizeMode: 'contain',
                                width: '80%',
                                height: '80%',
                                //  borderRadius:200,
                                overflow: 'hidden', // Ensure that the borderRadius is applied correctly
                            }}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </Modal>

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // height:300,
        // margin: 10
    },
    contentContainer: {
        // flex:1,
        marginHorizontal: 10
    },
    divOnline: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginLeft: 5,
        fontSize: 16,
    },
    title: {
        fontFamily: 'Prompt-Bold',
        alignSelf: 'center',
        fontSize: 15,
 
    },
    mapContainer: {
        flex: 1,
        marginBottom: '10%',
    },
})

export default ServiceRequest