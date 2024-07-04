import React, { useEffect, useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, Animated, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Progress from 'react-native-progress';
import { Colors } from '../Utils/colors';
import WalletScreen from '../screens/WalletScreen';
import HelpScreen from '../screens/HelpScreen';
import SettingScreen from '../screens/SettingScreen';
import UpgradePlanScreen from '../screens/UpgradePlanScreen';
import Tabs from './Tabs';
import { NavigationContainer } from '@react-navigation/native';
import ChartScreen from '../screens/ChartScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@clerk/clerk-expo';

const Drawer = createDrawerNavigator();

const totalStorage = 10;

const DrawerMenu = () => {
  const { isSignedIn, signOut } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      props.navigation.navigate('SignIn');
    }
  }, [isSignedIn]);

  if (!isSignedIn) {
    return null;
  }

  return (
    <NavigationContainer independent={true}>
      <Drawer.Navigator
        initialRouteName="Tabs"
        screenOptions={{
          headerShown: false,
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen
          name="Tabs"
          component={Tabs}
          options={{
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="ChartScreen"
          component={ChartScreen}
          options={{
            drawerLabel: 'Market Price',
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="HelpScreen"
          component={HelpScreen}
          options={{
            drawerLabel: 'Customer Support',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="Wallet"
          component={WalletScreen}
          options={{
            drawerLabel: 'Wallet',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="UpgradePlanScreen"
          component={UpgradePlanScreen}
          options={{
            drawerLabel: 'Plan',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
        <Drawer.Screen
          name="SettingScreen"
          component={SettingScreen}
          options={{
            drawerLabel: 'Setting',
            headerShown: false,
            drawerItemStyle: { display: 'none' },
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const CustomDrawerContent = (props) => {
  const { signOut } = useAuth();
  const [storageUsage, setStorageUsage] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);

  const usedStorage = storageUsage / (1024 * 1024 * 1024); // Convert bytes to GB
  const percentage = Math.round((usedStorage / totalStorage) * 100);

  useEffect(() => {
    const fetchWalletAddress = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        console.error('No email found in storage');
        return;
      }

      try {
        const response = await fetch('http://13.124.248.7:8080/api/get-wallet-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        if (data.success) {
          setWalletAddress(data.address);
        } else {
          console.error('Error fetching wallet address:', data.error);
        }
      } catch (error) {
        console.error('API error:', error);
      }
    };

    fetchWalletAddress();
  }, []);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchStorageUsage = async () => {
      try {
        const response = await fetch(`http://13.124.248.7:2003/api/get-storage-usage?walletAddress=${walletAddress}`);
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          if (data.totalSize !== undefined) {
            setStorageUsage(data.totalSize);
          } else {
            console.error('Error fetching storage usage:', data.error);
          }
        } else {
          const errorText = await response.text();
          console.error('Error fetching storage usage:', errorText);
        }
      } catch (error) {
        console.error('API error:', error);
      }
    };

    fetchStorageUsage();
  }, [walletAddress]);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Do you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await signOut();
              await AsyncStorage.removeItem('userEmail');
              await AsyncStorage.setItem('isLoggedIn', 'false');
            } catch (error) {
              console.error('Failed to sign out', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={styles.drawerSafeArea}>
        <View style={styles.titleContainer}>
          <Image
            source={require('../../../assets/images/camell_logo.png')}
            style={styles.logo}
          />
          <Text style={styles.drawerTitle}>Camell Drive</Text>
        </View>
        <DrawerItemList {...props} />

        <View style={styles.menuItem}>
          <DrawerItem
            label="Home"
            onPress={() => props.navigation.navigate('Home')}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            )}
            style={styles.items}
          />
          <DrawerItem
            label="Wallet"
            onPress={() => props.navigation.navigate('Wallet')}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="wallet" color={color} size={size} />
            )}
            style={styles.items}
          />
        </View>

        <View style={styles.menuItem}>
          <DrawerItem
            label="File"
            onPress={() => props.navigation.navigate('File')}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="file" color={color} size={size} />
            )}
            style={styles.items}
          />
          <DrawerItem
            label="Media"
            onPress={() => props.navigation.navigate('Media')}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="image" color={color} size={size} />
            )}
            style={styles.items}
          />
          <DrawerItem
            label="Favorite"
            // onPress={() => props.navigation.navigate('Favorite')}
            onPress={() => alert('To be updated...')}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="star" color={color} size={size} />
            )}
            style={styles.items}
          />
          <DrawerItem
            label="Share"
            onPress={() => props.navigation.navigate('Share')}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="share" color={color} size={size} />
            )}
            style={styles.items}
          />
          <DrawerItem
            label="Trash"
            onPress={() => props.navigation.navigate('Bin')}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="trash-can" color={color} size={size} />
            )}
            style={styles.items}
          />
        </View>

        <View style={styles.menuItem2}>
          <DrawerItem
            label="Setting"
            onPress={() => props.navigation.navigate('SettingScreen')}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="cog" color={color} size={size} />
            )}
            style={styles.items}
          />
          <DrawerItem
            label="Customer Support"
            onPress={() => props.navigation.navigate('HelpScreen')}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="help-circle" color={color} size={size} />
            )}
            style={styles.items}
          />
          <View style={styles.customDrawerItem}>
            <View style={styles.drawerItemHeader}>
              <MaterialCommunityIcons name="cloud" color="rgba(28, 28, 30, 0.68)" size={24} />
              <Text style={styles.drawerItemLabel}>Storage</Text>
            </View>
            <Progress.Bar
              progress={percentage / 100}
              width={250}
              height={3}
              color={Colors.themcolor}
              style={{ marginTop: 5 }}
            />
            <View style={styles.progressItems}>
              <Text style={styles.progressItemText}>{usedStorage.toFixed(2)} / {totalStorage} ({percentage}%)</Text>
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => props.navigation.navigate('UpgradePlanScreen')}
              >
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.menuItem3}>
          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            icon={({ color, size }) => (
              <MaterialCommunityIcons name="logout" color={color} size={size} />
            )}
            style={styles.items}
          />
        </View>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerSafeArea: {
    flex: 1,
  },
  drawerTitle: {
    fontSize: 20,
    margin: 10,
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 60,
    paddingLeft: 15,
    borderBottomWidth: 0.3,
  },
  menuItem: {
    marginTop: 10,
    borderBottomWidth: 0.2,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  items: {
    height: 45,
  },
  menuItem2: {
    marginTop: 15,
  },
  customDrawerItem: {
    marginTop: 2,
    borderBottomWidth: 0.2,
    paddingVertical: 10,
    alignItems: 'center',
  },
  drawerItemHeader: {
    flexDirection: 'row',
    marginLeft: 18,
    marginRight: 155,
    marginBottom: 15,
    alignItems: 'center',
  },
  drawerItemLabel: {
    fontSize: 14,
    marginLeft: 30,
    color: 'rgba(28, 28, 30, 0.68)',
  },
  progressBar: {
    width: '100%',
    height: 3,
  },
  progressItems: {
    flexDirection: 'row',
    marginTop: 10,
  },
  progressItemText: {
    fontSize: 12,
  },
  upgradeButton: {
    backgroundColor: Colors.themcolor,
    borderRadius: 8,
    width: 100,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 45,
  },
  upgradeButtonText: {
    fontSize: 13,
    color: 'white',
  },
  menuItem3: {
    marginTop: 15,
  },
});

export default DrawerMenu;
