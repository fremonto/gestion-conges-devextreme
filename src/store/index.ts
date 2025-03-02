import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import congesReducer from './conges/congesSlice';
import adminReducer from './admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    conges: congesReducer,
    admin: adminReducer,
  },
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
