import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../Utils/colors';
import SubTabScreenHeader from '../main/SubTabScreenHeader';
import { ScrollView } from 'react-native-gesture-handler';

export default function PlanScreen({ navigation }) {
  const handleSubmit = () => {
    alert('To be updated.');
  };
  return (
    <View style={styles.container}>
      <SubTabScreenHeader title="Plan" navigation={navigation} />
      <View style={styles.mainContainer}>
        <ScrollView style={{flex: 1}}>
        <View style={styles.planTitle}>
          <Text style={{ fontSize: Platform.OS === 'android' ? 18 : 20, opacity: 0.7}}>Get more space at a lower cost with CAMT.</Text>
        </View>
          <View style={styles.planContainer}>


            <View style={styles.usingContainer}>
              <View style={styles.plan}>
                <Text style={styles.planname}>Basic</Text>
              </View>
              <View style={styles.size}>
                <Text style={styles.sizeText}>10 GB</Text>
              </View>

              <View style={styles.cost}>
                <Text style={styles.costText}>0 CAMT</Text>
              </View>
              <View style={styles.buy}>
                <TouchableOpacity style={styles.usingbutton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Current Plan</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.moContainer}>
            <View style={styles.plan}>
                <Text style={styles.planname}>Plus</Text>
              </View>
              <View style={styles.size}>
                <Text style={styles.sizeText}>200 GB</Text>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costText}>180 CAMT for 1 month, then 200 CAMT</Text>
              </View>
              <View style={styles.buy}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Get started</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.moContainer}>
            <View style={styles.plan}>
                <Text style={styles.planname}>Pro</Text>
              </View>
              <View style={styles.size}>
                <Text style={styles.sizeText}>500 GB</Text>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costText}>450 CAMT for 1 month, then 470 CAMT</Text>
              </View>
              <View style={styles.buy}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Get started</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.moContainer}>
            <View style={styles.plan}>
                <Text style={styles.planname}>Elite</Text>
              </View>
              <View style={styles.size}>
                <Text style={styles.sizeText}>1 TB</Text>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costText}>800 CAMT for 1 month, then 900 CAMT</Text>
              </View>
              <View style={styles.buy}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Get started</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.moContainer}>
            <View style={styles.plan}>
                <Text style={styles.planname}>Max</Text>
              </View>
              <View style={styles.size}>
                <Text style={styles.sizeText}>2 TB</Text>
              </View>
              <View style={styles.cost}>
                <Text style={styles.costText}>1600 CAMT for 1 month, then 1800 CAMT</Text>
              </View>
              <View style={styles.buy}>
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Get started</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 다른 moContainer 추가 가능 */}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainContainer: {
    flex: 1,
  },
  planTitle: {
    paddingTop: 20,
    alignItems: 'center',

  },
  planContainer: {
    marginTop: 10,
    flex: 1,
    marginBottom: 20,
  },
  moContainer: {
    margin: 10,
    borderWidth: 1,
    flex: 1,
    borderRadius: 10,
    borderColor: Colors.themcolor,
    height: Platform.OS === 'android' ? 170 : 150,

  },
  usingContainer: {
    margin: 10,
    borderWidth: 1,
    flex: 1,
    borderRadius: 10,
    borderColor: 'gray',
    height: Platform.OS === 'android' ? 170 : 150,

  },

  plan : {
    marginTop: 10,
    marginLeft: 20,
  },

  planname: {
    fontSize: 30,
  },
  size: {
    marginTop: 10,
    marginLeft: 20,
  },
  sizeText: {
    fontSize: 20,
  },
  cost: {
    marginLeft: 20,
    top: 40,
  },
  costText: {
    fontSize: Platform.OS === 'android' ? 12 : 12.5,

  },
  buy: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },
  button: {
    backgroundColor: Colors.themcolor, // 테마 색상 사용
    padding: 10,
    borderRadius: 20,
  },
  usingbutton: {
      backgroundColor: 'gray',
      padding: 10,
      borderRadius: 20,
  },
  buttonText: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
  }
});