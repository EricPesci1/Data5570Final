import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Session = {
  id: string;
  date: string;
  stakes: string;
  location: string;
  totalBuyins: string;
  totalCashout: string;
  profit: number;
  duration: string;
  notes: string;
};

type SessionsState = {
  entries: Session[];
};

const initialState: SessionsState = {
  entries: [],
};

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    addSession(state, action: PayloadAction<Omit<Session, 'id' | 'profit'>>) {
      const buyins = parseFloat(action.payload.totalBuyins) || 0;
      const cashout = parseFloat(action.payload.totalCashout) || 0;
      state.entries.unshift({
        ...action.payload,
        id: Date.now().toString(),
        profit: cashout - buyins,
      });
    },
    deleteSession(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addSession, deleteSession } = sessionsSlice.actions;
export default sessionsSlice.reducer;
