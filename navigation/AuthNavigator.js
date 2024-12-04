import React from 'react';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import SignupScreen from '../Screens/Auth/SignupScreen';
import StartScreen from '../Screens/Auth/StartScreen';

const AuthStack = createStackNavigator();

function AuthNavigator({ setIsAuthenticated }) {
  return (
    <AuthStack.Navigator
      initialRouteName="Start"
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="Start">
        {(props) => <StartScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </AuthStack.Screen>
      

      <AuthStack.Screen name="Signup">
        {(props) => <SignupScreen {...props} setIsAuthenticated={setIsAuthenticated} />}
      </AuthStack.Screen>

    </AuthStack.Navigator>
  );
}

export default AuthNavigator;
