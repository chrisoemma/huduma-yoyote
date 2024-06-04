import { View, Text, TouchableOpacity, Dimensions, StyleSheet,Image, ScrollView,Modal } from 'react-native'
import React, { useState } from 'react'
import { globalStyles } from '../../styles/global';
import { useSelector,RootStateOrAny } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectLanguage } from '../../costants/languageSlice';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BasicView } from '../../components/BasicView';
import { colors } from '../../utils/colors';
import VideoPlayer from '../../components/VideoPlayer';


const SubserviceDetails = ({ route }: any) => {

    const { providerSubService, type, sub_service } = route.params
    const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

  const stylesGlobal = globalStyles();

  const { isDarkMode } = useSelector((state: RootStateOrAny) => state.theme);
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const { t } = useTranslation();

  const selectedLanguage = useSelector(selectLanguage);

  const toggleVideoModal = () => {
    setVideoModalVisible(!isVideoModalVisible);
  };

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
  
  const itemType = type === "subService" ? "subService" : "providerSubService";

  const images = type == 'subService'? sub_service?.assets || sub_service?.default_images: providerSubService?.assets || providerSubService?.default_images;

  return (
    <ScrollView style={[stylesGlobal.scrollBg,{flex:1}]}>
      <Carousel
        ref={ref}
        width={width}
        height={width * 0.8}
        data={images }
        renderItem={({ item }) => (
          <View style={{ position: 'relative' }}>
            <TouchableOpacity onPress={handleBackNavigation} style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}>
              <Ionicons name="arrow-back" size={30} color="black" />
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
        {images?.map((_, index) => (
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

      <BasicView>
      {type == 'subService' ? (
            <>
              <View style={styles.textContainer}>
                <Text style={styles.subText}>{sub_service?.provider_sub_list?.name || selectedLanguage=='en'? sub_service?.name?.en:sub_service?.name?.sw}</Text>
                <Text style={[styles.desc, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>{sub_service?.provider_sub_list?.description || selectedLanguage=='en'? sub_service?.description?.en:sub_service?.description?.sw}</Text>
              </View>
              {sub_service?.assets && sub_service?.assets[0]?.video_url !== null || sub_service?.default_images && sub_service?.default_images[0]?.video_url !== null ? (
  <TouchableOpacity style={styles.viewVideo} onPress={toggleVideoModal}>
    <Text style={styles.videoText}>{t('screens:video')}</Text>
  </TouchableOpacity>
) : (<></>)}
            </>
          ) : (<></>)
          }

        
        {type == 'providerSubService' ? (
            <>
              <View style={styles.textContainer}>
                <Text style={styles.subText}>{providerSubService?.provider_sub_list?.name || providerSubService?.name}</Text>
                <Text style={[styles.desc, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>{providerSubService?.description}</Text>
              </View>
              {providerSubService?.assets && providerSubService?.assets[0].video_url !== null ? (
                <TouchableOpacity style={styles.viewVideo} onPress={toggleVideoModal}>
                  <Text style={styles.videoText}>{t('screens:video')}</Text>
                </TouchableOpacity>
              ) : (<></>)
              }
            </>
          ) : (<></>)
          }
      </BasicView>

    

<Modal visible={isVideoModalVisible}>
  <View style={styles.videoModalContainer}>
    <TouchableOpacity onPress={toggleVideoModal}>
      <Text style={styles.closeButton}>{t('screens:close')}</Text>
    </TouchableOpacity>
    {type === 'subService' && (sub_service?.assets && sub_service?.assets[0]?.video_url ||  sub_service?.default_images && sub_service?.default_images[0]?.video_url) ? (
      <VideoPlayer
        video_url={`${sub_service?.assets[0]?.video_url || sub_service?.default_images[0]?.video_url}`}
      />
    ) : null}
    {type === 'providerSubService' &&  sub_service?.default_images && sub_service?.default_images[0]?.video_url ? (
      <VideoPlayer
        video_url={`${providerSubService?.assets[0]?.video_url}`}
      />
    ) : null}
  </View>
</Modal>
      </ScrollView>
  )
}

const styles = StyleSheet.create({

  textContainer: {
    margin: 15
  },
  subText: {
    fontSize: 17,
    color: colors.secondary
  },
  desc: {
    fontSize: 15,
    marginVertical: 3
  },
  viewVideo: {
    margin: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    elevation: 2,
    borderRadius: 25
  },
  videoText: {
    padding: 15,
    fontSize: 18,
    color: colors.white
  },
  videoModalContainer: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',

  },
  closeButton: {
    fontSize: 18,
    marginBottom: 100,
    color: colors.primary,
    fontWeight: 'bold'
  },

});

export default SubserviceDetails