import { configureStore } from '@reduxjs/toolkit';
import playerNotesReducer from './playerNotesSlice';
import sessionsReducer from './sessionsSlice';

export const store = configureStore({
  reducer: {
    playerNotes: playerNotesReducer,
    sessions: sessionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
