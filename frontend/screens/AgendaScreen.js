import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import api from '../services/api';
import { Screen, Card, AppInput, AppButton } from '../components/UI';
import { sendWhatsApp, reminderTemplate, confirmationTemplate } from '../utils/whatsapp';

export default function AgendaScreen() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [time, setTime] = useState('');
  const [professionalName, setProfessionalName] = useState('Profissional');

  const load = async () => {
    try {
      const [a, s] = await Promise.all([
        api.get('/appointments'),
        api.get('/settings')
      ]);
      setAppointments(a.data);
      if (s.data?.professional_name) {
        setProfessionalName(s.data.professional_name);
      }
    } catch {
      setAppointments([]);
    }
  };

  const save = async () => {
    if (!selectedDate || !clientName || !serviceName || !time) {
      Alert.alert('Atenção', 'Preencha data, cliente, serviço e hora.');
      return;
    }
    await api.post('/appointments', {
      date: selectedDate,
      client_name: clientName,
      phone,
      service_name: serviceName,
      time,
      status: 'pendente',
    });
    setClientName('');
    setPhone('');
    setServiceName('');
    setTime('');
    load();
  };

  const removeAppointment = async (id) => {
    try {
      await api.delete(`/appointments/${id}`);
      load();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível excluir o agendamento.');
    }
  };

  const confirmDelete = (id, client) => {
    Alert.alert(
      'Excluir agendamento',
      `Deseja realmente excluir o agendamento de ${client}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => removeAppointment(id) },
      ]
    );
  };

  const sendReminder = (item) => {
    const message = reminderTemplate({
      clientName: item.client_name,
      serviceName: item.service_name,
      dateText: item.date,
      timeText: item.time,
      professionalName,
    });
    sendWhatsApp(item.phone, message);
  };

  const sendConfirmation = (item) => {
    const message = confirmationTemplate({
      clientName: item.client_name,
      serviceName: item.service_name,
      dateText: item.date,
      timeText: item.time,
      professionalName,
    });
    sendWhatsApp(item.phone, message);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Screen title="Agenda" subtitle="Cadastre horários e envie mensagens">
      <FlatList
        ListHeaderComponent={
          <View>
            <Card>
              <Calendar
                onDayPress={(day) => setSelectedDate(day.dateString)}
                markedDates={
                  selectedDate
                    ? { [selectedDate]: { selected: true, selectedColor: '#7C3AED' } }
                    : {}
                }
              />
            </Card>

            <Card>
              <Text style={{ marginBottom: 10, fontWeight: '700' }}>Novo agendamento</Text>
              <AppInput value={clientName} onChangeText={setClientName} placeholder="Nome do cliente" />
              <AppInput value={phone} onChangeText={setPhone} placeholder="Telefone do cliente" keyboardType="phone-pad" />
              <AppInput value={serviceName} onChangeText={setServiceName} placeholder="Serviço" />
              <AppInput value={time} onChangeText={setTime} placeholder="Hora (ex: 14:30)" />
              <AppButton title={`Salvar em ${selectedDate || 'selecione a data'}`} onPress={save} />
            </Card>

            <Text style={{ marginVertical: 8, color: '#71718C', fontWeight: '600' }}>
              Agendamentos
            </Text>
          </View>
        }
        data={appointments}
        keyExtractor={(item, index) => item._id || String(index)}
        renderItem={({ item }) => (
          <Card>
            <Text style={{ fontSize: 17, fontWeight: '700' }}>{item.client_name}</Text>
            <Text style={{ marginTop: 6, color: '#44445A' }}>{item.service_name}</Text>
            <Text style={{ marginTop: 4, color: '#71718C' }}>
              {item.date} às {item.time}
            </Text>
            <Text style={{ marginTop: 4, color: '#7C3AED', fontWeight: '700' }}>
              {item.status}
            </Text>

            <AppButton title="Enviar lembrete no WhatsApp" onPress={() => sendReminder(item)} />
            <AppButton title="Pedir confirmação" secondary onPress={() => sendConfirmation(item)} />
            <AppButton
              title="Excluir agendamento"
              secondary
              onPress={() => confirmDelete(item._id, item.client_name)}
            />
          </Card>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}