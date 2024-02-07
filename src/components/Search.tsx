import React, { useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity, Keyboard, ScrollView, StyleSheet, TextInput } from 'react-native'
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { addRecentSearch, removeRecentSearch } from '../features/home/SearchSlice';
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
                <Text style={[styles.innerTitle,{color:colors.black}]}>{item.data.name}</Text>
                <TouchableOpacity onPress={()=>removeRecent(item)}>
                    <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>

            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <Item item={item} />
    );

    const getSearchedData = (searchedCategory, item) => {
       

        console.log('searched category',searchedCategory)
        console.log('item',item);

        const isDuplicate = recentSearches.some(
          (search) => search.category === searchedCategory && isEqual(search.data, item)
        );
           
        if (!isDuplicate) {
          const formattedObject = {
            id: recentSearches.length + 1,
            category: searchedCategory,
            data: item
          };
      
          dispatch(addRecentSearch(formattedObject));
        }
         
        if(searchedCategory=='service'){
            navigation.navigate('Service providers',{
                service:item,
              })
        }else if(searchedCategory=='category'){
            navigation.navigate('Single category',{
                category:item,
              })
        }else if(searchedCategory=='sub services'){
              //screen for sub services
        }else{
           ///screen for providerss
        }
        


      };
      
      const { t } = useTranslation();

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
                    {searches.length > 0 ? searches.map((search) => (
                        <View style={styles.divSettings}>
                            {search.data.length > 0 ? (<Text style={[styles.title,{color:isDarkMode?colors.white:colors.black}]}>{search.title}</Text>) : <></>}
                            {
                                search.data.map(innersearch => (
                                    <TouchableOpacity onPress={() => getSearchedData(search.title, innersearch)}>
                                        <View style={styles.singleSearch} key={innersearch.name}>
                                            <Text style={[styles.innerTitle,{color:isDarkMode?colors.white:colors.black}]}>{innersearch.name}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }

                        </View>)) : (<View />)}
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
