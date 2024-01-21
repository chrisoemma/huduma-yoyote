// onboardingSlice.js
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OnboardingState {
  onboardingCompleted: boolean;
}

const initialState: OnboardingState = {
  onboardingCompleted: false,
};

const OnboardingSlice = createSlice({
  name: 'onboarding',
  initialState,
  reducers: {
    setOnboardingCompleted: (state, action: PayloadAction<boolean>) => {
      state.onboardingCompleted = action.payload;
    },
  },
});

export const { setOnboardingCompleted } = OnboardingSlice.actions;
export const selectOnboardingCompleted = (state) => state.onboarding.onboardingCompleted;
export default OnboardingSlice.reducer;
