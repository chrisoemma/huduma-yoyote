import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Search from '../../components/Search'
import { useSelector, RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { clearSearches, getSearches} from './SearchSlice';
import debounce from 'lodash/debounce';

const SearchScreen = ({ navigation }: any) => {

  const { searchData, recent } = useSelector(
    (state: RootStateOrAny) => state.searches,
  );

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
);

  const [form, setForm] = useState({})
  const inputRef = useRef()

  const dispatch = useAppDispatch();

  const debouncedDispatch = debounce(dispatch, 300); 

  useEffect(() => {
    return () => {
      dispatch(clearSearches());
    };
  }, []);

  const onChange = ({ name, value }: any) => {

    setForm({ ...form, [name]: value });
    if (value !== "") {
      debouncedDispatch(getSearches({ data: { search: value } }));
    } else {
       
      dispatch(clearSearches());
    }

  };
  return (
    <View>
      <Search
        navigation={navigation}
        onChange={onChange}
        form={form}
        inputRef={inputRef}
        setForm={setForm}
        searches={searchData}
        recentSearches={recent}
        isDarkMode={isDarkMode}
      />
      <View>
        {/* I want here to render those data returned from search  */}
      </View>
    </View>
  )
}

export default SearchScreen