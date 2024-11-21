import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Image } from 'react-native';
import WalletModal from '../Screens/Modals/WalletScreen';
import FavoriteModal from '../Screens/Modals/FavoriteScreen';
import TrashModal from '../Screens/Modals/TrashScreen';
import ShareModal from '../Screens/Modals/ShareScreen';
import PlanModal from '../Screens/Modals/PlanScreen';
import SettingModal from '../Screens/Modals/SettingScreen';
import HelpModal from '../Screens/Modals/HelpScreen';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../Components/Colors';
import * as Progress from 'react-native-progress';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';


export default function CustomDrawerContent({ navigation, setIsAuthenticated }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [CurrentModalComponent, setCurrentModalComponent] = useState(null);

  const openModal = (ModalComponent) => {
    setCurrentModalComponent(() => ModalComponent);
    setModalVisible(true);
    navigation.closeDrawer();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1}}>
            <View style={{flex: 1}}>

                <View style={styles.titleContainer}>
                    <Image
                        source={require('../assets/images/camell_logo.png')}
                        style={styles.logoImage}
                    />
                    <Text style={styles.titleText}>Camell Drive</Text>
                </View>

                <View style={styles.menuMainContainer}>
                    <Pressable style={({pressed}) => 
                        pressed 
                            ? [styles.items, styles.pressed] 
                            : styles.items
                        } onPress={() => openModal(WalletModal)}
                    >
                        <IconM name="wallet" size={24} color={Colors.drawerIcon} style={styles.iconStyle}/>
                        <Text style={styles.itemText}>Wallet</Text>
                    </Pressable>
                </View>

                <View style={styles.menuMainContainer}>
                    <Pressable style={({pressed}) => 
                        pressed 
                            ? [styles.items, styles.pressed] 
                            : styles.items
                        } onPress={() => openModal(FavoriteModal)}
                    >
                        <IconM name="star" size={24} color={Colors.drawerIcon} style={styles.iconStyle}/>
                        <Text style={styles.itemText}>Favorite</Text>
                    </Pressable>
                    <Pressable style={({pressed}) => 
                        pressed 
                            ? [styles.items, styles.pressed] 
                            : styles.items
                        } onPress={() => openModal(ShareModal)}
                    >
                        <IconM name="share" size={24} color={Colors.drawerIcon} style={styles.iconStyle}/>
                        <Text style={styles.itemText}>Share</Text>
                    </Pressable>
                    <Pressable style={({pressed}) => 
                        pressed 
                            ? [styles.items, styles.pressed] 
                            : styles.items
                        } onPress={() => openModal(TrashModal)}
                    >
                        <IconM name="trash-can" size={24} color={Colors.drawerIcon} style={styles.iconStyle}/>
                        <Text style={styles.itemText}>Trash</Text>
                    </Pressable>
                </View>

                <View style={styles.menuSubContainer}>
                    <Pressable style={({pressed}) => 
                        pressed 
                            ? [styles.items, styles.pressed] 
                            : styles.items
                        } onPress={() => openModal(SettingModal)}
                    >
                        <IconM name="cog" size={24} color={Colors.drawerIcon} style={styles.iconStyle}/>
                        <Text style={styles.itemText}>Setting</Text>
                    </Pressable>
                    <Pressable style={({pressed}) => 
                        pressed 
                            ? [styles.items, styles.pressed] 
                            : styles.items
                        } onPress={() => openModal(HelpModal)}
                    >
                        <IconM name="help-circle" size={24} color={Colors.drawerIcon} style={styles.iconStyle}/>
                        <Text style={styles.itemText}>Help</Text>
                    </Pressable>
                </View>

                <View style={styles.storageContainer}>
                    <View style={styles.storageItem}>
                        <IconM name="cloud" color={Colors.drawerIcon} size={24} style={styles.iconStyle}/>
                        <Text style={styles.itemText}>Storage</Text>
                    </View>
                    <Progress.Bar
                        progress={30 / 100}
                        width={250}
                        height={3}
                        color={Colors.primary400}
                        style={{ marginTop: 10, marginBottom: 5, }}
                    />
                    <View style={styles.progressItems}>
                        <Text style={styles.progressItemText}>300MB / 1GB</Text>
                        <Pressable style={({pressed}) => 
                            pressed 
                                ? [styles.upgradeButton, styles.pressed] 
                                : styles.upgradeButton
                            }  onPress={() => openModal(PlanModal)}
                        >
                            <Text style={styles.upgradeButtonText}>Upgrade</Text>
                        </Pressable>
                    </View>
                </View>

                <View style={styles.logoutContainer}>
                    <Pressable style={({pressed}) => 
                        pressed 
                            ? [styles.items, styles.pressed] 
                            : styles.items
                        }            
                        onPress={() => {
                            setIsAuthenticated(false);
                        }}
                    >
                        <IconM name="logout" size={24} color={Colors.drawerIcon} style={styles.logoutIcon}/>
                        <Text style={styles.itemText}>Logout</Text>
                    </Pressable>
                </View>
            </View>

        {/* 모달 */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >
            {CurrentModalComponent && <CurrentModalComponent closeModal={closeModal} />}
        </Modal>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
    titleContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        height: 60,
        paddingLeft: 15,
        borderBottomWidth: 0.3,
      },
    logoImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
      },
      titleText: {
        fontSize: 20,
        margin: 10,
      },
      menuMainContainer: {
        marginTop: 10,
        borderBottomWidth: 0.2,
      },
      items: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10

      },
      menuSubContainer: {
        marginTop: 15,
      },
      storageContainer: {
        borderBottomWidth: 0.2,
        paddingBottom: 10,
        alignItems: 'center',
      },
      storageItem: {
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10
      },

      progressItems: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        width: '100%'
      },
      progressItemText: {
        fontSize: 12,
        color: Colors.drawerIcon
      },

      upgradeButton: {
        backgroundColor: Colors.primary400,
        borderRadius: 8,
        width: 100,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
      },

      upgradeButtonText: {
        fontSize: 13,
        color: 'white',
        fontWeight: '700'
      },
      iconStyle: {
        marginRight: 15,
      },
      logoutIcon : {
        
      },
      itemText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.drawerIcon
      },
      pressed: {
        opacity: 0.4
      },
      logoutContainer: {
        alignItems: 'center',
        marginTop: 10,
        right: 10
      }
});
