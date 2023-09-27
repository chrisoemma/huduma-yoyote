import AsyncStorage from '@react-native-async-storage/async-storage';

export const authHeader = async () => {

  const token = await AsyncStorage.getItem('token');
  return {
    Authorization: 'Bearer ' + token,
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
};
