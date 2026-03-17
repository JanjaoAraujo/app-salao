import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

export function Screen({ title, subtitle, children, right }) {
  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {children}
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function StatCard({ label, value }) {
  return (
    <Card style={{ flex: 1 }}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </Card>
  );
}

export function AppButton({ title, onPress, secondary }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, secondary && styles.buttonSecondary]}>
      <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{title}</Text>
    </TouchableOpacity>
  );
}

export function AppInput({ value, onChangeText, placeholder, keyboardType = 'default' }) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType}
      style={styles.input}
      placeholderTextColor="#9B9BB0"
    />
  );
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F7F7FB',
    paddingHorizontal: 16,
    paddingTop: 54,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    marginTop: 4,
    color: '#71718C',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    marginBottom: 12,
  },
  statLabel: {
    color: '#71718C',
    fontSize: 13,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  button: {
    backgroundColor: '#7C3AED',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonSecondary: {
    backgroundColor: '#EFEAFE',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  buttonTextSecondary: {
    color: '#7C3AED',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ECECF4',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 10,
    fontSize: 15,
    color: '#1A1A1A',
  },
});
