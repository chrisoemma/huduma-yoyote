import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { globalStyles } from '../../styles/global';
import Icon from 'react-native-vector-icons/EvilIcons';
import { colors } from '../../utils/colors';
import { useTranslation } from 'react-i18next';
import ContentServiceList from '../../components/ContentServiceList';


const SingleService = ({ route, navigation }: any) => {

  const { params } = route;

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

  React.useLayoutEffect(() => {
    if (params && params.service) {
      navigation.setOptions({ title: params.service.name });
    }
  }, [navigation, params]);

  

  let subServices = [
    {
      name: 'Urembo',
      icon: 'dingding'
    },
    {
      name: 'Massage',
      icon: 'aliwangwang-o1'
    },
    {
      name: 'Chakula',
      icon: 'weibo'
    },
    {
      name: 'Dobi',
      icon: ''
    },
    {
      name: 'Upambaji',
      icon: ''
    },
    {
      name: 'Fundi nguo',
      icon: ''
    },
    {
      name: 'Dobi1',
      icon: ''
    },
    {
      name: 'Upambaji1',
      icon: ''
    },
    {
      name: 'Fundi nguo1',
      icon: ''
    },
    {
      name: 'Dobi2',
      icon: ''
    },
    {
      name: 'Upambaji2',
      icon: ''
    },
    {
      name: 'Fundi nguo2',
      icon: ''
    },
    {
      name: 'Dobi3',
      icon: ''
    },
    {
      name: 'Upambaji3',
      icon: ''
    },
    {
      name: 'Fundi nguo3',
      icon: ''
    },
    {
      name: 'Dobi4',
      icon: ''
    },
    {
      name: 'Upambaji4',
      icon: ''
    },
    {
      name: 'Fundi nguo4',
      icon: ''
    },
  ]
  return (
    <SafeAreaView
      style={globalStyles.scrollBg}
    >
      <View style={globalStyles.subCategory}>
        <ContentServiceList 
        data={subServices}  
        toggleSubService={toggleSubService} selectedSubServices={selectedSubservice}
         />
      </View>
      
      <View style={{flexDirection:'row',}}>
      {selectedSubservice.length > 1 && (
        <TouchableOpacity
          style={[globalStyles.floatingButton, { backgroundColor: colors.dangerRed,  right:'70%', }]}
          onPress={handleClearAll}
        >
          <Text style={globalStyles.floatingBtnText}>Clear All</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[globalStyles.floatingButton, { backgroundColor: selectedSubservice.length > 0 ? colors.secondary : colors.primary }]}
      >
        <Text style={globalStyles.floatingBtnText}>{`${selectedSubservice.length} Find Providers`}</Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
};



export default SingleService;