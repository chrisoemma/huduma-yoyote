import { View, Text } from 'react-native'
import React, { useRef, useState } from 'react'
import Search from '../../components/Search'
import { useSelector,RootStateOrAny } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { getSearches } from './SearchSlice';

const SearchScreen = ({navigation}:any) => {

const {searches,recentSearches} = useSelector(
  (state: RootStateOrAny) => state.searches,
);

const [form,setForm] = useState({})
const inputRef = useRef()
const [searchData,setSearchData]=useState([])

const dispatch = useAppDispatch();



const onChange = ({ name, value }:any) => {
 
  let data ={
    search:""
  }
  setForm({ ...form, [name]: value });
   if(value !==""){
     data= {
      search:value
     }
   dispatch(getSearches(data))
   }else{
     
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
       searches={searches}
       recentSearches={recentSearches}
       />
    </View>
  )
}

export default SearchScreen