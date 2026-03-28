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
      // --- fetch ---
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
      // --- create (optimistic) ---
      .addCase(createSession.pending, (state, action) => {
        const form = action.meta.arg;
        const buyins = parseFloat(form.totalBuyins) || 0;
        const cashout = parseFloat(form.totalCashout) || 0;
        state.entries.unshift({
          ...form,
          id: action.meta.requestId,
          profit: cashout - buyins,
        });
      })
      .addCase(createSession.fulfilled, (state, action) => {
        // Replace the optimistic entry with the real one from the backend
        const idx = state.entries.findIndex((e) => e.id === action.meta.requestId);
        if (idx !== -1) state.entries[idx] = action.payload;
      })
      .addCase(createSession.rejected, (state, action) => {
        // Roll back the optimistic entry if the backend call failed
        state.entries = state.entries.filter((e) => e.id !== action.meta.requestId);
        state.error = action.error.message ?? 'Failed to save session';
      })
      // --- remove (optimistic) ---
      .addCase(removeSession.pending, (state, action) => {
        state.entries = state.entries.filter((e) => e.id !== action.meta.arg);
      })
      .addCase(removeSession.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to delete session';
      });
  },
});

export default sessionsSlice.reducer;
