import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Modal, Clipboard, Platform, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { Colors } from '../theme/color';
import SubTabScreenHeader from '../main/SubTabScreenHeader';
import RNPickerSelect from 'react-native-picker-select';
import { TextInput } from 'react-native-gesture-handler';
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios';
import { Link } from 'expo-router';

const buttonIcons = {
  Withdraw: 'exit-outline',
  Desposit: 'enter-outline',
  Chart: 'bar-chart-outline',
  Menu: 'ellipsis-horizontal-outline'
};

export default function WalletScreen({ navigation }) {

  const [inputText, setInputText] = useState('');
  

  const [withdrawAmount, setWithdrawAmount] = useState('');  // 출금 금액 상태
  const [targetAddress, setTargetAddress] = useState('');    // 대상 주소 상태
  const minimumAmount = 10;  // 최소 출금 금액 설정

  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawalModalVisible, setWithdrawalModalVisible] = useState(false);

  const [balance, setBalance] = useState('0');

  const [walletAddress, setWalletAddress] = useState('TMrNryRrEtYSTff3fp5RhKUjVWBgVtKRf3'); // 지갑주소

    // 지갑 잔액 코드
    useEffect(() => {
      if (walletAddress) {
          axios.get(`http://43.201.64.232:5500/wallet-balance?wallet_address=${walletAddress}`)
          .then(response => {
              if (response.data.balance) {
                  setBalance(response.data.balance.toString());
              } else if (response.data.error) {
                  Alert.alert('Error', response.data.error);
              }
          })
          .catch(error => {
              console.error("잔액을 불러오는데 실패했습니다.:", error);
              Alert.alert('Error', '잔액을 불러오는데 실패했습니다.: ' + error.message);
          });
      }
  }, [walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      axios.get(`http://43.201.64.232:5500/wallet-transactions?wallet_address=${walletAddress}`)
      .then(response => {
        if (response.data.transactions) {
          // setTransfers 대신 setTransactions 사용
          setTransactions(response.data.transactions);
        } else if (response.data.error) {
          Alert.alert('Error', response.data.error);
        }
      })
      .catch(error => {
        console.error("Failed to fetch transactions:", error);
        Alert.alert('Error', 'Failed to fetch transactions: ' + error.message);
      });
    }
  }, [walletAddress]);


 // 예시: 출금 요청 함수
 const handleWithdraw = async () => {
  const minimumAmount = 10;  // 최소 출금 금액 설정

  // 입력값 검증
  if (parseFloat(withdrawAmount) < minimumAmount || !targetAddress) {
    Alert.alert('오류', '유효하지 않은 금액 또는 주소입니다.');
    return;
  }

  // 서버에 출금 요청
  try {
    const response = await fetch('http://172.30.1.93:5500/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: withdrawAmount,
        toAddress: targetAddress,
        network: 'Tron'  // 현재 Tron 고정
      })
    });
    const result = await response.json();
    if (result.success) {
      Alert.alert('성공', '출금 요청 성공');
      // 출금 성공 후 추가 로직
      // 예: 모달 닫기, 상태 업데이트 등
      setWithdrawalModalVisible(false);
      setWithdrawAmount('');
      setTargetAddress('');
    } else {
      Alert.alert('오류', '출금 요청 실패 - ' + result.error);
    }
  } catch (error) {
    Alert.alert('서버 오류', '서버 오류: ' + error.message);
  }
};




    


        // 복사
  const copyToClipboard = (address) => {
    Clipboard.setString(address);
    Alert.alert("알림", "주소가 클립보드에 복사되었습니다!");
  };

const closeModal = () => {
  setDepositModalVisible(false);
};

  

const handleButtonPress = (buttonText) => {
  switch (buttonText) {
    case 'Desposit':
      closeModal();
      setTimeout(() => setDepositModalVisible(true), 10);
      break;
    
    case 'Withdraw':
      setWithdrawalModalVisible(true);
      break;
    
    case '더보기':
      break;
    
    case '시세':
      break;  
    
    default:
      break;
  }
};


const renderButton = (buttonText, iconName) => {
  if (buttonText === '시세') {
    return (
      <Link href={`/screens/ChartScreen`}
      underlayColor="#f0f4f7"
      >
        <View style={[styles.buttonCircle, { justifyContent: 'center' }]}>
          <Ionicons name={iconName} size={30} color="#000" />
          <Text style={[styles.buttonText, { marginTop: 5 }]}>시세</Text>
        </View>
      </Link>
    );
  } else {
    return (
      <TouchableOpacity
        key={buttonText}
        style={styles.buttonCircle}
        onPress={() => handleButtonPress(buttonText)}
      >
        <Ionicons name={iconName} size={30} color="#000" />
        <Text style={styles.buttonText}>{buttonText}</Text>
      </TouchableOpacity>
    );
  }
};

  const [currency, setCurrency] = useState('KRW');
  
  const currencies = [
    // 백엔드 필요 !!
    { label: '(USD)', value: 'USD' },
    { label: '(KRW)', value: 'KRW' },
    { label: '(EUR)', value: 'EUR' }
  ];

  const [transactions, setTransactions] = useState([]);


  const renderItem = ({ item }) => (
    <View style={styles.transactionRow}>
      <Image
        source={require('../../assets/images/camell_logo.png')}
        style={styles.profilePic}
      />
      <View style={styles.transactionDetails}>
        {/* 거래 유형에 따라 발신자 또는 수신자 주소 표시 */}
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
  
  

  return (
    <View style={styles.container}>
      <SubTabScreenHeader title="Wallet" navigation={navigation} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={withdrawalModalVisible}
        onRequestClose={() => {
          setWithdrawalModalVisible(!withdrawalModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setWithdrawalModalVisible(!withdrawalModalVisible)}
            >
              <Ionicons name="close-circle" size={40} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalText}>출금</Text>
            <View style={styles.inputView}>
              <View style={styles.inputForm}>
                <View style={styles.won}>
                  <Text>출금 수량</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => setWithdrawAmount(text)}
                    placeholder="최소 10 CAMT"
                    placeholderTextColor="#808080"
                  />
                  <Text style={styles.wonValue}>= 0 KRW</Text>
                </View>
                <Text>출금 대상</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => setTargetAddress(text)}
                  placeholder="대상 주소 입력"
                  placeholderTextColor="#808080"
                />
                <View style={styles.network}>
                  <Text style={styles.networkText}>출금 네트워크</Text>
                  <View style={styles.networkValue}>
                    <Text style={styles.networkValueText}>Tron</Text>
                  </View>
                </View>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.okButton} onPress={handleWithdraw}>
                    <Text style={styles.okButtonText}>확인</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>





<Modal
  animationType="slide"
  transparent={true}
  visible={depositModalVisible}
  onRequestClose={() => setDepositModalVisible(false)}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => setDepositModalVisible(false)}
      >
        <Ionicons name="close-circle" size={40} color="#000" />
      </TouchableOpacity>
      <Text style={styles.modalText}>입금</Text>
      <View style={styles.qr}>
      <QRCode
            value={walletAddress}
            size={Platform.OS === 'android' ? 200 : 230}
            color="black"
            backgroundColor="white"
          />
      </View>
      <View style={styles.address}>
        <Text style={{fontSize: 20, textAlign: 'center'}}>지갑 주소</Text>
        <View style={{marginTop: 10}}>
          <Text style={{fontSize: 17}}>TNDcxm95uDiensNHpfHfn7q5kt2x1vtMfD</Text>
          <View style={{alignItems: 'center', marginTop: 30,}}>

          <TouchableOpacity onPress={() => copyToClipboard(walletAddress)} style={styles.copyButton}>
          <Ionicons name="copy-outline" size={50} color="black" />
        </TouchableOpacity>

          </View>
        </View>
      </View>
    </View>
  </View>
</Modal>




      <View style={styles.headContainer}>
        <View style={styles.balance}>

          <View style={styles.balanceTop}>
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
            <Image
                source={require('../../assets/images/camell_logo.png')}
                style={styles.logo}
            />
            <Text style={styles.camell}>Camell</Text>

            </View>
            
            <View>

              <View style={styles.dropdown}>
                <RNPickerSelect
                  onValueChange={(value) => setCurrency(value)}
                  items={currencies}
                  style={{
                    inputIOS: {
                      fontSize: 13, // 폰트 크기 조정
                      paddingVertical: 12,
                      paddingHorizontal: 10,
                      borderRadius: 4,
                      color: 'gray', // 폰트 색상을 회색으로 변경
                    },
                    inputAndroid: {
                      fontSize: 14, // 폰트 크기 조정
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      color: 'gray', // 폰트 색상을 회색으로 변경
                    },
                    iconContainer: {
                      top: 13,
                      right: 10,
                    },
                  }}
                  value={currency}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{}}
                  Icon={() => {
                    return <Ionicons name="caret-down-outline" size={15} style={{ marginRight: -20, color: 'gray' }} />; // 아이콘을 오른쪽으로 이동시키기
                  }}
                />
              </View>
            </View>

            

          </View>

          <View style={styles.balanceMid}>

            <Text style={styles.camtValue}>
              {parseFloat(balance).toLocaleString('ko-KR',)}
            </Text>

            <Text style={styles.camt}>CAMT</Text>
          </View>
          
          <View style={styles.balanceBottom}>

                            {/*  백엔드 필요 !!  */}
          <Text style={styles.Won}>₩23,600</Text>
          <View style={styles.balancePlusMinus}>

                                          {/*  백엔드 필요 !!  */}
            <Text style={styles.PlusMinusValue}>+ 2.53%</Text>
          </View>

          </View>

        </View>
        <View style={styles.buttonRow}>
          {Object.entries(buttonIcons).map(([buttonText, iconName]) => (
             <TouchableOpacity
              key={buttonText}
              style={styles.buttonCircle}
              onPress={() => handleButtonPress(buttonText, navigation)}
             >
              <Ionicons name={iconName} size={32} color="#000" />
              <Text style={styles.buttonText}>{buttonText}</Text>
             </TouchableOpacity>
          ))}
      </View>
      </View>
      <View style={styles.bottomContainer}>
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
    backgroundColor: '#ebebef',
  },
  headContainer: {
    flex: 1,
    marginBottom: 10,
  },



  balance: {
    borderRadius: 20,
    margin: 11,
    marginHorizontal: 15,
    flex: Platform.OS === 'android' ? 1.8 : 1.3,
    backgroundColor: Colors.background,

  },


  logo: {
    width: 47,
    height: 47,
  },



  dropdown: {
    alignItems: 'center',
    marginRight: 30
  },


balanceTop: {
  justifyContent: 'space-between',
  flexDirection: 'row',
  marginLeft: 15,
  marginTop: 15,
  marginBottom: 5,
  alignItems: 'center',
},
camell: {
  fontSize: 19,
  marginLeft: 10,
},

balanceMid: {
  flexDirection: 'row',
  marginLeft: 15,
},
camtValue: {
  fontSize: 27,
},
camt: {
  fontSize: 27,
  marginLeft: 10,
},


balanceBottom: {
  flexDirection: 'row',

  marginLeft: 15,
  justifyContent: 'space-between',
},

Won: {
  marginTop: 15,
  fontSize: 15,
  color: 'gray'
},

balancePlusMinus: {
  marginTop: 15,

  backgroundColor: '#10ad2a',
  marginRight: 30,
  borderRadius: 15,
  padding: 6,
},
PlusMinusValue: {
  fontSize: 12,
  color: 'white'
},



  buttonRow: {
    flex: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,

  },
  buttonCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 35,
    padding: 10,
    backgroundColor: Colors.background,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 0.5 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 3, 
    elevation: 1
  },

  buttonIconText: {
    // 아이콘을 위한 텍스트 스타일링, 실제 아이콘으로 교체 필요
  },
  buttonText: {
    fontSize: 13,
    color: '#000',
    marginTop: 5, // 아이콘과 텍스트 간격 조정
  },
  buttonText2: {
    fontSize: 12,
    color: '#000',
    marginTop: 7, // 아이콘과 텍스트 간격 조정
  },
  bottomContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1.5,
    padding: 10,
    backgroundColor: '#f7f7f7',
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
  profilePic: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  transactionDetails: {
    flex: 1,
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

  addressContainer: {
    flexDirection: 'row', // 주소와 아이콘을 가로로 배치
    alignItems: 'center', // 세로 중앙 정렬
  },

  copyIcon: {
    marginLeft: 5, // 아이콘과 주소 사이 간격 조절
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
  
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    bottom: -15,
    width: '100%',
    height: Platform.OS === 'android' ? '70%' : '65%',
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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

  
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 6,
    elevation: 2
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 18
  },

  inputView:{
    flex: 1,
    width: '100%',
  },
  textInput: {
    paddingLeft: 10,
    borderWidth: 0.2,
    marginBottom: 20,
    borderRadius: 10,
    height: 45,
    marginTop: 5,
  },

  inpitForm: {
    marginTop: 30,
  },
  network: {
    marginTop: 10,
  },
  networkText: {
    fontSize: 20,
  },
  networkValue: {
    marginTop:5,
    backgroundColor: '#f3f1f1',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  networkValueText: {
    fontSize: 22,
  },

  buttonContainer: {
    marginTop: 100,
    justifyContent: 'center',
    height: 100,
    alignItems: 'center',
  },
  okButton: {
    alignItems: 'center',
    height: 60,
    justifyContent: 'center',
    borderRadius: 15,
    borderWidth: 0.2,
    width: '60%',
    bottom: Platform.OS === 'android' ? 60 : 0,
  },
  okButtontext: {
    fontSize: 20,
  },
  won: {
  },
  wonValue: {
    top: -15,
    fontSize: 12,
    opacity: 0.5,
  },

  qr: {
    marginTop: 20,
    marginBottom: 40,
  },

  address: {
    
  },
  addressText:{
    fontSize: 20,
    textAlign: 'center',
  },

  copyButton: {
    borderWidth: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});