import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../styles/global';
import ProviderList from '../../components/ProviderList';
import { useTranslation } from 'react-i18next';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getBestProviders, getNearProviders } from './ServiceProviderSlice';

const ServiceProviders = ({ navigation, route }: any) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('nearMe');
  const { params } = route;

  const { loading, bestProviders, nearProviders } = useSelector(
    (state: RootStateOrAny) => state.providers,
  );

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getNearProviders(params.service.id));
    dispatch(getBestProviders(params.service.id));
  }, [dispatch]);

  const toggleTab = () => {
    setActiveTab(activeTab === 'nearMe' ? 'bestProviders' : 'nearMe');
  };

  const renderProviderItem = ({ item }: any) => (
    // <View style={styles.itemlistContainer}>
      <ProviderList  
        navigation={navigation} 
        provider={item} 
        service={params?.service}
        isDarkMode={isDarkMode}
      />
    // </View>
  );

  return (
    <SafeAreaView style={globalStyles().scrollBg}>
      <View style={styles.container}>
        <View style={styles.toggleButtonContainer}>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={toggleTab}
          >
            <Text style={[styles.buttonText, activeTab === 'nearMe' ? styles.activeToggleText : null]}>
              {t('screens:nearMe')}
            </Text>
            <Text style={[styles.buttonText, activeTab === 'bestProviders' ? styles.activeToggleText : null]}>
              {t('screens:bestProviders')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={activeTab === 'nearMe' ? nearProviders : bestProviders}
            renderItem={renderProviderItem}
            keyExtractor={(item) => item.provider_id.toString()}
            numColumns={2} 
            contentContainerStyle={styles.flatListContent}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  toggleButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  toggleButton: {
    flexDirection: 'row',
    borderRadius: 30,
    backgroundColor: colors.white,
  },
  activeToggleText: {
    color: colors.white,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  buttonText: {
    color: colors.secondary,
    fontFamily: 'Prompt-Regular',
    padding: 10,
    marginRight: 5,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  flatListContent: {
   // alignItems: 'center',
    paddingBottom: 20,
  },
  itemlistContainer: {
    width: '45%',
    margin: 10,
  },
});

export default ServiceProviders;
