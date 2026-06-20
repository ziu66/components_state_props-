import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  count: number;
  onAdd: () => void;
  onMinus: () => void;
  onReset: () => void;
};

export default function CounterDisplay({ count, onAdd, onMinus, onReset }: Props) {
  return (
    <View style={styles.childWrapper}>
      <Text style={styles.childLabel}>ITO ANG CHILD COMPONENT (CounterDisplay)</Text>

      <View style={styles.childBox}>
        <Text style={styles.childTitle}>Ako ang Child Component</Text>

        <Text style={styles.propsDown}>⬇️ PROPS DATA (Galing sa Parent State)</Text>
        <View style={styles.verticalLine} />

        <Text style={styles.countText}>{count}</Text>

        <View style={styles.verticalLine} />
        <Text style={styles.propsUp}>⬆️ PROPS FUNCTION (Triggers Parent State)</Text>

        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.btnText}>Add Count</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.minusBtn} onPress={onMinus}>
          <Text style={styles.btnText}>Minus Count</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
          <Text style={styles.btnText}>Reset Count</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  childWrapper: {
    borderWidth: 2,
    borderColor: '#5B5BD6',
    borderRadius: 12,
    marginTop: 12,
    overflow: 'hidden',
  },
  childLabel: {
    backgroundColor: '#5B5BD6',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  childBox: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    alignItems: 'center',
  },
  childTitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  propsDown: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
  },
  propsUp: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 16,
  },
  verticalLine: {
    width: 2,
    height: 20,
    backgroundColor: '#2563EB',
    marginVertical: 4,
  },
  countText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#111',
    marginVertical: 8,
  },
  addBtn: {
    backgroundColor: '#E91E8C',
    borderRadius: 30,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  minusBtn: {
    backgroundColor: '#E53935',
    borderRadius: 30,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  resetBtn: {
    backgroundColor: '#9E9E9E',
    borderRadius: 30,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});