import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import { CardStyleInterpolators } from '@react-navigation/stack';
import { Colors } from '../Utils/colors';
import FileScreen from '../screens/FileScreen';
import MediaScreen from '../screens/MediaScreen';
import HomeScreen from '../Home/HomeScreen';
import TabScreenHeader from './TabScreenHeader';
import FavoriteScreen from '../screens/FavoriteScreen';
import ShareScreen from '../screens/ShareScreen';
import BinScreen from '../screens/BinScreen';
import SubTabScreenHeader from './SubTabScreenHeader';

const Tab = createBottomTabNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Plus') return <PlusMenu />;
          const iconName = getIconName(route.name, focused);
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: { fontSize: 12 },
        tabBarActiveTintColor: Colors.themcolor,
      })}
    >

      <Tab.Screen 
        name="Share" 
        component={ShareScreen} 
        options={{
          tabBarButton: () => null,
          tabBarLabel: 'Share',
          headerTitle: 'Share',
          header: ({ navigation }) => <TabScreenHeader title="Share" navigation={navigation} />
        }}
      />
      <Tab.Screen 
        name="Bin" 
        component={BinScreen} 
        options={{
          tabBarButton: () => null,
          tabBarLabel: 'Trash',
          headerTitle: 'Trash',
          header: ({ navigation }) => <TabScreenHeader title="Trash" navigation={navigation} />
        }}
      />
      <Tab.Screen 
        name="Favorite" 
        component={FavoriteScreen} 
        options={{
          tabBarButton: () => null,
          tabBarLabel: 'Favorite',
          headerTitle: 'Favorite',
          header: ({ navigation }) => <TabScreenHeader title="Favorite" navigation={navigation} />
        }}
      />
      <Tab.Screen 
        name="File" 
        component={FileScreen} 
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          tabBarLabel: 'File',
          headerTitle: 'File',
          header: ({ navigation }) => <TabScreenHeader title="File" navigation={navigation} />
        }}
      />
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerTitle: 'Home',
          header: ({ navigation }) => <SubTabScreenHeader title="Home" navigation={navigation} />
        }}
      />

      <Tab.Screen 
        name="Media" 
        component={MediaScreen} 
        options={{
          tabBarLabel: 'Media',
          headerTitle: 'Media',
          header: ({ navigation }) => <TabScreenHeader title="Media" navigation={navigation} />
        }}
      />
    </Tab.Navigator>
  );
}

function getIconName(routeName, focused) {
  const iconMap = {
    File: focused ? 'document' : 'document-outline',
    Media: focused ? 'images' : 'images-outline',
    Home: 'home'
  };
  return iconMap[routeName] || 'alert-circle-outline';
}

const styles = StyleSheet.create({
  viewModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
  }

});

export default Tabs;