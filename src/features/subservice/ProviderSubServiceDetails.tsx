import { View, Text, SafeAreaView, ScrollView, Image, StyleSheet } from 'react-native';
import React from 'react';
import { globalStyles } from '../../styles/global';
import { useSelector } from 'react-redux';
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import { selectLanguage } from '../../costants/languageSlice';

const ProviderSubServiceDetails = ({ route }: any) => {
    const { item } = route.params;
    const stylesGlobal = globalStyles();
    const { isDarkMode } = useSelector((state: RootStateOrAny) => state.theme);
    const { t } = useTranslation();
    const selectedLanguage = useSelector(selectLanguage);

    // Determine the image source
    const imageSource =
        item?.provider_sub_service?.assets?.[0]?.img_url ?
            { uri: item.provider_sub_service.assets[0].img_url } :
            item?.sub_service?.assets?.[0]?.img_url ?
                { uri: item.sub_service.assets[0].img_url } :
                item?.sub_service?.default_images?.[0]?.img_url ?
                    { uri: item.sub_service.default_images[0].img_url } :
                    null; // Default to null if no image is available

    return (
        <SafeAreaView>
            <ScrollView style={stylesGlobal.scrollBg}>
                <View>
                    {/* Render the Image if available */}
                    {imageSource && (
                        <Image
                            source={imageSource}
                            style={[
                                styles.image,
                                {
                                    borderBottomRightRadius: 10,
                                    borderBottomLeftRadius: 10,
                                },
                            ]}
                        />
                    )}
                </View>

                <View
                    style={[
                        styles.itemContent,
                        { backgroundColor: isDarkMode ? colors.darkModeBackground : colors.whiteBackground },
                    ]}
                >

                    <View style={styles.textContainer}>
                        <Text
                            style={[
                                styles.categoryService,
                                { color: isDarkMode ? colors.white : colors.secondary },
                            ]}
                        >
                            {item?.provider_sub_list?.name ||
                                (selectedLanguage === 'en' ? item?.sub_service?.name?.en : item?.sub_service?.name?.sw) ||
                                item?.provider_sub_service?.name}
                        </Text>
                        <Text
                            style={[
                                styles.description,
                                {
                                    color: isDarkMode ? colors.white : colors.black,
                                },
                            ]}
                        >
                            {item?.provider_sub_list?.description ||
                                (selectedLanguage === 'en' ? item?.sub_service?.description?.en : item?.sub_service?.description?.sw)}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    contentItem: {
        marginBottom: 15,
        backgroundColor: colors.white,
        borderRadius: 10,
        elevation: 4,
        overflow: 'hidden',
    },
    itemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    image: {
        resizeMode: 'cover',
        width: '100%',
        height: 320,
        marginBottom: 10,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
    },
    categoryService: {
        fontFamily: 'Prompt-SemiBold',
        fontSize: 14,
        color: colors.secondary,
        marginBottom: 15,
        textTransform: 'uppercase',
    },
    description: {
        fontFamily: 'Prompt-Regular',
        fontSize: 13,
        color: colors.black,
    },
});

export default ProviderSubServiceDetails;
