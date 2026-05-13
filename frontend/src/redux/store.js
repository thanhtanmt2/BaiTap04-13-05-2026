import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import passwordReducer from './passwordSlice';
import profileReducer from './profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    password: passwordReducer,
    profile: profileReducer,
  },
});
