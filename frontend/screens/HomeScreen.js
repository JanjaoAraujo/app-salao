import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import api from '../services/api';
import { Screen, StatCard, Card, AppButton } from '../components/UI';

export default function HomeScreen() {
  const [summary, setSummary] = useState({
    todayRevenue: 0,
    monthRevenue: 0,
    clientsCount: 0,
    appointmentsToday: 0,
  });

  const load = async () => {
    try {
      const res = await api.get('/dashboard');
      setSummary(res.data);
    } catch (e) {
      setSummary({
        todayRevenue: 0,
        monthRevenue: 0,
        clientsCount: 0,
        appointmentsToday: 0,
      });
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen title="Meu salão" subtitle="Visão geral do seu negócio hoje">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCard label="Hoje" value={`R$ ${summary.todayRevenue.toFixed(2)}`} />
          <StatCard label="Mês" value={`R$ ${summary.monthRevenue.toFixed(2)}`} />
        </View>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <StatCard label="Clientes" value={String(summary.clientsCount)} />
          <StatCard label="Atend. hoje" value={String(summary.appointmentsToday)} />
        </View>

        <Card>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 6 }}>Ações rápidas</Text>
          <Text style={{ color: '#71718C', marginBottom: 12 }}>
            Use essas ações para organizar seu dia mais rápido.
          </Text>
          <AppButton title="Atualizar dashboard" onPress={load} />
        </Card>

        <Card>
          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Resumo</Text>
          <Text style={{ color: '#71718C', lineHeight: 22 }}>
            Esse app foi montado para um salão de beleza de uso individual, com foco em agendamentos,
            clientes, serviços, faturamento e caixa.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}
