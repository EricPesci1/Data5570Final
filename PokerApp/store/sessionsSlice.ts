import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from './api';

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
  loading: boolean;
  error: string | null;
};

const initialState: SessionsState = {
  entries: [],
  loading: false,
  error: null,
};

// Maps a backend API response object to the frontend Session shape
function fromApi(data: any): Session {
  const buyins = parseFloat(data.total_buyins) || 0;
  const cashout = parseFloat(data.total_cashout) || 0;
  return {
    id: String(data.id),
    date: data.date ?? '',
    stakes: data.stakes ?? '',
    location: data.location ?? '',
    totalBuyins: String(data.total_buyins ?? ''),
    totalCashout: String(data.total_cashout ?? ''),
    profit: cashout - buyins,
    duration: data.duration ?? '',
    notes: data.notes ?? '',
  };
}

export const fetchSessions = createAsyncThunk('sessions/fetchAll', async () => {
  const res = await fetch(`${API_BASE_URL}/sessions/`);
  const data = await res.json();
  const list = data.results ?? data;
  return (list as any[]).map(fromApi);
});

export const createSession = createAsyncThunk(
  'sessions/create',
  async (form: Omit<Session, 'id' | 'profit'>) => {
    const res = await fetch(`${API_BASE_URL}/sessions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: form.date || null,
        stakes: form.stakes,
        location: form.location,
        duration: form.duration,
        total_buyins: form.totalBuyins,
        total_cashout: form.totalCashout || null,
        notes: form.notes,
      }),
    });
    const data = await res.json();
    return fromApi(data);
  }
);

export const removeSession = createAsyncThunk('sessions/remove', async (id: string) => {
  await fetch(`${API_BASE_URL}/sessions/${id}/`, { method: 'DELETE' });
  return id;
});

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load sessions';
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.entries.unshift(action.payload);
      })
      .addCase(removeSession.fulfilled, (state, action) => {
        state.entries = state.entries.filter((e) => e.id !== action.payload);
      });
  },
});

export default sessionsSlice.reducer;
