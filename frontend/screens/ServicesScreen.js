import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Alert } from 'react-native';
import api from '../services/api';
import { Screen, Card, AppInput, AppButton } from '../components/UI';

export default function ServicesScreen() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch {
      setServices([]);
    }
  };

  const clearForm = () => {
    setName('');
    setDuration('');
    setPrice('');
    setEditingId(null);
  };

  const save = async () => {
    if (!name || !duration || !price) {
      Alert.alert('Atenção', 'Preencha nome, duração e preço.');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/services/${editingId}`, {
          name,
          duration_minutes: Number(duration),
          price: Number(price),
        });
        Alert.alert('Sucesso', 'Serviço atualizado com sucesso.');
      } else {
        await api.post('/services', {
          name,
          duration_minutes: Number(duration),
          price: Number(price),
        });
        Alert.alert('Sucesso', 'Serviço cadastrado com sucesso.');
      }

      clearForm();
      load();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o serviço.');
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setName(item.name || '');
    setDuration(String(item.duration_minutes || ''));
    setPrice(String(item.price || ''));
  };

  const removeService = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      load();
      if (editingId === id) {
        clearForm();
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir o serviço.');
    }
  };

  const confirmDelete = (id, serviceName) => {
    Alert.alert(
      'Excluir serviço',
      `Deseja realmente excluir o serviço ${serviceName}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => removeService(id) },
      ]
    );
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen title="Serviços" subtitle="Organize seus atendimentos e preços">
      <FlatList
        ListHeaderComponent={
          <View>
            <Card>
              <AppInput
                value={name}
                onChangeText={setName}
                placeholder="Nome do serviço"
              />
              <AppInput
                value={duration}
                onChangeText={setDuration}
                placeholder="Duração em minutos"
                keyboardType="numeric"
              />
              <AppInput
                value={price}
                onChangeText={setPrice}
                placeholder="Preço"
                keyboardType="numeric"
              />
              <AppButton
                title={editingId ? 'Atualizar serviço' : 'Salvar serviço'}
                onPress={save}
              />
              {editingId ? (
                <AppButton
                  title="Cancelar edição"
                  secondary
                  onPress={clearForm}
                />
              ) : null}
            </Card>

            <Text style={{ marginVertical: 8, color: '#71718C', fontWeight: '600' }}>
              Serviços cadastrados
            </Text>
          </View>
        }
        data={services}
        keyExtractor={(item, index) => item._id || String(index)}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontSize: 17, fontWeight: '700' }}>{item.name}</Text>
            <Text style={{ marginTop: 6, color: '#44445A' }}>
              {item.duration_minutes} min
            </Text>
            <Text style={{ marginTop: 4, color: '#7C3AED', fontWeight: '700' }}>
              R$ {Number(item.price || 0).toFixed(2)}
            </Text>

            <AppButton
              title="Editar serviço"
              onPress={() => startEdit(item)}
            />
            <AppButton
              title="Excluir serviço"
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