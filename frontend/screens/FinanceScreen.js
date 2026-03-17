import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Alert } from 'react-native';
import api from '../services/api';
import { Screen, Card, AppInput, AppButton, StatCard } from '../components/UI';

export default function FinanceScreen() {
  const [records, setRecords] = useState([]);
  const [type, setType] = useState('entrada');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [summary, setSummary] = useState({ balance: 0, income: 0, expense: 0 });

  const load = async () => {
    try {
      const [r, s] = await Promise.all([api.get('/finance'), api.get('/finance/summary')]);
      setRecords(r.data);
      setSummary(s.data);
    } catch {
      setRecords([]);
    }
  };

  const save = async () => {
    if (!description || !amount) {
      Alert.alert('Atenção', 'Preencha descrição e valor.');
      return;
    }
    await api.post('/finance', {
      type,
      description,
      amount: Number(amount),
    });
    setDescription('');
    setAmount('');
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen title="Caixa" subtitle="Controle de entradas e saídas">
      <FlatList
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <StatCard label="Saldo" value={`R$ ${summary.balance.toFixed(2)}`} />
              <StatCard label="Entradas" value={`R$ ${summary.income.toFixed(2)}`} />
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <StatCard label="Saídas" value={`R$ ${summary.expense.toFixed(2)}`} />
              <Card style={{ flex: 1 }}>
                <Text style={{ color: '#71718C' }}>Tipo atual</Text>
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#1A1A1A' }}>{type}</Text>
              </Card>
            </View>

            <Card>
              <Text style={{ marginBottom: 10, fontWeight: '700' }}>Novo lançamento</Text>
              <AppButton title={type === 'entrada' ? 'Trocar para saída' : 'Trocar para entrada'} secondary onPress={() => setType(type === 'entrada' ? 'saida' : 'entrada')} />
              <AppInput value={description} onChangeText={setDescription} placeholder="Descrição" />
              <AppInput value={amount} onChangeText={setAmount} placeholder="Valor" keyboardType="numeric" />
              <AppButton title="Salvar lançamento" onPress={save} />
            </Card>

            <Text style={{ marginVertical: 8, color: '#71718C', fontWeight: '600' }}>Histórico</Text>
          </View>
        }
        data={records}
        keyExtractor={(item, index) => item._id || String(index)}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontSize: 17, fontWeight: '700' }}>{item.description}</Text>
            <Text style={{ marginTop: 6, color: '#71718C' }}>{item.type}</Text>
            <Text style={{ marginTop: 4, color: item.type === 'entrada' ? '#16A34A' : '#DC2626', fontWeight: '700' }}>
              R$ {Number(item.amount || 0).toFixed(2)}
            </Text>
          </Card>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
