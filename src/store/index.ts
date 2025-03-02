import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import congesReducer from './conges/congesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conges: congesReducer,
  },
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
