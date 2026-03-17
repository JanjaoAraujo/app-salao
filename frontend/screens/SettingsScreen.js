import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import api from '../services/api';
import { Screen, Card, AppInput, AppButton } from '../components/UI';

export default function SettingsScreen() {
  const [professionalName, setProfessionalName] = useState('');
  const [businessName, setBusinessName] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/settings');
      setProfessionalName(res.data.professional_name || '');
      setBusinessName(res.data.business_name || '');
    } catch {}
  };

  const save = async () => {
    await api.post('/settings', {
      professional_name: professionalName,
      business_name: businessName,
    });
    Alert.alert('Salvo', 'Configurações salvas com sucesso.');
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen title="Configurações" subtitle="Seu nome e nome do salão">
      <Card>
        <AppInput value={professionalName} onChangeText={setProfessionalName} placeholder="Seu nome" />
        <AppInput value={businessName} onChangeText={setBusinessName} placeholder="Nome do salão" />
        <AppButton title="Salvar configurações" onPress={save} />
      </Card>
    </Screen>
  );
}
