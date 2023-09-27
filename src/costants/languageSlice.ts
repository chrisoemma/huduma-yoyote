import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LanguageState {
  selectedLanguageCode: string;
}

const initialState: LanguageState = {
  selectedLanguageCode: 'en',
};

const languageSlice = createSlice({
  name: 'language', // The name of the slice
  initialState,     // The initial state of the slice
  reducers: {
    setLanguageCode: (state, action: PayloadAction<string>) => {
      console.log('stattttt',state)
      state.selectedLanguageCode = action.payload;
    },
  },
});



export const { setLanguageCode } = languageSlice.actions;

export default languageSlice.reducer;
