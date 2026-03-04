import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
};

const initialState: PlayerNotesState = {
  entries: [],
};

const playerNotesSlice = createSlice({
  name: 'playerNotes',
  initialState,
  reducers: {
    addPlayerNote(state, action: PayloadAction<Omit<PlayerNote, 'id' | 'createdAt'>>) {
      state.entries.unshift({
        ...action.payload,
        id: Date.now().toString(),
        createdAt: new Date().toLocaleDateString(),
      });
    },
    deletePlayerNote(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter((e) => e.id !== action.payload);
    },
  },
});

export const { addPlayerNote, deletePlayerNote } = playerNotesSlice.actions;
export default playerNotesSlice.reducer;