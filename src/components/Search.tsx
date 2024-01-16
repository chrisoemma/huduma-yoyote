import React, { useContext } from 'react'
import { View, Text, FlatList, TouchableOpacity, Keyboard, ScrollView, StyleSheet, TextInput } from 'react-native'
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/Ionicons';

const Search = ({

    onChange,
    searches,
    recentSearches,

    //   searchesLoading,
       inputRef,
    //   form,
    navigation
}: any) => {




    const Item = ({ title }: any) => (

        <TouchableOpacity>
            <View style={styles.item}>
                <Text style={styles.innerTitle}>{title}</Text>
                <TouchableOpacity>
                    <Text style={styles.deleteButton}>X</Text>
                </TouchableOpacity>

            </View>
        </TouchableOpacity>
    );

    const renderItem = ({ item }) => (
        <Item title={item.title} />
    );

    const getSearchedData = (searchedCategory, item) => {

    }

    return (
        <View style={styles.wrapper}>
            <View style={styles.searchHeader}>
                <TouchableOpacity onPress={() => {
                    Keyboard.dismiss();
                    navigation.goBack();

                }}>
                    <View style={styles.searchIcon}>
                        <Icon name="arrow-back-outline" type="ionicons" size={30} />
                    </View>
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <TextInput placeholder="Search..."
                        style={styles.input}
                        autoFocus={true}
                        // value={form.search || ""}
                        onChangeText={(value) => {
                            onChange({ name: "search", value });
                        }}
                    />
                </View>
            </View>
            <View style={styles.recentSearch}>
                <Text
                    style={{ fontSize: 18, fontFamily: 'Poppins-Medium' }}
                >Recent Search</Text>
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
                            {search.data.length > 0 ? (<Text style={styles.title}>{search.title}</Text>) : <></>}
                            {
                                search.data.map(innersearch => (
                                    <TouchableOpacity onPress={() => getSearchedData(search.title, innersearch)}>
                                        <View style={styles.singleSearch} key={innersearch.name}>
                                            <Text style={styles.innerTitle}>{innersearch.name}</Text>
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
        backgroundColor: colors.white,
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
        marginLeft: 10,
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
        fontSize: 16,
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
        fontSize: 14,
        marginLeft: 10
    },
    singleSearch: {
        marginVertical: 6,

    }
})
