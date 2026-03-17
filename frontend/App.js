import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import ClientsScreen from './screens/ClientsScreen';
import AgendaScreen from './screens/AgendaScreen';
import ServicesScreen from './screens/ServicesScreen';
import FinanceScreen from './screens/FinanceScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F7F7FB',
    card: '#FFFFFF',
    text: '#1A1A1A',
    primary: '#7C3AED',
    border: '#E9E9F1',
  }
};

function getTabIcon(routeName, color, size) {
  if (routeName === 'Home') {
    return <MaterialCommunityIcons name="view-dashboard-outline" size={size} color={color} />;
  }
  if (routeName === 'Clientes') {
    return <MaterialCommunityIcons name="account-group-outline" size={size} color={color} />;
  }
  if (routeName === 'Agenda') {
    return <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} />;
  }
  if (routeName === 'Serviços') {
    return <MaterialCommunityIcons name="content-cut" size={size} color={color} />;
  }
  if (routeName === 'Caixa') {
    return <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />;
  }
  if (routeName === 'Config') {
    return <MaterialCommunityIcons name="cog-outline" size={size} color={color} />;
  }

  return <MaterialCommunityIcons name="circle-outline" size={size} color={color} />;
}

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            height: 64,
            paddingBottom: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: '#ECECF4',
          },
          tabBarActiveTintColor: '#7C3AED',
          tabBarInactiveTintColor: '#8B8BA3',
          tabBarIcon: ({ color, size }) => getTabIcon(route.name, color, size),
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Clientes" component={ClientsScreen} />
        <Tab.Screen name="Agenda" component={AgendaScreen} />
        <Tab.Screen name="Serviços" component={ServicesScreen} />
        <Tab.Screen name="Caixa" component={FinanceScreen} />
        <Tab.Screen name="Config" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}