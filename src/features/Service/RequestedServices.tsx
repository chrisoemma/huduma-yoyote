import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Button, ToastAndroid } from 'react-native'
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
import { makePhoneCall } from '../../utils/utilts';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getProviderLastLocation, getProviderSubServices } from '../serviceproviders/ServiceProviderSlice';
import { getRequestLastLocation, rateRequest, updateRequestStatus } from '../requests/RequestSlice';
import { BasicView } from '../../components/BasicView';
import { getStatusBackgroundColor } from '../../utils/utilts'
import RatingModal from '../../components/RatingModal';
import { selectLanguage } from '../../costants/languageSlice';


const RequestedServices = ({ navigation, route }: any) => {


    const { request } = route.params;

    const { user } = useSelector(
        (state: RootStateOrAny) => state.user,
    );


    const selectedLanguage = useSelector(selectLanguage);

    const { requestLastLocation } = useSelector(
        (state: RootStateOrAny) => state.requests,
    );

    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
    );

    const { providerSubServices, subServices } = useSelector(
        (state: RootStateOrAny) => state.providers,
    );

    const { providerLastLocation } = useSelector(
        (state: RootStateOrAny) => state.providers,
      );

    const [userLocation, setUserLocation] = useState(null);
    const [providerLocation, setProviderLocation] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const handleLocationUpdate = useCallback((userLocation, providerLocation) => {
        setUserLocation(userLocation);
        setProviderLocation(providerLocation);
    }, []);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getProviderSubServices({ providerId: request?.provider?.id, serviceId: request?.service?.id }));
    }, [dispatch])

  
    useEffect(() => {
        dispatch(getProviderLastLocation(request?.provider?.id));
     }, [])

     useEffect(() => {
        dispatch(getRequestLastLocation(request?.id));
     }, [])

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [sheetTitle, setSheetTitle] = useState('');

    let requestData = {
        comment: '',
        rating: '',
        client_latitude:'',
        client_longitude:'',
        provider_latitude:'',
        provider_longitude:'',
        requestId:''

    }
    const postReview = ({ comment, rating }: any) => {
        requestData.comment = comment
        requestData.rating = rating
        requestData.requestId = request?.id
        requestData.client_latitude=userLocation?.latitude
        requestData.client_longitude=userLocation?.longitude
        requestData.provider_latitude=providerLocation?.latitude
        requestData.provider_longitude=providerLocation?.longitude
        toggleModal();
        dispatch(rateRequest(requestData))
            .unwrap()
            .then(result => {

                if (result.status) {
                    ToastAndroid.show(`${t('screens:rateSubmitted')}`, ToastAndroid.SHORT);
                    navigation.navigate('Requests', {
                        screen: 'Requests',
                    });
                } else {
                    console.log('dont do anything');
                }
            })
            .catch(rejectedValueOrSerializedError => {
                // handle error here
                console.log('error');
                console.log(rejectedValueOrSerializedError);
            });
    };


    const getStatusTranslation = (status: string) => {
        return t(`screens:${status}`);
    };

    // variables
    const snapPoints = useMemo(() => ['25%', '100%'], []);

    // callbacks
    const handlePresentModalPress = useCallback((title: any) => {
        setSheetTitle(title);
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        //console.log('handleSheetChanges', index);
    }, [])


    const [selectedSubservice, setSelectedSubservice] = useState([]);

    const PhoneNumber = `${request?.provider?.phone}`;


    React.useLayoutEffect(() => {
        if (request && request.service) {
            navigation.setOptions({ title: request.service.name });
        }
    }, [navigation, request]);

    const { t } = useTranslation();

    const request_status = request?.statuses[request?.statuses?.length - 1].status;

    const [message, setMessage] = useState("")
    const setDisappearMessage = (message: any) => {
        setMessage(message);

        setTimeout(() => {
            setMessage('');
        }, 5000);
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const data = {
        status: '',
        client: '',
        client_latitude:'',
        client_longitude:'',
        provider_latitude:'',
        provider_longitude:''
    }

    const updateRequest = (id, requestType) => {
        data.client = user?.client?.id;
        data.status = requestType;
        data.client_latitude=userLocation?.latitude
        data.client_longitude=userLocation?.longitude
        data.provider_latitude=providerLocation?.latitude
        data.provider_longitude=providerLocation?.longitude


        dispatch(updateRequestStatus({ data: data, requestId: id }))
            .unwrap()
            .then(result => {
                if (result.status) {

                    ToastAndroid.show(`${t('screens:requestUpdatedSuccessfully')}`, ToastAndroid.SHORT);
                    navigation.navigate('Requests', {
                        screen: 'Requests',
                    });
                } else {
                    setDisappearMessage(
                        `${t('screens:requestFail')}`,
                    );
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
            <SafeAreaView
                style={stylesGlobal.scrollBg}
            >

                <GestureHandlerRootView style={{ flex: 1, margin: 10 }}>
                    <BasicView style={stylesGlobal.centerView}>
                        <Text style={stylesGlobal.errorMessage}>{message}</Text>
                    </BasicView>
                    <View>
                        <View style={[stylesGlobal.circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>


                            <Image
                                source={
                                    request?.provider?.profile_img?.startsWith('https://')
                                        ? { uri: request?.provider.profile_img }
                                        : request?.provider?.user_img?.startsWith('https://')
                                            ? { uri: request?.provider.user_img }
                                            : require('../../../assets/images/profile.png') // Default static image
                                }
                                style={{
                                    resizeMode: 'cover',
                                    width: request?.provider?.user_img?.startsWith('https://') ? 90 : 90,
                                    height: request?.provider?.user_img?.startsWith('https://') ? 95 : 95,
                                    borderRadius: request?.provider?.user_img?.startsWith('https://') ? 90 : 90,
                                    alignSelf: 'center',
                                }}
                            />
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Text style={{ marginVertical: 5, color: colors.black }}>{request?.provider?.name}</Text>
                                <RatingStars rating={request?.provider?.average_rating == null ? 0 : request?.provider?.average_rating} />
                                <Text style={{ marginVertical: 5, color: colors.secondary }}>{ selectedLanguage=='en'? request?.service?.name?.en :request?.service?.name?.sw}</Text>
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
                                    color={isDarkMode ? colors.white : colors.black}
                                    size={20}
                                />
                                <Text style={{
                                    paddingHorizontal: 5, fontWeight: 'bold',
                                    color: isDarkMode ? colors.white : colors.black
                                }}>{PhoneNumber}</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={{
                            color: isDarkMode ? colors.white : colors.black
                        }}>{selectedLanguage=='en'? request?.service?.description?.en :request?.service?.description?.sw}</Text>

                        <View style={[stylesGlobal.chooseServiceBtn, { justifyContent: 'space-between',marginBottom:50 }]}>
                            

                            <TouchableOpacity style={[stylesGlobal.otherBtn, { backgroundColor: getStatusBackgroundColor(request_status) }]}>
                                <Text style={{ color: colors.white }}>{getStatusTranslation(request_status)}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={stylesGlobal.chooseBtn}
                                onPress={() => handlePresentModalPress('Near providers')}
                            >
                                <Text style={{ color: colors.white }}>{t('navigate:requestedServices')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View>
                        <View style={styles.mapContainer}>
                            <MapDisplay
                                onLocationUpdate={handleLocationUpdate}
                                providerLastLocation={providerLastLocation}
                                provider={request?.provider}
                                requestStatus={request_status}
                                requestLastLocation={requestLastLocation}
                            />
                        </View>
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
                                            subServices={subServices}
                                            providerSubServices={providerSubServices}
                                            toggleSubService={{}}
                                            selectedSubServices={selectedSubservice}
                                            screen="requested"

                                        />
                                    </View>

                                </BottomSheetScrollView>
                            </BottomSheetModal>
                        </View>
                    </BottomSheetModalProvider>
                    <View style={{
                        backgroundColor: isDarkMode ? colors.black : colors.whiteBackground, height: 100,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 20

                    }}>

                        {request_status == 'Accepted' ? (
                            <TouchableOpacity
                                onPress={() => updateRequest(request?.id, 'Comfirmed')}
                                style={{
                                    backgroundColor: colors.successGreen, borderRadius: 20,
                                    justifyContent: 'center',
                                    padding: 20
                                }}>
                                <Text style={{ color: colors.white }}>{t('screens:comfirm')}</Text>
                            </TouchableOpacity>

                        ) : <></>}

                        {request_status == 'Requested' || request_status == 'Accepted' ? (
                            <TouchableOpacity
                                onPress={() => updateRequest(request?.id, 'Cancelled')}
                                style={{
                                    backgroundColor: colors.dangerRed, borderRadius: 20,
                                    justifyContent: 'center',
                                    padding: 20
                                }}>
                                <Text style={{ color: colors.white }}>{t('screens:cancel')}</Text>
                            </TouchableOpacity>
                        ) : <></>}


                        {request_status == 'Comfirmed' || (request_status == 'Completed' && !request?.rating) ? (
                            //Rating should be taken while is completed 
                            <TouchableOpacity
                                onPress={() => toggleModal()}
                                style={{
                                    backgroundColor: colors.successGreen, borderRadius: 20,
                                    justifyContent: 'center',
                                    padding: 20
                                }}>
                                <Text style={{ color: colors.white }}>{t('screens:rateService')}</Text>
                            </TouchableOpacity>

                        ) : <></>}
                    </View>
                </GestureHandlerRootView>
            </SafeAreaView>

            <RatingModal
                cancel={toggleModal}
                confirm={postReview}
                visible={isModalVisible}
            />


        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        marginHorizontal: 10
    },
    title: {
        alignSelf: 'center',
        fontSize: 15,
        fontWeight: 'bold'
    },
    mapContainer: {
        flex: 1,
        marginBottom: '10%',
    },
})

export default RequestedServices