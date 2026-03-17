import { Linking, Alert } from 'react-native';

export const sendWhatsApp = async (phone, message) => {
  try {
    const cleanPhone = String(phone).replace(/\D/g, '');
    const url = `whatsapp://send?phone=55${cleanPhone}&text=${encodeURIComponent(message)}`;
    const supported = await Linking.canOpenURL(url);
    if (!supported) {
      Alert.alert('WhatsApp não encontrado', 'Instale o WhatsApp no celular para enviar a mensagem.');
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Erro', 'Não foi possível abrir o WhatsApp.');
  }
};

export const reminderTemplate = ({ clientName, serviceName, dateText, timeText, professionalName }) =>
  `Olá, ${clientName}. Estou passando para lembrar que você tem um horário marcado para ${serviceName} em ${dateText} às ${timeText}. Aguardo sua presença, ${professionalName}.`;

export const confirmationTemplate = ({ clientName, serviceName, dateText, timeText, professionalName }) =>
  `Olá, ${clientName}. Você tem um horário marcado para ${serviceName} em ${dateText} às ${timeText}. Podemos confirmar o seu horário? Obrigado, ${professionalName}.`;

export const thanksTemplate = ({ clientName }) =>
  `Olá, ${clientName}. Obrigado pela sua visita. Fiquei feliz em te atender, espero te ver novamente em breve.`;
