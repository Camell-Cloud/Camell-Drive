import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList,Clipboard} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import SubTabScreenHeader from '../main/SubTabScreenHeader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleSubmit = () => {
  alert('To be updated');
};

const renderItem = ({ item }) => (
  <View style={styles.transactionRow}>
    <Image
      source={require('../../../assets/images/camell_logo.png')}
      style={styles.profilePic}
    />
    <View style={styles.transactionDetails}>

      <View style={styles.addressContainer}>
        <Text style={styles.walletAddress}>
          {item.type === 'deposit' ? 
            `${item.from.slice(0, 6)}...${item.from.slice(-4)}` : 
            `${item.to.slice(0, 6)}...${item.to.slice(-4)}`}
        </Text>
        <TouchableOpacity 
          onPress={() => copyToClipboard(item.type === 'deposit' ? item.from : item.to)} 
          style={styles.copyIcon}
        >
          <Ionicons name="copy-outline" size={15} color="black" />
        </TouchableOpacity>
      </View>

      {/* 거래 시간: timestamp를 로컬 시간으로 변환하여 표시 */}
      <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
    </View>
    {/* 금액과 토큰 이름 */}
    <Text style={[styles.amount, { color: item.type === 'deposit' ? 'green' : 'red' }]}>
      {item.type === 'deposit' ? '+' : '-'}{parseFloat(item.amount).toLocaleString()} CAMT
    </Text>
  </View>
);

const copyToClipboard = (address) => {
  Clipboard.setString(address);
};

const renderEmptyComponent = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyText}>Empty</Text>
  </View>
);

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  // 사용자 지정 포맷을 위한 옵션 설정
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // 24시간제 표시
  };
  // 한국어 (ko-KR) 설정을 사용하여 날짜와 시간 포맷
  return new Intl.DateTimeFormat('ko-KR', options).format(date);
};

export default function WalletScreen({ navigation }) {
  const [balance, setBalance] = useState('0.0');
  const [transactions, setTransactions] = useState([]); // 트랜잭션 상태 추가
  const [walletAddress, setWalletAddress] = useState(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);

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
    if (walletAddress) {
      axios.get(`http://43.201.64.232:1234/wallet-balance?wallet_address=${walletAddress}`)
        .then(response => {
          if (response.data.balance) {
            setBalance(response.data.balance.toString());
          } else if (response.data.error) {
          }
        })
        .catch(error => {
          console.log("잔액을 불러오는데 실패했습니다.:", error);
        });
    }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      axios.get(`http://43.201.64.232:1234/wallet-transactions?wallet_address=${walletAddress}`)
        .then(response => {
          if (response.data.transactions) {
            setTransactions(response.data.transactions); // setTransfers 대신 setTransactions 사용
          } else if (response.data.error) {
          }
        })
        .catch(error => {
          console.error("Failed to fetch transactions:", error);
        });
    }
  }, [walletAddress]);


    return (

        <View style={styles.container}>
        <SubTabScreenHeader title="Wallet" navigation={navigation} />
          <View style={styles.Top}>
            <View style={styles.BalanceContainer}>
              <View style={styles.BalanceTop}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={require('../../../assets/images/white_logo.png')}
                    style={styles.CAMTlogo}
                  />
                  <Text style={styles.CAMT}>Camell Wallet</Text>
                </View>

              <TouchableOpacity onPress={handleSubmit}>
                <Ionicons name="eye" size={18} color="#fff" />
              </TouchableOpacity>
              </View>

              <View style={styles.BalanceMid}>
                <Text style={styles.BalanceValue}>{parseFloat(balance).toLocaleString('ko-KR')}</Text>
                <Text style={styles.CAMT}>CAMT</Text>
              </View>

              <View style={styles.BalanceBottom}>
                <Text style={styles.CAMTAmount}>$0.0</Text>
                <View style={styles.Volatility}>
                    <Text style={{
                      fontSize: 12, 
                      textAlign: 'center',
                       color: '#5af250', }}
                      >+ 0%</Text>
                </View>
              </View>
            </View>

            <View style={styles.BalanceButtonContainer}>
              <TouchableOpacity style={styles.WithrawButton} onPress={handleSubmit}>
                <Text style={styles.ButtonText}>Withraw</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.DespositButton} onPress={handleSubmit}>
                <Text style={styles.ButtonText}>Desposit</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.Mid}>
              <TouchableOpacity style={styles.OtherButtons} onPress={handleSubmit}>
              <Ionicons name="wallet-outline" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.OtherButtons} onPress={handleSubmit}>
              <Ionicons name="bar-chart-outline" size={24} color="white" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.OtherButtons} onPress={handleSubmit}>
              <Ionicons name="ellipsis-horizontal-outline" size={24} color="white" />
              </TouchableOpacity>
          </View>
          <View style={styles.Bottom}>
          <FlatList
            alwaysBounceVertical={true} // iOS에서 항상 스크롤 가능하게
            data={transactions} // transactions 데이터 사용
            renderItem={renderItem}
            keyExtractor={item => item.transaction_hash} // 고유한 transaction_hash를 키로 사용
            ListEmptyComponent={renderEmptyComponent} // 빈 목록 컴포넌트
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }}
          />
          </View>
        </View>
      );
    }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 7
    },

    Top: {
      flex: 2,

    },

    Mid: {
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      flex: 0.8,
    },

    Bottom: {
      backgroundColor: 'rgba(232,120,148,0.1)',
      flex: 4,
    },

    BalanceContainer: {
      flex: 3.5,

    },
    BalanceButtonContainer: {
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
    },

    WithrawButton: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(232,120,148,0.8)',
      flex: 1,
    },

    DespositButton: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'rgba(232,120,148,0.8)',
      justifyContent: 'center',
      borderLeftWidth: 0.2,
      borderColor: 'white'
    },

    ButtonText: {
      fontSize: 15,
      color: 'white'
    },

    BalanceTop: {
      paddingHorizontal: 10,
      justifyContent: 'space-between',
      flexDirection: 'row',
      flex: 2,
      alignItems: 'center',
      backgroundColor: '#e87894'
    },

    BalanceMid: {
      flexDirection: 'row',
      flex: 3,
      backgroundColor: '#e87894',
      justifyContent: 'center',
      alignItems: 'center',
    },

    BalanceBottom: {
      justifyContent: 'space-around',
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1.3,
      backgroundColor: '#e87894'

    },
    CAMTAmount: {
      color: 'rgba(255, 255, 255, 0.7)',
      alignSelf: 'center',
      justifyContent: 'center',
    },

    BalanceValue: {
      marginRight: 10,
      fontSize: 40,
      color: 'white'
    },
    CAMT: {
      color: 'white',
      fontSize: 16,
    },
    CAMTlogo: {
      width: 30,
      height: 30,
      marginRight: 4,
    },
    Volatility: {
      position: 'absolute',
      right: 12,
    },
    OtherButtons: {
      width: 55,  // 버튼의 가로 크기
      height: 55,  // 버튼의 세로 크기
      backgroundColor: '#e87894',
      borderRadius: 32.5,  // 버튼을 동그랗게 만들기 위해 반지름을 절반으로 설정
      justifyContent: 'center',  // 텍스트를 수직 중앙 정렬
      alignItems: 'center',  // 텍스트를 수평 중앙 정렬

    },
    OtherButtonText: {
      color: 'white',
    },


    profilePic: {
      marginRight: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    transactionRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      borderBottomWidth: 0.2,
      borderBottomColor: '#000',
      marginTop: 8,
    },
    transactionDetails: {
      flex: 1,
    },
    addressContainer: {
      flexDirection: 'row', // 주소와 아이콘을 가로로 배치
      alignItems: 'center', // 세로 중앙 정렬
    },
    copyIcon: {
      marginLeft: 5, // 아이콘과 주소 사이 간격 조절
    },
    walletAddress: {
      fontSize: 16,
      color: '#333',
    },
    date: {
      fontSize: 14,
      color: '#666',
    },
    amount: {
      fontSize: 16,
      fontWeight: 'bold',
    },  
      emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});