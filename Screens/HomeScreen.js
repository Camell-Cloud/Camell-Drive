import React from 'react';
import { StyleSheet, Text, View,Platform, StatusBar, SafeAreaView } from 'react-native';
import Colors from '../Components/Colors';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';
import IconI from 'react-native-vector-icons/Ionicons';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import Header from '../Components/Header';

export default function HomeScreen({ navigation }) {
  const radius = 80; // 반지름
  const strokeWidth = 15; // 선 두께
  const circumference = 2 * Math.PI * radius; // 원 둘레
  const percentage = 30; // 임의 사용 비율
  const strokeDashoffset = circumference * (1 - percentage / 100); // 사용 비율

  return (
    <View style={{flex: 1}}>
        <SafeAreaView style={styles.container}>
            <Header>Home</Header>
            <View style={styles.topContainer}>
                <View style={styles.storageCard}>
                    <Svg height="200%" width="200" viewBox="0 0 200 200">
                        <Circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke="#e6e6e6"
                            strokeWidth={strokeWidth}
                        />
                        <Circle
                            cx="100"
                            cy="100"
                            r={radius}
                            fill="none"
                            stroke={Colors.primary400}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            transform="rotate(-90 100 100)"
                        />
                        <SvgText
                            x="92"
                            y="104"
                            fill="black"
                            fontSize="33.5"
                            fontWeight="bold"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                        >
                        {percentage}%
                        </SvgText>
                    </Svg>
                    <View style={styles.storageTextContainer}>
                        <Text style={styles.storageTitle}>Storage</Text>
                        <Text style={styles.storageText}>300 MB of 1 GB used</Text>
                    </View>
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <View style={styles.TitleContainer}>
                    <IconI name="time" size={30} color={Colors.primary400} />
                    <Text style={styles.selectedButtonText}>Recent Files</Text>
                </View>
                <View style={styles.itemContainer}>
                        <IconM name='file-cancel-outline' color={Colors.primary100} size={80} style={{marginBottom: 10}}/>
                        <Text style={styles.noRecentFilesTitle}>No Recent Files</Text>
                        <Text style={styles.noRecentFilesText}>Please upload the file</Text>
                </View>
            </View>
        </SafeAreaView>
    </View>
  );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight+3 : 0,
    },
    topContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: 10,
        alignItems: 'center',
    },
    storageCard: {
        width: '80%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        borderRadius: 100,
        
    },
    storageTextContainer: {
        marginLeft: 28,
        justifyContent: 'space-between',
    },
    storageTitle: {
        fontSize: 35,
        marginBottom: 30,
    },
    storageText: {
        fontSize: 15,
        color: 'gray'
    },
    bottomContainer: {
        backgroundColor: '#FFF0F5',
        marginTop: 30,
        elevation: 24,
        shadowColor: 'black',
        shadowOffset: { width: 0 , height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.3,
        flex: 2.5,
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    buttonText: {
        color: 'black',
        fontSize: 15,
        marginLeft: 5,
    },
    selectedButtonText:{
        color: Colors.primary400,
        fontWeight: 'bold',
        fontSize: 25,
        marginLeft: 5,
        elevation: 4,
        shadowColor: 'black',
        shadowOffset: { width: 0 , height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.1,
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    TitleContainer: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderColor: Colors.primary400,
        paddingBottom: 10,
    },
    noRecentFilesTitle: {
        fontWeight: '500',
        fontSize: 16,
        color: Colors.primary100,
    },
    noRecentFilesText: {
        fontSize: 14,
        fontWeight: '500',
        color: Colors.primary100,
        textAlign: 'center'
    },
    svgShadowContainer: {

      },
      
});