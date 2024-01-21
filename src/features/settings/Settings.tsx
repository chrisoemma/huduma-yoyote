import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Button } from 'react-native'
import React, { useState } from 'react'
import {globalStyles} from '../../styles/global'
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { colors } from '../../utils/colors';
import Modal from "react-native-modal";
import Selector from '../../components/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { useSelector,RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { setTheme, toggleTheme } from './ThemeSlice';

const Settings = () => {

    const dispatch = useAppDispatch();


    const { isDarkMode } = useSelector(
        (state: RootStateOrAny) => state.theme,
      );

      const getTextColor = (isDarkMode) => isDarkMode ? colors.white : colors.black;

    const { t } = useTranslation();

    const [modalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    

    const toggleThemeHandler = () => {
        dispatch(toggleTheme());
      };
    

    return (

        <SafeAreaView
            style={globalStyles().scrollBg}
        >
            <ScrollView showsVerticalScrollIndicator={false}>

                <TouchableOpacity style={{
                    flexDirection: 'row',
                    marginHorizontal: 10, marginTop: 20
                }}
                    onPress={toggleModal}
                >
                    <Entypo
                        name="switch"
                        color={isDarkMode? colors.white: colors.secondary}
                        size={25}
                    />
                    <Text style={{ paddingLeft: 10, fontWeight: 'bold',color: getTextColor(isDarkMode)  }}>{t('screens:switchLanguage')}</Text>
                </TouchableOpacity>


                <TouchableOpacity
          style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 20 }}
          onPress={toggleThemeHandler}
        >
          <Entypo
            name="switch"
            color={isDarkMode? colors.white: colors.secondary}
            size={25}
          />
          <Text style={{ paddingLeft: 10, fontWeight: 'bold',color: getTextColor(isDarkMode)  }}>{isDarkMode?t('screens:dark'):t('screens:light')}</Text>
        </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 20 }}>
                    <Icon
                        name="lock1"
                        color={colors.secondary}
                        size={25}
                    />
                    <Text style={{ paddingLeft: 10, fontWeight: 'bold',color: getTextColor(isDarkMode)  }}>{t('screens:changePassword')}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginTop: 25 }}>
                    <Icon
                        name="logout"
                        color={colors.dangerRed}
                        size={25}
                    />
                    <Text style={{ paddingLeft: 10, fontWeight: 'bold',color: getTextColor(isDarkMode)  }}>{t('navigate:logout')}</Text>
                </TouchableOpacity>

                <Modal isVisible={modalVisible}
                 onSwipeComplete={() => setModalVisible(false)}
                 swipeDirection="left"
                >
                    <View style={{ flex: 1,justifyContent:'center' }}>
                    <Selector />
                    </View>
                    <Button 
                    title={t('screens:close')}
                    onPress={toggleModal} 
                    color={colors.secondary}
                     />
                </Modal>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Settings