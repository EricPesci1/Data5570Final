import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from './api';

export type PlayerNote = {
  id: string;
  name: string;
  location: string;
  stakes: string;
  playstyle: string;
  notes: string;
  createdAt: string;
};

type PlayerNotesState = {
  entries: PlayerNote[];
  loading: boolean;
  error: string | null;
};

const initialState: PlayerNotesState = {
  entries: [],
  loading: false,
  error: null,
};

function fromApi(data: any): PlayerNote {
  return {
    id: String(data.id),
    name: data.name ?? '',
    location: data.location ?? '',
    stakes: data.stakes ?? '',
    playstyle: data.playstyle ?? '',
    notes: data.notes ?? '',
    createdAt: data.created_at
      ? new Date(data.created_at).toLocaleDateString()
      : '',
  };
}

export const fetchPlayerNotes = createAsyncThunk('playerNotes/fetchAll', async () => {
  const res = await fetch(`${API_BASE_URL}/playernotes/`);
  const data = await res.json();
  const list = data.results ?? data;
  return (list as any[]).map(fromApi);
});

export const createPlayerNote = createAsyncThunk(
  'playerNotes/create',
  async (form: Omit<PlayerNote, 'id' | 'createdAt'>) => {
    const res = await fetch(`${API_BASE_URL}/playernotes/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        location: form.location,
        stakes: form.stakes,
        playstyle: form.playstyle,
        notes: form.notes,
      }),
    });
    const data = await res.json();
    return fromApi(data);
  }
);

export const removePlayerNote = createAsyncThunk('playerNotes/remove', async (id: string) => {
  await fetch(`${API_BASE_URL}/playernotes/${id}/`, { method: 'DELETE' });
  return id;
});

const playerNotesSlice = createSlice({
  name: 'playerNotes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- fetch ---
      .addCase(fetchPlayerNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchPlayerNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to load player notes';
      })
      // --- create (optimistic) ---
      .addCase(createPlayerNote.pending, (state, action) => {
        const form = action.meta.arg;
        state.entries.unshift({
          ...form,
          id: action.meta.requestId,
          createdAt: new Date().toLocaleDateString(),
        });
      })
      .addCase(createPlayerNote.fulfilled, (state, action) => {
        // Replace the optimistic entry with the real one from the backend
        const idx = state.entries.findIndex((e) => e.id === action.meta.requestId);
        if (idx !== -1) state.entries[idx] = action.payload;
      })
      .addCase(createPlayerNote.rejected, (state, action) => {
        // Roll back the optimistic entry if the backend call failed
        state.entries = state.entries.filter((e) => e.id !== action.meta.requestId);
        state.error = action.error.message ?? 'Failed to save player note';
      })
      // --- remove (optimistic) ---
      .addCase(removePlayerNote.pending, (state, action) => {
        state.entries = state.entries.filter((e) => e.id !== action.meta.arg);
      })
      .addCase(removePlayerNote.rejected, (state, action) => {
        state.error = action.error.message ?? 'Failed to delete player note';
      });
  },
});

export default playerNotesSlice.reducer;
