import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addPlayerNote, deletePlayerNote, PlayerNote } from '../../store/playerNotesSlice';

const EMPTY_FORM = { name: '', location: '', stakes: '', playstyle: '', notes: '' };

function NoteCard({ entry, onDelete }: { entry: PlayerNote; onDelete: () => void }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <FontAwesome name="user" size={14} color="#d4af37" style={{ marginRight: 6 }} />
          <Text style={styles.cardName}>{entry.name}</Text>
        </View>
        <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <FontAwesome name="trash" size={14} color="#555" />
        </TouchableOpacity>
      </View>

      <View style={styles.cardTags}>
        {entry.location ? (
          <View style={styles.tag}>
            <FontAwesome name="map-marker" size={11} color="#8b949e" style={{ marginRight: 4 }} />
            <Text style={styles.tagText}>{entry.location}</Text>
          </View>
        ) : null}
        {entry.stakes ? (
          <View style={styles.tag}>
            <FontAwesome name="dollar" size={11} color="#8b949e" style={{ marginRight: 4 }} />
            <Text style={styles.tagText}>{entry.stakes}</Text>
          </View>
        ) : null}
        {entry.playstyle ? (
          <View style={styles.tag}>
            <FontAwesome name="tag" size={11} color="#8b949e" style={{ marginRight: 4 }} />
            <Text style={styles.tagText}>{entry.playstyle}</Text>
          </View>
        ) : null}
      </View>

      {entry.notes ? <Text style={styles.cardNotes}>{entry.notes}</Text> : null}

      <Text style={styles.cardDate}>Added {entry.createdAt}</Text>
    </View>
  );
}

export default function PlayerNotesScreen() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.playerNotes.entries);
  const [form, setForm] = useState(EMPTY_FORM);

  function handleSubmit() {
    if (!form.name.trim()) return;
    dispatch(addPlayerNote(form));
    setForm(EMPTY_FORM);
  }

  function setField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <FontAwesome name="users" size={28} color="#d4af37" style={{ marginBottom: 8 }} />
          <Text style={styles.pageTitle}>Player Notes</Text>
          <Text style={styles.pageSubtitle}>Track tendencies and reads on opponents</Text>
        </View>

        {/* Input Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Add Player</Text>

          <TextInput
            style={styles.input}
            placeholder="Name *"
            placeholderTextColor="#555"
            value={form.name}
            onChangeText={(v) => setField('name', v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Location (e.g. Bellagio, home game)"
            placeholderTextColor="#555"
            value={form.location}
            onChangeText={(v) => setField('location', v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Stakes (e.g. 1/2 NL, 2/5 NL)"
            placeholderTextColor="#555"
            value={form.stakes}
            onChangeText={(v) => setField('stakes', v)}
          />
          <TextInput
            style={styles.input}
            placeholder="Playstyle (e.g. tight-aggressive, loose-passive)"
            placeholderTextColor="#555"
            value={form.playstyle}
            onChangeText={(v) => setField('playstyle', v)}
          />
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes"
            placeholderTextColor="#555"
            value={form.notes}
            onChangeText={(v) => setField('notes', v)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitButton, !form.name.trim() && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <FontAwesome name="plus" size={14} color="#0d1117" style={{ marginRight: 8 }} />
            <Text style={styles.submitButtonText}>Save Note</Text>
          </TouchableOpacity>
        </View>

        {/* Past Notes */}
        {entries.length > 0 && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Past Notes ({entries.length})</Text>
            {entries.map((entry) => (
              <NoteCard
                key={entry.id}
                entry={entry}
                onDelete={() => dispatch(deletePlayerNote(entry.id))}
              />
            ))}
          </View>
        )}

        {entries.length === 0 && (
          <Text style={styles.emptyText}>No notes yet. Add your first player above.</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  content: {
    padding: 20,
    paddingBottom: 48,
  },
  pageHeader: {
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 12,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#8b949e',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  form: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e2a3a',
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#1e2a3a',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 10,
  },
  notesInput: {
    height: 90,
    paddingTop: 10,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4af37',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 4,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: '#0d1117',
    fontWeight: '700',
    fontSize: 14,
  },
  notesSection: {
    gap: 12,
  },
  card: {
    backgroundColor: '#161b22',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e2a3a',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2332',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#8b949e',
  },
  cardNotes: {
    fontSize: 13,
    color: '#cdd9e5',
    lineHeight: 18,
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 11,
    color: '#3d4450',
  },
  emptyText: {
    textAlign: 'center',
    color: '#3d4450',
    fontSize: 13,
    marginTop: 8,
  },
});
