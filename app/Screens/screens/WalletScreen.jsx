import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Clipboard, Modal, TextInput } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SubTabScreenHeader from '../main/SubTabScreenHeader';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import TransactionModal from './modal/TransactionModal';
import WalletInfoModal from './modal/WalletInfoModal';

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

export default function WalletScreen({ navigation }) {
  const [balance, setBalance] = useState('0.0');
  const [transactions, setTransactions] = useState([]);
  const [walletAddress, setWalletAddress] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);
  const [walletInfoModalVisible, setWalletInfoModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [TrxBalance, setTrxBalance] = useState(null);
  const [isBalanceHidden, setIsBalanceHidden] = useState(false); // 잔액 숨김 상태 변수
  const [closePrice, setClosePrice] = useState(null);
  const [openPrice, setOpenPrice] = useState(null);



  const toggleBalanceVisibility = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  const calculateTotalBalance = (balance, closePrice) => {
    const totalBalance = (parseFloat(balance) * closePrice).toFixed(0);
    return parseFloat(totalBalance).toLocaleString('ko-KR');
  };
  
  
  

  useEffect(() => {
    fetch('http://43.201.64.232:5000/gopax')
      .then(response => response.json())
      .then(data => {
        if (data && data.body) {
          setClosePrice(data.body.close);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    fetch('http://43.201.64.232:5000/gopax')
      .then(response => response.json())
      .then(data => {
        if (data && data.body) {
          setClosePrice(data.body.close);
          setOpenPrice(data.body.open);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      const email = await AsyncStorage.getItem('userEmail');
      if (!email) {
        console.error('No email found in storage');
        return;
      }

      try {
        // Fetch wallet address
        const addressResponse = await fetch('http://13.124.248.7:8080/api/get-wallet-address', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const addressData = await addressResponse.json();
        if (addressData.success) {
          setWalletAddress(addressData.address);
        } else {
          console.error('Error fetching wallet address:', addressData.error);
        }

        // Fetch private key
        const privateKeyResponse = await fetch('http://13.124.248.7:8080/api/get-private-key', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        const privateKeyData = await privateKeyResponse.json();
        if (privateKeyData.success) {
          setPrivateKey(privateKeyData.privateKey);
        } else {
          console.error('Error fetching private key:', privateKeyData.error);
        }
      } catch (error) {
        console.error('API error:', error);
      }
    };

    fetchWalletInfo();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      axios.get(`http://43.201.64.232:1212/wallet-trx-balance?wallet_address=TBxkfDYrezZfyjpwFfRNPnvyqBaQua1HHS`)
        .then(response => {
          const trxBalanceValue = Math.floor(response.data.trx_balance || 0); // 응답이 없을 경우 기본값 0
          console.log('TRX Balance:', trxBalanceValue); // TRX 잔액 콘솔에 출력
          const units = calculateUnits(trxBalanceValue);
          setTrxBalance(
            <Text style={{ color: 'white' }}>
              {isBalanceHidden ? '*** TRX' : `${trxBalanceValue} TRX`} (
              <Text style={{ color: 'white' }}>{isBalanceHidden ? '*' : units}</Text> transfers allowed)
            </Text>
          );
        })
        .catch(error => {
          console.log("TRX 잔액을 불러오는데 실패했습니다.:", error);
        });
    }
  }, [walletAddress, isBalanceHidden]);
  

  useEffect(() => {
    if (walletAddress) {
      axios.get(`http://43.201.64.232:1234/wallet-balance?wallet_address=TBxkfDYrezZfyjpwFfRNPnvyqBaQua1HHS`)
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
      axios.get(`http://43.201.64.232:1234/wallet-transactions?wallet_address=TBKNqcQaiJxojrdb23wdEKftvxHULAonPS`)
        .then(response => {
          if (response.data.transactions) {
            setTransactions(response.data.transactions);
          } else if (response.data.error) {
          }
        })
        .catch(error => {
          console.error("Failed to fetch transactions:", error);
        });
    }
  }, [walletAddress]);

  const calculateUnits = (trx_balance) => {
    return Math.floor(trx_balance / 13);
  };

  const handleModal = (type) => {
    setModalType(type);
    setTransactionModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <SubTabScreenHeader title="Wallet" navigation={navigation} />
      <View style={styles.Top}>
        <View style={styles.BalanceContainer}>
          <View style={styles.BalanceTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={require('../../../assets/images/white_logo.png')}
                style={styles.CAMTlogo}
              />
              <Text style={styles.CAMT}>Camell Wallet</Text>
            </View>

            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <Ionicons name={isBalanceHidden ? "eye-off" : "eye"} size={18} color="#fff" />
            </TouchableOpacity>
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
            <Text style={styles.TRX}>{TrxBalance}</Text>
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
          <TouchableOpacity style={styles.WithrawButton} onPress={() => handleModal('withdraw')}>
            <FontAwesome name="arrow-up" size={17} color="white" />
            <Text style={styles.ButtonText}>Withdraw</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.DespositButton} onPress={() => handleModal('deposit')}>
            <FontAwesome name="arrow-down" size={17} color="white" />
            <Text style={styles.ButtonText}>Deposit</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.Mid}>
        <TouchableOpacity style={styles.OtherButtons} onPress={() => setWalletInfoModalVisible(true)}>
          <Ionicons name="wallet-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.OtherButtons} onPress={() => navigation.navigate('ChartScreen')}>
          <Ionicons name="bar-chart-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.OtherButtons} onPress={handleSubmit}>
          <Ionicons name="ellipsis-horizontal-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <View style={styles.Bottom}>
        <FlatList
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
        walletAddress={walletAddress}
        copyToClipboard={copyToClipboard}
        privateKey={privateKey} // privateKey prop 추가
        fetchWalletData={() => {
          // 모든 요청 다시 불러오기
          axios.get(`http://43.201.64.232:1234/wallet-balance?wallet_address=${walletAddress}`)
            .then(response => {
              if (response.data.balance) {
                setBalance(response.data.balance.toString());
              } else if (response.data.error) {
                console.error(response.data.error);
              }
            })
            .catch(error => {
              console.log("잔액을 불러오는데 실패했습니다.:", error);
            });
      
          axios.get(`http://43.201.64.232:1234/wallet-transactions?wallet_address=${walletAddress}`)
            .then(response => {
              if (response.data.transactions) {
                setTransactions(response.data.transactions);
              } else if (response.data.error) {
                console.error(response.data.error);
              }
            })
            .catch(error => {
              console.error("Failed to fetch transactions:", error);
            });
      
          // 추가로 필요한 다른 데이터 요청
          axios.get(`http://43.201.64.232:1212/wallet-trx-balance?wallet_address=${walletAddress}`)
            .then(response => {
              if (response.data.trx_balance) {
                const trxBalanceValue = Math.floor(response.data.trx_balance); // 소수점 제거
                const units = calculateUnits(trxBalanceValue);
                setTrxBalance(
                  <Text style={{ color: 'white' }}>
                    {isBalanceHidden ? '*** TRX' : `${trxBalanceValue} TRX`} (
                    <Text style={{ color: 'white' }}>{isBalanceHidden ? '*' : units}</Text> transfers allowed)
                  </Text>
                );
              } else if (response.data.error) {
                console.error(response.data.error);
              }
            })
            .catch(error => {
              console.log("TRX 잔액을 불러오는데 실패했습니다.:", error);
            });
      
          fetch('http://43.201.64.232:5000/gopax')
            .then(response => response.json())
            .then(data => {
              if (data && data.body) {
                setClosePrice(data.body.close);
                setOpenPrice(data.body.open);
              }
            })
            .catch(error => console.error('Error fetching data:', error));
        }}
      />

      <WalletInfoModal
        visible={walletInfoModalVisible}
        onClose={() => setWalletInfoModalVisible(false)}
        walletAddress={walletAddress}
        copyToClipboard={copyToClipboard}
        privateKey={privateKey} // privateKey prop 추가
      />

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
  Balancetopandmid: {
    backgroundColor: '#e87894',
    justifyContent: 'center',
    alignItems: 'center'
  },
  BalanceBottom: {
    justifyContent: 'space-between',
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
    right: 12,
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
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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
  }
});
