import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Button, ToastAndroid } from 'react-native'
import {globalStyles} from '../../styles/global'
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
import { getProviderSubServices } from '../serviceproviders/ServiceProviderSlice';
import { BasicView } from '../../components/BasicView';
import { createRequest } from '../requests/RequestSlice';


const ServiceRequest = ({ navigation, route }: any) => {


    const { service, provider } = route.params;

    const { providerSubServices } = useSelector(
        (state: RootStateOrAny) => state.providers,
    );

    const { loading, requests } = useSelector(
        (state: RootStateOrAny) => state.requests,
    );

    const { user } = useSelector(
        (state: RootStateOrAny) => state.user,
    );

    const dispatch = useAppDispatch();


    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [sheetTitle, setSheetTitle] = useState('');


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
    const { t } = useTranslation();

   // console.log('selected sub service', selectedSubservice);

    const toggleSubService = (subService) => {
        console.log('toungled_subservice', subService);
        if (selectedSubservice.includes(subService)) {
            setSelectedSubservice(selectedSubservice.filter((s) => s !== subService));
        } else {
            setSelectedSubservice([...selectedSubservice, subService]);
        }
    };

    const handleClearAll = () => {
        setSelectedSubservice([]);
    };

    const PhoneNumber = `${provider?.phone}`;


    //   React.useLayoutEffect(() => {
    //       if (params && params.service) {
    //           navigation.setOptions({ title: params.service.name });
    //       }
    //   }, [navigation, params]);

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
        data.sub_service = selectedSubservice;
        data.client_latitude = userLocation.latitude
        data.client_longitude = userLocation.longitude
        data.provider_latitude = providerLocation.latitude
        data.provider_longitude = providerLocation.longitude


        console.log('request data', data)

        dispatch(createRequest({ data: data }))
            .unwrap()
            .then(result => {
                if (result.status) {

                    ToastAndroid.show(`${t('screens:requestSentSuccessfully')}`, ToastAndroid.SHORT);
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


    return (
        <>
            <SafeAreaView
                style={globalStyles().scrollBg}
            >
                <GestureHandlerRootView style={{ flex: 1, margin: 10 }}>
                    <View>
                        <BasicView style={globalStyles().centerView}>
                            <Text style={globalStyles().errorMessage}>{message}</Text>
                        </BasicView>
                        <View style={[globalStyles().circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>


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
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <View>
                                <Text style={{ marginVertical: 5, color: colors.black }}>{provider?.name}</Text>
                                <RatingStars rating={provider.average_rating == null ? 0 : provider.average_rating} />
                                <Text style={{ marginVertical: 5, color: colors.secondary }}>{service?.name}</Text>
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
                                <Text style={{ paddingHorizontal: 5, fontWeight: 'bold' }}>{PhoneNumber}</Text>
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text>{service?.description}</Text>
                            <View style={globalStyles().chooseServiceBtn}>
                                <TouchableOpacity style={globalStyles().chooseBtn}
                                    onPress={() => handlePresentModalPress('Near providers')}
                                >
                                    <Text style={{ color: colors.white }}>{t('screens:chooseService')}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={globalStyles().otherBtn}>
                                    <Text style={{ color: colors.white }}>{t('screens:otherService')}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View style={styles.mapContainer}>
                            <MapDisplay
                                onLocationUpdate={handleLocationUpdate}

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


                                    <View style={globalStyles().subCategory}>
                                        <ContentServiceList
                                            data={providerSubServices}
                                            toggleSubService={toggleSubService}
                                            selectedSubServices={selectedSubservice}
                                            screen="new"
                                        />
                                    </View>

                                </BottomSheetScrollView>
                                <View style={{ flexDirection: 'row', }}>
                                    {selectedSubservice.length > 1 && (
                                        <TouchableOpacity
                                            style={[globalStyles().floatingButton, { backgroundColor: colors.dangerRed, right: '70%', }]}
                                            onPress={handleClearAll}
                                        >
                                            <Text style={globalStyles().floatingBtnText}>{t('screens:clearAll')}</Text>
                                        </TouchableOpacity>
                                    )}

                                </View>

                                <TouchableOpacity
                                    style={[globalStyles().floatingButton, { backgroundColor: selectedSubservice.length > 0 ? colors.secondary : colors.primary }]}
                                    loading={loading}
                                    onPress={() => {
                                        if (selectedSubservice.length > 0) {
                                            sendRequest();
                                        } else {
                                            ToastAndroid.show(`${t('screens:pleaseAddService')}`, ToastAndroid.SHORT);
                                        }
                                    }}

                                >
                                    <Text style={globalStyles().floatingBtnText}>{`(${selectedSubservice.length}) ${t('screens:request')}`}</Text>
                                </TouchableOpacity>

                            </BottomSheetModal>

                        </View>

                    </BottomSheetModalProvider>

                </GestureHandlerRootView>
            </SafeAreaView>


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

export default ServiceRequest