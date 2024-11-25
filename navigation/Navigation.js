import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../Screens/HomeScreen';
import FileScreen from '../Screens/FileScreen';
import MediaScreen from '../Screens/MediaScreen';
import IconI from 'react-native-vector-icons/Ionicons';
import Colors from '../Components/Colors';
import CustomDrawerContent from './CustomDrawerContent';
import AuthNavigator from './AuthNavigator';
import { useState } from 'react';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


function DrawerNavigator({setIsAuthenticated}) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} setIsAuthenticated={setIsAuthenticated} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 260,
        },
      }}
    >
      <Drawer.Screen name="Tabs" component={TabNavigator} />
      <Drawer.Screen name="Auth" component={AuthNavigator} />
    </Drawer.Navigator>
  );
}

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 80,
        },
      }}
    >

    <Tab.Screen
      name="File"
      component={FileScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <IconI
            name={focused ? 'document-text' : 'document-text-outline'}
            size={27}
            color={focused ? Colors.primary400 : 'black'} // focused 상태에 따라 색상 변경
          />
        ),
      }}
    />
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <IconI
            name={focused ? 'home-sharp' : 'home-outline'}
            size={25}
            color={focused ? Colors.primary400 : 'black'} // focused 상태에 따라 색상 변경
          />
        ),
      }}
    />
    <Tab.Screen
      name="Media"
      component={MediaScreen}
      options={{
        tabBarIcon: ({ focused }) => (
          <IconI
            name={focused ? 'images' : 'images-outline'}
            size={25}
            color={focused ? Colors.primary400 : 'black'} // focused 상태에 따라 색상 변경
          />
        ),
      }}
    />

    </Tab.Navigator>
  );
}

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <NavigationContainer>
      {isAuthenticated ? ( <DrawerNavigator setIsAuthenticated={setIsAuthenticated} /> ) : ( <AuthNavigator setIsAuthenticated={setIsAuthenticated} /> )}
    </NavigationContainer>
  );
  
}