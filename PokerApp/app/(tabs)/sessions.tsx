import { useState, useEffect } from 'react';
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
import { fetchSessions, createSession, removeSession, Session } from '../../store/sessionsSlice';

const EMPTY_FORM = {
  date: '',
  stakes: '',
  location: '',
  totalBuyins: '',
  totalCashout: '',
  duration: '',
  notes: '',
};

function calcProfit(buyins: string, cashout: string): number {
  return (parseFloat(cashout) || 0) - (parseFloat(buyins) || 0);
}

function formatMoney(value: number): string {
  const abs = Math.abs(value).toFixed(2);
  return value >= 0 ? `+$${abs}` : `-$${abs}`;
}

function SessionCard({ entry, onDelete }: { entry: Session; onDelete: () => void }) {
  const isWin = entry.profit >= 0;
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardStakes}>{entry.stakes || 'Session'}</Text>
          {entry.date ? <Text style={styles.cardDate}>{entry.date}</Text> : null}
        </View>
        <View style={styles.cardRight}>
          <Text style={[styles.profitBadge, isWin ? styles.profitWin : styles.profitLoss]}>
            {formatMoney(entry.profit)}
          </Text>
          <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }} style={{ marginLeft: 10 }}>
            <FontAwesome name="trash" size={14} color="#555" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardTags}>
        {entry.location ? (
          <View style={styles.tag}>
            <FontAwesome name="map-marker" size={11} color="#8b949e" style={{ marginRight: 4 }} />
            <Text style={styles.tagText}>{entry.location}</Text>
          </View>
        ) : null}
        {entry.duration ? (
          <View style={styles.tag}>
            <FontAwesome name="clock-o" size={11} color="#8b949e" style={{ marginRight: 4 }} />
            <Text style={styles.tagText}>{entry.duration}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.moneyRow}>
        <View style={styles.moneyItem}>
          <Text style={styles.moneyLabel}>Buy-in</Text>
          <Text style={styles.moneyValue}>${parseFloat(entry.totalBuyins || '0').toFixed(2)}</Text>
        </View>
        <FontAwesome name="arrow-right" size={12} color="#3d4450" />
        <View style={styles.moneyItem}>
          <Text style={styles.moneyLabel}>Cash-out</Text>
          <Text style={styles.moneyValue}>${parseFloat(entry.totalCashout || '0').toFixed(2)}</Text>
        </View>
      </View>

      {entry.notes ? <Text style={styles.cardNotes}>{entry.notes}</Text> : null}
    </View>
  );
}

export default function SessionsScreen() {
  const dispatch = useAppDispatch();
  const entries = useAppSelector((state) => state.sessions.entries);
  const [form, setForm] = useState(EMPTY_FORM);

  const liveProfit = calcProfit(form.totalBuyins, form.totalCashout);
  const hasValidBuyin = form.totalBuyins.trim() !== '';

  function setField(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  useEffect(() => {
    dispatch(fetchSessions());
  }, []);

  function handleSubmit() {
    if (!hasValidBuyin) return;
    dispatch(createSession(form));
    setForm(EMPTY_FORM);
  }

  const totalProfit = entries.reduce((sum, e) => sum + e.profit, 0);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <FontAwesome name="list" size={28} color="#d4af37" style={{ marginBottom: 8 }} />
          <Text style={styles.pageTitle}>Sessions</Text>
          <Text style={styles.pageSubtitle}>Log and review your poker sessions</Text>
        </View>

        {/* Summary Bar */}
        {entries.length > 0 && (
          <View style={styles.summaryBar}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Sessions</Text>
              <Text style={styles.summaryValue}>{entries.length}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Profit</Text>
              <Text style={[styles.summaryValue, totalProfit >= 0 ? styles.profitWin : styles.profitLoss]}>
                {formatMoney(totalProfit)}
              </Text>
            </View>
          </View>
        )}

        {/* Input Form */}
        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Log Session</Text>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Date (e.g. 03/03/2026)"
              placeholderTextColor="#555"
              value={form.date}
              onChangeText={(v) => setField('date', v)}
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Stakes (e.g. 1/2 NL)"
              placeholderTextColor="#555"
              value={form.stakes}
              onChangeText={(v) => setField('stakes', v)}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Location"
              placeholderTextColor="#555"
              value={form.location}
              onChangeText={(v) => setField('location', v)}
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Duration (e.g. 4h 30m)"
              placeholderTextColor="#555"
              value={form.duration}
              onChangeText={(v) => setField('duration', v)}
            />
          </View>

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Total Buy-in ($) *"
              placeholderTextColor="#555"
              value={form.totalBuyins}
              onChangeText={(v) => setField('totalBuyins', v)}
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.inputHalf]}
              placeholder="Total Cash-out ($)"
              placeholderTextColor="#555"
              value={form.totalCashout}
              onChangeText={(v) => setField('totalCashout', v)}
              keyboardType="decimal-pad"
            />
          </View>

          {/* Live Profit Preview */}
          {hasValidBuyin && (
            <View style={styles.profitPreview}>
              <Text style={styles.profitPreviewLabel}>Profit</Text>
              <Text style={[styles.profitPreviewValue, liveProfit >= 0 ? styles.profitWin : styles.profitLoss]}>
                {formatMoney(liveProfit)}
              </Text>
            </View>
          )}

          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Notes"
            placeholderTextColor="#555"
            value={form.notes}
            onChangeText={(v) => setField('notes', v)}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={[styles.submitButton, !hasValidBuyin && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <FontAwesome name="plus" size={14} color="#0d1117" style={{ marginRight: 8 }} />
            <Text style={styles.submitButtonText}>Save Session</Text>
          </TouchableOpacity>
        </View>

        {/* Past Sessions */}
        {entries.length > 0 && (
          <View style={styles.entriesSection}>
            <Text style={styles.sectionTitle}>Past Sessions ({entries.length})</Text>
            {entries.map((entry) => (
              <SessionCard
                key={entry.id}
                entry={entry}
                onDelete={() => dispatch(removeSession(entry.id))}
              />
            ))}
          </View>
        )}

        {entries.length === 0 && (
          <Text style={styles.emptyText}>No sessions yet. Log your first session above.</Text>
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
    marginBottom: 20,
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
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#161b22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1e2a3a',
    marginBottom: 20,
    paddingVertical: 14,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#1e2a3a',
  },
  summaryLabel: {
    fontSize: 11,
    color: '#8b949e',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
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
  row: {
    flexDirection: 'row',
    gap: 8,
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
  inputHalf: {
    flex: 1,
  },
  notesInput: {
    height: 76,
    paddingTop: 10,
  },
  profitPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#1e2a3a',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  profitPreviewLabel: {
    fontSize: 13,
    color: '#8b949e',
  },
  profitPreviewValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d4af37',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 2,
  },
  submitButtonDisabled: {
    opacity: 0.4,
  },
  submitButtonText: {
    color: '#0d1117',
    fontWeight: '700',
    fontSize: 14,
  },
  entriesSection: {
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
    gap: 8,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardStakes: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  cardDate: {
    fontSize: 12,
    color: '#8b949e',
  },
  profitBadge: {
    fontSize: 15,
    fontWeight: '700',
  },
  profitWin: {
    color: '#3fb950',
  },
  profitLoss: {
    color: '#f85149',
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
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
  moneyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  moneyItem: {
    flex: 1,
    backgroundColor: '#0d1117',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  moneyLabel: {
    fontSize: 11,
    color: '#8b949e',
    marginBottom: 2,
  },
  moneyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#cdd9e5',
  },
  cardNotes: {
    fontSize: 13,
    color: '#cdd9e5',
    lineHeight: 18,
  },
  emptyText: {
    textAlign: 'center',
    color: '#3d4450',
    fontSize: 13,
    marginTop: 8,
  },
});
