import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, SafeAreaView, Clipboard, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import ModalHeader from '../../Components/ModalHeader';
import SwapModal from '../../Components/Wallet/SwapModal'
import TransactionModal from '../../Components/Wallet/TransactionModal'
import WalletInfoModal from '../../Components/Wallet/WalletInfoModal';
import Colors from '../../Components/Colors';

const renderItem = ({ item }) => (
  <View style={styles.transactionRow}>
    <Image
      source={require('../../assets/images/camell_logo.png')}
      style={styles.profilePic}
    />
    <View style={styles.transactionDetails}>
      <View style={styles.addressContainer}>
        <Text style={styles.walletAddress}>
          {item.type === 'deposit' ?
            `${item.from.slice(0, 6)}...${item.from.slice(-4)}` :
            `${item.to.slice(0, 6)}...${item.to.slice(-4)}`}
        </Text>
        <Pressable
          onPress={() => copyToClipboard(item.type === 'deposit' ? item.from : item.to)}
          style={styles.copyIcon}
        >
          <Ionicons name="copy-outline" size={15} color="black" />
        </Pressable>
      </View>
      <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
    </View>
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

const calculatePercentageChange = (open, close) => {
  const change = ((close - open) / open) * 100;
  return change.toFixed(2);
};


const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  return new Intl.DateTimeFormat('ko-KR', options).format(date);
};

export default function WalletScreen({ closeModal }) {
  const [balance, setBalance] = useState('0.0');
  const [transactions, setTransactions] = useState([]);
  // const [walletAddress, setWalletAddress] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [walletInfoModalVisible, setWalletInfoModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [isBalanceHidden, setIsBalanceHidden] = useState(false); // 잔액 숨김 상태 변수
  const [closePrice, setClosePrice] = useState(null);
  const [username, setUsername] = useState(''); // username 상태 추가
  const [isModalVisible, setModalVisible] = useState(false);


  const [openPrice, setOpenPrice] = useState(null);

  const handleModalToggle = () => {
    setModalVisible(!isModalVisible); // 모달 열기/닫기
  };



  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const calculateTotalBalance = (balance, closePrice) => {
    const totalBalance = (parseFloat(balance) * closePrice).toFixed(0);
    return parseFloat(totalBalance).toLocaleString('ko-KR');
  };

  const fetchWalletData = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (!username) {
        console.error('No username found in storage');
        return;
      }
  
      console.log('Fetching wallet data for username:', username);
  
      // 서버로 보내는 데이터 확인
      const requestData = { username };
      console.log('Request data being sent to server:', requestData);
    
      // 잔액 불러오기
      const balanceResponse = await fetch('http://13.124.248.7:1212/get-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),  // 서버로 보내는 JSON 데이터를 확인하기 위해 로그 추가
      });
    
      if (!balanceResponse.ok) {
        const errorText = await balanceResponse.text();
        console.error('Error fetching balance, server response:', errorText);
        return;
      }
    
      const balanceData = await balanceResponse.json();
      if (balanceData.success && balanceData.balance) {
        setBalance(balanceData.balance.toString());
      } else {
        console.error('Error in balance data:', balanceData.error);
      }
    
      // 트랜잭션 불러오기
      const transactionsResponse = await axios.get(`http://43.201.64.232:1234/wallet-transactions?username=${username}`);
      if (transactionsResponse.data.transactions) {
        setTransactions(transactionsResponse.data.transactions);
      } else if (transactionsResponse.data.error) {
        console.error('Error fetching transactions:', transactionsResponse.data.error);
      }
  
    } catch (error) {
      console.log('Error fetching wallet data:', error.message);
    }
  };

  useEffect(() => {
    fetch('http://43.201.64.232:5000/gopax')
      .then(response => response.json())
      .then(data => {
        if (data && data.body) {
          setClosePrice(data.body.close);
          setOpenPrice(data.body.open);
        }
      })
      .catch(error => console.log('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');

      if (storedUsername) {
        setUsername(storedUsername);  // username을 상태로 설정
      } else {
        console.error('No username found in storage');
      }
    };
  
    fetchUsername();
  }, []);

  useEffect(() => {
    const fetchBalanceFromDatabase = async () => {
      try {
        const username = await AsyncStorage.getItem('username');  
        if (!username) {
          console.error('No username found in storage');
          return;
        }

        const response = await fetch('http://13.124.248.7:3000/get-balance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),  // username을 사용하여 요청
        });

        const data = await response.json();
        if (data.success && data.balance) {
          setBalance(data.balance.toString());  // 가져온 잔액을 상태에 설정
        } else {
          console.error('Error fetching balance:', data.error);
        }
      } catch (error) {
      }
    };

    fetchBalanceFromDatabase();
  }, []);


  useEffect(() => {
    // 컴포넌트가 로드될 때 잔액 및 트랜잭션 불러오기
    fetchWalletData();
  }, []);

  const handleModal = (type) => {
    setModalType(type);
    setTransactionModalVisible(true);
  };

  return (
    
    <View style={styles.container}>
       <SafeAreaView style={styles.modalContainer}>

      <ModalHeader closeModal={closeModal}>Wallet</ModalHeader>
      <View style={styles.Top}>
        <View style={styles.BalanceContainer}>
          <View style={styles.BalanceTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../assets/images/white_logo.png')}
                style={styles.CAMTlogo}
              />
              <Text style={styles.CAMT}>Camell Wallet</Text>
            </View>

            <Pressable onPress={toggleBalanceVisibility}>
              <Ionicons name={isBalanceHidden ? "eye-off" : "eye"} size={18} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.Balancetopandmid}>
            <Text style={{
              color: 'rgba(255, 255, 255, 0.7)',
            }}>
            {isBalanceHidden ? '****' : `KRW ${calculateTotalBalance(balance, closePrice)}`}
            </Text>
          </View>

          <View style={styles.BalanceMid}>
            <Text style={styles.BalanceValue}>{isBalanceHidden ? '****' : parseFloat(balance).toLocaleString('ko-KR')}</Text>
            <Text style={styles.CAMT}>CAMT</Text>
          </View>

          <View style={styles.BalanceBottom}>
            <View style={styles.Volatility}>
              <Text style={{
                fontSize: 12,
                textAlign: 'center',
                color: closePrice >= openPrice ? '#5af250' : '#a32100',
              }}>
                {closePrice >= openPrice ? '+' : ''}{calculatePercentageChange(openPrice, closePrice)}%
              </Text>
            </View>

          </View>
        </View>

        <View style={styles.BalanceButtonContainer}>
          <Pressable style={styles.WithrawButton} onPress={() => handleModal('withdraw')}>
            <FontAwesome name="arrow-up" size={17} color="white" />
            <Text style={styles.ButtonText}>Withdraw</Text>
          </Pressable>

          <Pressable style={styles.DespositButton} onPress={() => handleModal('deposit')}>
            <FontAwesome name="arrow-down" size={17} color="white" />
            <Text style={styles.ButtonText}>Deposit</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.Mid}>
        <Pressable style={styles.OtherButtons} onPress={() => setWalletInfoModalVisible(true)}>
          <Ionicons name="wallet-outline" size={24} color="white" />
        </Pressable>

        <Pressable style={styles.OtherButtons} onPress={() => navigation.navigate('ChartScreen')}>
          <Ionicons name="bar-chart-outline" size={24} color="white" />
        </Pressable>

        <Pressable style={styles.OtherButtons} onPress={handleModalToggle}>
          <Ionicons name="swap-horizontal" size={24} color="white" />
        </Pressable>

        <SwapModal
          visible={isModalVisible}  // 모달 보이기 상태
          onClose={handleModalToggle} // 모달 닫기 핸들러
          username={username} // 상위 컴포넌트에서 실제 사용자 이름을 전달해야 합니다.
          fetchWalletData={fetchWalletData}

        />
      </View>
      <View style={styles.Bottom}>
        <KeyboardAwareFlatList
          alwaysBounceVertical={true}
          data={transactions}
          renderItem={renderItem}
          keyExtractor={item => item.transaction_hash}
          ListEmptyComponent={renderEmptyComponent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, minHeight: '100%' }}
        />
      </View>

      <TransactionModal
        modalType={modalType}
        visible={transactionModalVisible}
        onClose={() => setTransactionModalVisible(false)}
        username={username}  // 유저네임을 TransactionModal로 전달
        balance={balance}  // 현재 잔액을 TransactionModal로 전달
        fetchWalletData={fetchWalletData}
      />

      <WalletInfoModal
        visible={walletInfoModalVisible}
        onClose={() => setWalletInfoModalVisible(false)}
        // walletAddress={walletAddress}
        copyToClipboard={copyToClipboard}
        username={username}
        privateKey={privateKey}
      />
    </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background
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
  Balancetopandmid: {
    backgroundColor: '#e87894',
    justifyContent: 'center',
    alignItems: 'center'
  },
  BalanceBottom: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1.3,
    backgroundColor: '#e87894'
  },

  TRX: {
    color: 'rgba(255, 255, 255, 0.85)',
    alignSelf: 'center',
    justifyContent: 'center',
    fontSize: 12,
    left: 12,
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
    marginRight: 15,
  },
  OtherButtons: {
    width: 55,
    height: 55,
    backgroundColor: '#e87894',
    borderRadius: 32.5,
    justifyContent: 'center',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyIcon: {
    marginLeft: 5,
  },
  // walletAddress: {
  //   fontSize: 16,
  //   color: '#333',
  // },
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
  }
});