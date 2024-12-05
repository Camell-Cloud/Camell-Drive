import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StartPage from '../Screens/StartPage/StartPage';
import LoginPage from '../Screens/LoginScreen/LoginScreen';
import HomeScreen from '../Screens/Home/HomeScreen';

const Stack = createStackNavigator();

function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Start">
      <Stack.Screen name="Start" component={StartPage} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default Navigation;