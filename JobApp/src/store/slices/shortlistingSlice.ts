import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Applicant } from './applicationsSlice';
interface ShortlistingCriteria {
  education: {
    weight: number;
    minimumDegree: 'bachelor' | 'master' | 'phd';
  };
  experience: {
    weight: number;
    minimumYears: number;
  };
  skills: {
    weight: number;
    requiredSkills: string[];
  };
  certifications: {
    weight: number;
    requiredCertifications: string[];
  };
}
interface ShortlistingState {
  criteria: ShortlistingCriteria | null;
  shortlistedCandidates: Applicant[];
  isLoading: boolean;
}
const initialState: ShortlistingState = {
  criteria: null,
  shortlistedCandidates: [],
  isLoading: false
};
const shortlistingSlice = createSlice({
  name: 'shortlisting',
  initialState,
  reducers: {
    setCriteria: (state, action: PayloadAction<ShortlistingCriteria>) => {
      state.criteria = action.payload;
    },
    setShortlistedCandidates: (state, action: PayloadAction<Applicant[]>) => {
      state.shortlistedCandidates = action.payload;
    },
    addToShortlist: (state, action: PayloadAction<Applicant>) => {
      if (!state.shortlistedCandidates.some(candidate => candidate.id === action.payload.id)) {
        state.shortlistedCandidates.push(action.payload);
      }
    },
    removeFromShortlist: (state, action: PayloadAction<string>) => {
      state.shortlistedCandidates = state.shortlistedCandidates.filter(candidate => candidate.id !== action.payload);
    },
    clearShortlist: state => {
      state.shortlistedCandidates = [];
    }
  }
});
export const {
  setCriteria,
  setShortlistedCandidates,
  addToShortlist,
  removeFromShortlist,
  clearShortlist
} = shortlistingSlice.actions;
export default shortlistingSlice.reducer;