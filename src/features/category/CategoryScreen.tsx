import React, { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { globalStyles } from '../../styles/global';
import { useTranslation } from 'react-i18next';
import VerticalTabs from '../../components/VerticalTabs';
import ContentList from '../../components/ContentList';
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getCategoryServices } from './CategorySlice';
import { selectLanguage } from '../../costants/languageSlice';
import { sortByLanguage } from '../../utils/utilts';

const CategoryScreen = ({ route, navigation }: any) => {
  const { loading, category_services } = useSelector(
    (state: RootStateOrAny) => state.categories,
  );


  const selectedLanguage = useSelector(selectLanguage);


  const sortedCategories = sortByLanguage(category_services, selectedLanguage);

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCategoryServices());
  }, [dispatch]);

  const [activeTab, setActiveTab] = useState(0);
  const [contentData, setContentData] = useState([]);

  useEffect(() => {
    if (sortedCategories.length > 0) {
      const defaultCategory = sortedCategories[0];
      setActiveTab(defaultCategory.id);
      setContentData(sortByLanguage(defaultCategory.services,selectedLanguage));
    }
  }, [category_services]);

  const handleTabPress = (tabIndex: any) => {
    setActiveTab(tabIndex);
    const categoryServices = sortedCategories.find(
      (entry) => entry.id === tabIndex
    );

    if (categoryServices) {
      setContentData(sortByLanguage(categoryServices.services,selectedLanguage));
    }
  };

  const { t } = useTranslation();
  return (
    <SafeAreaView style={globalStyles().scrollBg}>
      <View style={globalStyles().mainContainer}>
        <View style={globalStyles().side}>
          <VerticalTabs
            tabs={sortedCategories}
            isDarkMode={isDarkMode}
            activeTab={activeTab}
            onTabPress={handleTabPress}
          />
        </View>
        <View style={globalStyles().sub}>
          <ContentList
            data={contentData}
            isDarkMode={isDarkMode}
            navigation={navigation}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CategoryScreen;
