import React, { useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity, Keyboard, ScrollView, StyleSheet, TextInput, Button } from 'react-native'
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { addRecentSearch, clearSearches, removeRecentSearch } from '../features/home/SearchSlice';
import { useAppDispatch } from '../app/store';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'react-i18next';

const Search = ({
    onChange,
    searches,
    recentSearches,
       form,
    navigation,
    isDarkMode
}: any) => {
   


    const dispatch = useAppDispatch();

    const removeRecent =(item)=>{
        dispatch(removeRecentSearch(item.id));
    }



  
    const recentSearchNavigation = (item)=>{
            

       // console.log('iteemmeme',item)
        if(item.category=='service'){
            navigation.navigate('Service providers',{
                service:item.data,
              })
        }else if(item.category=='category'){
            navigation.navigate('Single category',{
                category:item.data,
              })
        }else if(item.category=='sub services'){
              //screen for sub services
        }else{
           ///screen for providerss
        }
    }
    const Item = ({item }: any) => (

        <TouchableOpacity key={item.id}
           onPress={()=>recentSearchNavigation(item)}
        >
            <View style={[styles.item,{borderRadius:10}]}>
                <Text style={[styles.innerTitle,{color:colors.black}]}>{item?.data?.name}</Text>
                <TouchableOpacity onPress={()=>removeRecent(item)}>
                    <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );


    const handleClearSearches = () => {
        dispatch(clearSearches());
    };


    console.log('sesend search',recentSearches);

    const renderItem = ({ item }) => (
        <Item item={item} />
    );

    const getSearchedData = (searchedCategory, item) => {
      

   
        const englishName = item?.name?.name?.en?.toLowerCase();
        const swahiliName = item?.name?.name?.sw?.toLowerCase();
        const searchInput = form?.search?.toLowerCase();
        const englishMatchPercentage = (englishName?.match(new RegExp(searchInput, 'g')) || [])?.length / englishName?.length;
        const swahiliMatchPercentage = (swahiliName?.match(new RegExp(searchInput, 'g')) || [])?.length / swahiliName?.length;
        let searchedName = '';
        if (englishMatchPercentage > swahiliMatchPercentage) {
            searchedName = item?.name?.name?.en; // Display English version
        } else {
            searchedName = item?.name?.name?.sw; // Display Swahili version
        }

        const isDuplicate = recentSearches.some((search) => {
            // Check if category and name id match
            return search.category === searchedCategory && search.data.id === item?.name?.id;
          });

        if (!isDuplicate) {
            const formattedObject = {
                id: recentSearches.length + 1,
                category: searchedCategory,
                data: {
                    id:item?.name?.id,
                    name:searchedName
                }
            };

            dispatch(addRecentSearch(formattedObject));
        }



        if (searchedCategory === 'service') {
            navigation.navigate('Service providers', {
                service: { ...item, name: searchedName },
            });
        } else if (searchedCategory === 'category') {
            navigation.navigate('Single category', {
                category: { ...item, name: searchedName },
            });
        } else if (searchedCategory === 'sub services') {
            //screen for sub services
        } else {
            ///screen for providerss
        }
    };
      const { t } = useTranslation();

      const getSearchedName = (innersearch, searchInput) => {
        const englishName = innersearch?.name?.name?.en?.toLowerCase();
        const swahiliName = innersearch?.name?.name?.sw?.toLowerCase();
        const englishMatchPercentage = (englishName?.match(new RegExp(searchInput, 'g')) || [])?.length / englishName?.length;
        const swahiliMatchPercentage = (swahiliName?.match(new RegExp(searchInput, 'g')) || [])?.length / swahiliName?.length;
        return englishMatchPercentage > swahiliMatchPercentage ? innersearch?.name?.name?.en : innersearch?.name?.name?.sw;
      };

    return (
        <View style={[styles.wrapper,{backgroundColor:isDarkMode?colors.black:colors.white}]}>
            <View style={[styles.searchHeader,{marginTop:15}]}>
                <TouchableOpacity onPress={() => {
                    Keyboard.dismiss();
                    navigation.goBack();

                }}>
                    <View style={styles.searchIcon}>
                        <Icon name="arrow-back-outline"
                         type="ionicons" size={30}
                          style={{color:isDarkMode?colors.white:colors.black}}
                         />
                    </View>
                </TouchableOpacity>
                <View style={[styles.inputContainer]}>
                    <TextInput placeholder={t('screens:search')}
                        style={[styles.input,{
                            color:colors.black,
                            backgroundColor:colors.white,
                            borderRadius:20
                        }]}
                        autoFocus={true}
                        value={form.search || ""}
                        onChangeText={(value) => {
                            onChange({ name: "search", value });
                        }}
                    />


                </View>
               
            </View>
            <View style={styles.recentSearch}>
               {recentSearches.length>0 ? <Text
                    style={{ fontSize: 17, fontFamily: 'Poppins-Medium',
                     color:isDarkMode?colors.white:colors.black
                }}
                >{t('screens:recentSearch')}</Text>:<View />} 
                <FlatList
                    data={recentSearches}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                />
            </View>

       <ScrollView>
        <View style={styles.searches}>
          {searches.length > 0 &&
            searches?.map((search: any) => (
              <View style={styles.divSettings} key={search.title}>
                
                {search.data.length > 0 && <Text style={[styles.title, { color: isDarkMode ? colors.white : colors.black }]}>{search.title}</Text>}
                {search.data.map((innersearch: any) => (
                  <TouchableOpacity onPress={() => getSearchedData(search.title, innersearch)} key={innersearch?.id}>
                    <View style={styles.singleSearch}>
                      <Text style={[styles.innerTitle, { color: isDarkMode ? colors.white : colors.black }]}>
                        {getSearchedName(innersearch, form?.search?.toLowerCase())}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  
                ))}
              </View>
            ))}
        </View>
      </ScrollView>

        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    wrapper: {
        height: "100%",
    },
    search: {
        alignItems: "flex-start",
        backgroundColor: "#fafafa",
        padding: 6,
        marginHorizontal: 20,
        borderRadius: 20,
    },
    recentSearch: {
        marginHorizontal:7,
    },
    item: {
        backgroundColor: "#fafafa",
        margin: 8,
        padding: 6,
        alignItems: "center",
        flexDirection: "row",
    },
    deleteButton: {
        color: "red",
        marginLeft: 14,
        fontSize: 21,
    },
    searchHeader: {
        height: 60,
        marginBottom: 20,
        elevation: 1,
        flexDirection: "row",
        shadowColor: "#000",
    },
    searchIcon: {
        marginTop: 15,
        marginRight: 30,
        marginLeft: 15,
    },
    input: {
        borderWidth: 0.1,
    },
    inputContainer: {
        width: 220,
    },
    searches: {
        marginTop: 10,
        marginHorizontal: 15
    },
    title: {
        fontSize: 18,
        color: '#b0aeae'
    },
    innerTitle: {
        fontSize: 13,
    },
    singleSearch: {
        marginVertical: 6,

    }
})
