import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { View, Text, SafeAreaView, Image, TouchableOpacity, StyleSheet, Button } from 'react-native'
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
import { getProviderSubServices } from '../serviceproviders/ServiceProviderSlice';


const ServiceRequest = ({ navigation, route }: any) => {


    const { service, provider } = route.params;

    const { loading, providerSubServices } = useSelector(
        (state: RootStateOrAny) => state.providers,
    );

    const dispatch = useAppDispatch();


    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [sheetTitle, setSheetTitle] = useState('');


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


    const toggleSubService = (subService) => {
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

    return (
        <>
            <SafeAreaView
                style={{
                    flex: 1, margin: 10,
                    backgroundColor: colors.whiteBackground
                }}
            >
                {/* <View style={[globalStyles.circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>
                    {provider?.profile_img.startsWith("https://") ?
                        <Image
                            source={{ uri: provider?.profile_img }}
                            style={{
                                resizeMode: "cover",
                                width: 90,
                                height: 95,
                                borderRadius: 90,
                                alignSelf: 'center'
                            }}
                        />
                        : <Image
                            source={require('../../../assets/images/profile.png')}
                            style={{
                                resizeMode: "cover",
                                width: 90,
                                height: 95,
                                borderRadius: 90,
                                alignSelf: 'center'
                            }}
                        />}
                </View> */}
                {/* <View style={{ flexDirection: 'row' }}>
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
                </View> */}
                <Text>{service?.description}</Text>
                <View style={globalStyles.chooseServiceBtn}>
                    <TouchableOpacity style={globalStyles.chooseBtn}
                        onPress={() => handlePresentModalPress('Near providers')}
                    >
                        <Text style={{ color: colors.white }}>{t('screens:chooseService')}</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity style={globalStyles.otherBtn}>
                        <Text style={{ color: colors.white }}>{t('screens:otherService')}</Text>
                    </TouchableOpacity> */}
                </View>

                {/* <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.mapContainer}>
                     <MapDisplay />
                </View>
              </SafeAreaView> */}

                <SafeAreaView style={{ flex: 1 }}>
                    <GestureHandlerRootView style={{ flex: 1 }}>
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


                                        <View style={globalStyles.subCategory}>
                                            <ContentServiceList
                                                data={providerSubServices}
                                                toggleSubService={toggleSubService} 
                                                selectedSubServices={selectedSubservice}
                                                screen="new"
                                            />
                                        </View>
                                        <View style={{ flexDirection: 'row', }}>
                                            {selectedSubservice.length > 1 && (
                                                <TouchableOpacity
                                                    style={[globalStyles.floatingButton, { backgroundColor: colors.dangerRed, right: '70%', }]}
                                                    onPress={handleClearAll}
                                                >
                                                    <Text style={globalStyles.floatingBtnText}>{t('screens:clearAll')}</Text>
                                                </TouchableOpacity>
                                            )}
                                            <TouchableOpacity
                                                style={[globalStyles.floatingButton, { backgroundColor: selectedSubservice.length > 0 ? colors.secondary : colors.primary }]}
                                            >
                                                <Text style={globalStyles.floatingBtnText}>{`(${selectedSubservice.length}) ${t('screens:request')}`}</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </BottomSheetScrollView>
                                </BottomSheetModal>
                            </View>
                        </BottomSheetModalProvider>
                    </GestureHandlerRootView>
                </SafeAreaView>
            </SafeAreaView>


        </>
    )
}

const styles = StyleSheet.create({
    container: {
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