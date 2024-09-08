import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react';
import { globalStyles } from '../../styles/global';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../utils/colors';
import { useSelector, RootStateOrAny } from 'react-redux';
import VideoPlayer from '../../components/VideoPlayer';
import { useTranslation } from 'react-i18next';
import { selectLanguage } from '../../costants/languageSlice';
// import { selectLanguage } from '../../costants/languangeSlice';

const SubserviceDetails = ({ route, navigation }: any) => {
  const { providerSubService, type, sub_service } = route.params;


  const stylesGlobal = globalStyles();
  const { isDarkMode } = useSelector((state: RootStateOrAny) => state.theme);
  const [isVideoModalVisible, setVideoModalVisible] = useState(false);
  const { t } = useTranslation();
  const selectedLanguage = useSelector(selectLanguage);

  const toggleVideoModal = () => {
    setVideoModalVisible(!isVideoModalVisible);
  };

  return (
    <ScrollView style={stylesGlobal.scrollBg}>
      <SafeAreaView>
        <View>
          {type == 'subService' ? (
            <>
              <Image
                source={{ uri: sub_service?.assets[0]?.img_url || sub_service?.default_images[0]?.img_url }}
                style={[
                  styles.image,
                  {
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                  },
                ]}
              />
              <View style={styles.textContainer}>
                <Text style={styles.subText}>
                  {sub_service?.provider_sub_list?.name || (selectedLanguage == 'en' ? sub_service?.name?.en : sub_service?.name?.sw)}
                </Text>
                <Text style={[styles.desc, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>
                  {sub_service?.provider_sub_list?.description || (selectedLanguage == 'en' ? sub_service?.description?.en : sub_service?.description?.sw)}
                </Text>
              </View>
              {/* {sub_service?.assets[0]?.video_url !== null || sub_service?.default_images[0]?.video_url !== null ? (
                <TouchableOpacity style={styles.viewVideo} onPress={toggleVideoModal}>
                  <Text style={styles.videoText}>{t('screens:video')}</Text>
                </TouchableOpacity>
              ) : null} */}
            </>
          ) : null}

          {type == 'providerSubService' ? (
            <>
              <Image
                source={{ uri: providerSubService?.assets[0]?.img_url || providerSubService?.default_images[0]?.img_url }}
                style={[
                  styles.image,
                  {
                    borderBottomRightRadius: 10,
                    borderBottomLeftRadius: 10,
                  },
                ]}
              />
              <View style={styles.textContainer}>
                <Text style={styles.subText}>{providerSubService?.provider_sub_list?.name || providerSubService?.name}</Text>
                <Text style={[styles.desc, { color: isDarkMode ? colors.white : colors.alsoGrey }]}>{providerSubService?.description}</Text>
              </View>
              {providerSubService?.assets[0].video_url !== null ? (
                <TouchableOpacity style={styles.viewVideo} onPress={toggleVideoModal}>
                  <Text style={styles.videoText}>{t('screens:video')}</Text>
                </TouchableOpacity>
              ) : null}
            </>
          ) : null}
        </View>

        <Modal visible={isVideoModalVisible} transparent={true} animationType="slide">
          <View style={styles.videoModalContainer}>
            <TouchableOpacity onPress={toggleVideoModal} style={styles.closeButtonContainer}>
              <Text style={styles.closeButton}>{t('screens:close')}</Text>
            </TouchableOpacity>
            {type == 'subService' && (sub_service?.assets[0]?.video_url || sub_service?.default_images[0]?.video_url) ? (
              <VideoPlayer video_url={sub_service?.assets[0]?.video_url || sub_service?.default_images[0]?.video_url} />
            ) : null}
            {type == 'providerSubService' && providerSubService?.assets[0]?.video_url !== null ? (
              <VideoPlayer video_url={providerSubService?.assets[0]?.video_url} />
            ) : null}
          </View>
        </Modal>
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: 320,
    marginBottom: 10,
    borderRadius: 10,
  },
  textContainer: {
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 10,
    padding: 10,
  },
  subText: {
    fontSize: 17,
    fontFamily: 'Prompt-SemiBold',
    color: colors.secondary,
    marginBottom: 5,
  },
  desc: {
    fontSize: 15,
    fontFamily: 'Prompt-Regular',
    marginVertical: 3,
  },
  viewVideo: {
    margin: 15,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    borderRadius: 25,
    paddingVertical: 10,
  },
  videoText: {
    padding: 8,
    fontSize: 14,
    fontFamily: 'Prompt-Regular',
    color: colors.white,
  },
  videoModalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  closeButtonContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 18,
    fontFamily: 'Prompt-Regular',
    color: colors.primary,
    alignSelf:'center'
  },
});

export default SubserviceDetails;
