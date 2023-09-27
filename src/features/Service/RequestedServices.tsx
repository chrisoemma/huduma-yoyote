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
import { useSelector,RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getProviderSubServices } from '../serviceproviders/ServiceProviderSlice';


const RequestedServices = ({ navigation, route }: any) => {

  
    const { request } = route.params;

    const { loading, providerSubServices } = useSelector(
        (state: RootStateOrAny) => state.providers,
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(getProviderSubServices({ providerId: request?.provider.id, serviceId: request?.service.id }));
    }, [dispatch])

    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [sheetTitle, setSheetTitle] = useState('');


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


    return (
        <>
            <SafeAreaView
                style={{
                    flex: 1, height: '100%', margin: 10,
                    backgroundColor: colors.whiteBackground
                }}
            >
                <View style={[globalStyles.circle, { backgroundColor: colors.white, marginTop: 15, alignContent: 'center', justifyContent: 'center' }]}>
                {request?.provider?.profile_img.startsWith("https://") ?
                        <Image
                            source={{ uri: request?.provider?.profile_img }}
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
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                    <Text style={{ marginVertical: 5, color: colors.black }}>{request?.provider?.name}</Text>
                        <RatingStars rating={request?.provider.average_rating == null ? 0 : request?.provider.average_rating} />
                        <Text style={{ marginVertical: 5, color: colors.secondary }}>{request?.service?.name}</Text>
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
                            color={colors.black}
                            size={20}
                        />
                        <Text style={{ paddingHorizontal: 5, fontWeight: 'bold' }}>{PhoneNumber}</Text>
                    </TouchableOpacity>
                </View>
                <Text>{request?.service?.description}</Text>

                <View style={[globalStyles.chooseServiceBtn, { justifyContent: 'space-between' }]}>
                    <TouchableOpacity style={globalStyles.chooseBtn}
                        onPress={() => handlePresentModalPress('Near providers')}
                    >
                        <Text style={{ color: colors.white }}>{t('navigate:requestedServices')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={globalStyles.otherBtn}>
                        <Text style={{ color: colors.white }}>{request?.statuses[request?.statuses.length-1].status}</Text>
                    </TouchableOpacity>
                </View>

                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.mapContainer}>
                        <MapDisplay />
                    </View>
                </SafeAreaView>

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
                                                toggleSubService={{}} 
                                                selectedSubServices={selectedSubservice}
                                                screen="requested"
                                            />
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

export default RequestedServices