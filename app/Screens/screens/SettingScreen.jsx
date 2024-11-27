import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, Keyboard, TouchableWithoutFeedback, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../Utils/colors';
import SubTabScreenHeader from '../main/SubTabScreenHeader';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';




export default function SettingScreen({ navigation }) {

  

  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('언어');

  const handleSubmit = () => {
    alert('To be updated');
  };

  // 다크모드 스위치 토글 함수
  const toggleSwitch = () => setIsDarkModeEnabled(previousState => !previousState);

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    navigation.navigate(path);
  };

  const languages = [
    { label: 'English', value: 'en' },
    { label: '한국어', value: 'ko' },
    { label: 'Español', value: 'es' },
    { label: '日本語', value: 'ja' },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <SubTabScreenHeader title="Setting" navigation={navigation} />

        <ScrollView style={styles.scrollView}>
          <View style={styles.plan}>


          <TouchableOpacity onPress={() => handleNavigation('UpgradePlanScreen')}>
            <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
              <Text style={styles.planButtons}>Upgrade Plan</Text>
              <MaterialIcons paddingTop={10} paddingRight={10}  name="chevron-right" size={25} color="#000" />
            </View>
          </TouchableOpacity>


            <View style={styles.settingItem}>
              <Text style={styles.planButtons}>Available storage</Text>     
              <Text style={styles.valueText}>20GB</Text>
            </View>
            
            <View style={styles.settingItem}> 
              <Text style={styles.planButtons}>Storage in use</Text>
              <Text style={styles.valueText}>10GB</Text>
            </View>
          </View>

          <View style={styles.mode}>

          <View style={{justifyContent:'space-between', flexDirection: 'row'}}>
            <Text style={styles.planButtons}>Dark mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isDarkModeEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isDarkModeEnabled}
              style={{ transform:[{scale: 0.8}], marginRight: 10}}
            />

          </View>

          <TouchableOpacity onPress={() => setLanguageModalVisible(true)}>
              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={styles.planButtons}>Language</Text>
                <MaterialIcons paddingTop={10} paddingRight={10} name="chevron-right" size={25} color="#000" />
              </View>
            </TouchableOpacity>

          </View>

          <View style={styles.help}>

            <TouchableOpacity onPress={handleSubmit}>
              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={styles.planButtons}>Bug report</Text>
                <MaterialIcons paddingTop={10} paddingRight={10}  name="chevron-right" size={25} color="#000" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit}>
              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
               <Text style={styles.planButtons}>Send feedback</Text>
               <MaterialIcons paddingTop={10} paddingRight={10}  name="chevron-right" size={25} color="#000" />
             </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleNavigation('HelpScreen')}>
              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={styles.planButtons}>Customer Support</Text>
                <MaterialIcons paddingTop={10} paddingRight={10}  name="chevron-right" size={25} color="#000" />
              </View>
            </TouchableOpacity>

          </View>
          
          <View style={styles.info}>

            <TouchableOpacity onPress={handleSubmit}>
              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={styles.planButtons}>Terms and Conditions of Service</Text>
                <MaterialIcons paddingTop={10} paddingRight={10}  name="chevron-right" size={25} color="#000" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit}>
              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={styles.planButtons}>Personal Information Processing Policy</Text>
                <MaterialIcons paddingTop={10} paddingRight={10}  name="chevron-right" size={25} color="#000" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSubmit}>
              <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={styles.planButtons}>CCPA Configuration</Text>
                <MaterialIcons paddingTop={10} paddingRight={10}  name="chevron-right" size={25} color="#000" />
              </View>
            </TouchableOpacity>
              
            <View>
            <Text style={styles.planButtons}>App version</Text>
            <Text style={styles.valueText}>1.0.0</Text>
            </View>

          </View>
          
          <TouchableOpacity onPress={handleSubmit}>
            <View style={styles.deleteAccount}>
              <Text style={styles.accountText}>Leave Account</Text>
            </View>
          </TouchableOpacity>

        </ScrollView>
        <Modal
          animationType="fade"
          transparent={true}
          visible={languageModalVisible}
          onRequestClose={() => {
            setLanguageModalVisible(!languageModalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {languages.map((language, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedLanguage(language.label);
                    setLanguageModalVisible(false);
                  }}
                  style={styles.languageOption}
                >
                  <Text style={styles.languageText}>{language.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  plan: {
    justifyContent: 'center',
    borderBottomWidth: 0.2,
    marginBottom: 10,
    borderTopWidth: 0.2,
  },
  planButtons: {
    fontSize: 17,
    paddingVertical: 15,
    paddingLeft: 20,
    alignItems: 'center',
  },
  mode: {
    justifyContent: 'center',
    borderBottomWidth: 0.2,
    marginBottom: 10,
  },
  languageSelection: {
    justifyContent: 'center',
    borderBottomWidth: 0.2,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  info: {
    justifyContent: 'center',
    borderBottomWidth: 0.2,
    marginBottom: 10,
  },
  help: {
    justifyContent: 'center',
    borderBottomWidth: 0.2,
    marginBottom: 10,
  },
  deleteAccount: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderBottomWidth: 0.2,
    top : -5,
  },
  accountText: {
    color: 'red',
    fontSize: 16,
  },
  settingItem: {
    justifyContent: 'center',
  },
  valueText: {
    color: 'gray',
    fontSize: 13,
    paddingLeft: 20,
    paddingBottom: 10,
    top: -5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    left : 150,
    backgroundColor: "white",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  languageOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  languageText: {
    fontSize: 18,
  },
});