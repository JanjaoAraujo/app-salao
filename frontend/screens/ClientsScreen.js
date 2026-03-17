import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Alert } from 'react-native';
import api from '../services/api';
import { Screen, Card, AppInput, AppButton } from '../components/UI';

export default function ClientsScreen() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  const load = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (e) {
      setClients([]);
    }
  };

  const save = async () => {
    if (!name || !phone) {
      Alert.alert('Atenção', 'Preencha nome e telefone.');
      return;
    }
    await api.post('/clients', { name, phone, notes });
    setName('');
    setPhone('');
    setNotes('');
    load();
  };

  const removeClient = async (id) => {
    try {
      await api.delete(`/clients/${id}`);
      load();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir o cliente.');
    }
  };

  const confirmDelete = (id, clientName) => {
    Alert.alert(
      'Excluir cliente',
      `Deseja realmente excluir ${clientName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => removeClient(id) },
      ]
    );
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen title="Clientes" subtitle="Cadastre e consulte seus clientes">
      <FlatList
        ListHeaderComponent={
          <View>
            <Card>
              <AppInput value={name} onChangeText={setName} placeholder="Nome do cliente" />
              <AppInput value={phone} onChangeText={setPhone} placeholder="Telefone" keyboardType="phone-pad" />
              <AppInput value={notes} onChangeText={setNotes} placeholder="Observações / preferências" />
              <AppButton title="Salvar cliente" onPress={save} />
            </Card>
            <Text style={{ marginVertical: 8, color: '#71718C', fontWeight: '600' }}>
              Lista de clientes
            </Text>
          </View>
        }
        data={clients}
        keyExtractor={(item, index) => item._id || String(index)}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontSize: 17, fontWeight: '700' }}>{item.name}</Text>
            <Text style={{ marginTop: 6, color: '#44445A' }}>{item.phone}</Text>
            {!!item.notes && (
              <Text style={{ marginTop: 6, color: '#71718C' }}>{item.notes}</Text>
            )}

            <AppButton
              title="Excluir cliente"
              secondary
              onPress={() => confirmDelete(item._id, item.name)}
            />
          </Card>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
