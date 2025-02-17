// ModalComponent.js
import React, { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../Colors';
import PrivateKeyModal from './PrivateKeyModal';



export default function TermsOfServiceModal({ modalVisible, setModalVisible, userName, setPrivateKeyModalVisible }) {
    const [isChecked, setIsChecked] = useState(false);

    const toggleCheckbox = () => {
        setIsChecked(!isChecked);
      };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
  <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.modalBackground, { flex: 1 }]}>
          <View style={[styles.modalView, { flex: 1 }]}>
              <Text style={styles.agreeTitle}>Agree to the Terms of Service</Text>
              
              <View style={[styles.agreeContainer, { flex: 1 }]}>
                        <ScrollView contentContainerStyle={styles.scrollContainer}>


                                <Text style={styles.titleText}>Camell Drive Terms of Service</Text>

                                <Text style={styles.sectionTitle}>1. Purpose</Text>
                                <Text style={styles.bodyText}>
                                These terms and conditions (hereinafter referred to as the "Terms") set forth the rights, obligations, responsibilities, 
                                and other necessary matters regarding the use of the Camell Drive service (hereinafter referred to as the "Service") 
                                between the Camell Drive team (hereinafter referred to as the "Company") and users (hereinafter referred to as the "User"). 
                                The Service includes cloud storage management, CAMT-based services, and the ability to transfer CAMT between users.
                                </Text>

                                <Text style={styles.sectionTitle}>2. Definitions</Text>
                                <Text style={styles.bodyText}>
                                1. Camell Drive: The cloud storage service provided by the Company, where users can purchase storage space and manage data using CAMT.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. CAMT: The cryptocurrency used within the Service, enabling users to purchase storage or transfer CAMT to others.
                                </Text>
                                <Text style={styles.bodyText}>
                                3. Private Key: The unique identifier used to log in to the Service, which must be securely managed by the user, as it cannot be recovered once lost.
                                </Text>
                                <Text style={styles.bodyText}>
                                4. User: A person who has registered for the Service and received a private key and uses CAMT to access the Service.
                                </Text>

                                <Text style={styles.sectionTitle}>3. Private Key Management and Responsibility</Text>
                                <Text style={styles.bodyText}>
                                1. Users must create and securely store their private keys to access the Service.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. If the private key is lost, the Company cannot recover it, and users will lose access to their accounts permanently, including any stored data and purchased cloud storage. 
                                The Company is not liable for any damages resulting from this loss.
                                </Text>
                                <Text style={styles.bodyText}>
                                3. Users must not share their private key with others, and any consequences arising from such actions are the sole responsibility of the User.
                                </Text>

                                <Text style={styles.sectionTitle}>4. Use of CAMT</Text>
                                <Text style={styles.bodyText}>
                                1. CAMT is used to purchase cloud storage and to transfer to other users within Camell Drive.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. Users can purchase CAMT from the designated exchange or receive it from other users.
                                </Text>
                                <Text style={styles.bodyText}>
                                3. Cloud storage purchased with CAMT is available for the duration selected by the user, and can be extended through additional purchases.
                                </Text>

                                <Text style={styles.sectionTitle}>5. CAMT Price Volatility</Text>
                                <Text style={styles.bodyText}>
                                1. CAMT is subject to market fluctuations, and the Company is not responsible for any losses due to price changes.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. The exchange rate for CAMT when purchasing cloud storage is applied in real-time, and the Company is not liable for any losses arising from such fluctuations.
                                </Text>

                                <Text style={styles.sectionTitle}>6. Service Provision and Changes</Text>
                                <Text style={styles.bodyText}>
                                1. The Service provides a certain amount of cloud storage to users, with additional storage available for purchase using CAMT.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. The Company may change the content, usage methods, or technical specifications of the Service if necessary and will notify users in advance of such changes to minimize inconvenience.
                                </Text>
                                <Text style={styles.bodyText}>
                                3. The Company may conduct regular or irregular maintenance to provide stable service, during which the Service may be temporarily unavailable.
                                </Text>

                                <Text style={styles.sectionTitle}>7. Data Management</Text>
                                <Text style={styles.bodyText}>
                                1. Users are solely responsible for their data, and the Company will take all reasonable steps to ensure its safety.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. The Company is not liable for data loss, deletion, or modification caused by user negligence.
                                </Text>
                                <Text style={styles.bodyText}>
                                3. Users must back up their data before their purchased storage expires. The Company will not be liable for any data lost after the storage expires.
                                </Text>

                                <Text style={styles.sectionTitle}>8. Termination of Service and Refunds</Text>
                                <Text style={styles.bodyText}>
                                1. Once a user purchases cloud storage, refunds are generally not allowed. However, refunds may be issued under exceptional circumstances at the Company's discretion.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. If a user ceases to use the Service, all related data, including cloud storage, will be deleted, and the Company is not liable for any resulting data loss.
                                </Text>

                                <Text style={styles.sectionTitle}>9. User-to-User CAMT Transfers</Text>
                                <Text style={styles.bodyText}>
                                1. Users can transfer CAMT to other users within the Service, and such transactions are permanently recorded on the blockchain.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. Transfers to incorrect addresses or erroneous transactions cannot be reversed, and the Company is not responsible for any resulting losses.
                                </Text>
                                <Text style={styles.bodyText}>
                                3. The Company does not intervene in CAMT transfers between users and holds limited responsibility for technical issues or network failures during transfers.
                                </Text>

                                <Text style={styles.sectionTitle}>10. Disclaimer</Text>
                                <Text style={styles.bodyText}>
                                1. The Company is not responsible for the following:
                                </Text>
                                <Text style={styles.bodyText}>
                                - Loss of private keys or damages resulting from their exposure
                                </Text>
                                <Text style={styles.bodyText}>
                                - Losses due to CAMT price fluctuations
                                </Text>
                                <Text style={styles.bodyText}>
                                - Data loss or erroneous CAMT transfers caused by user negligence
                                </Text>
                                <Text style={styles.bodyText}>
                                - Service disruptions due to natural disasters, hacking, or other events beyond the Company's control
                                </Text>
                                <Text style={styles.bodyText}>
                                2. The Company will make every effort to provide a secure Service, but is not liable for any damages resulting from user negligence.
                                </Text>

                                <Text style={styles.sectionTitle}>11. Privacy Policy</Text>
                                <Text style={styles.bodyText}>
                                1. The Company complies with relevant laws to protect user privacy, and personal information is collected and used only to the extent necessary for Service provision.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. Users are responsible for keeping their personal information up to date and bear responsibility for any disadvantages caused by inaccurate information.
                                </Text>

                                <Text style={styles.sectionTitle}>12. Dispute Resolution</Text>
                                <Text style={styles.bodyText}>
                                1. Any disputes arising from these Terms will be resolved in the courts of the Company's jurisdiction, and the Company will make every effort to resolve disputes amicably.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. Users agree to resolve any legal disputes not specified in these Terms in accordance with applicable laws and precedents.
                                </Text>

                                <Text style={styles.sectionTitle}>13. Amendments to the Terms</Text>
                                <Text style={styles.bodyText}>
                                1. The Company may modify these Terms if necessary and will notify users at least 7 days in advance of any changes.
                                </Text>
                                <Text style={styles.bodyText}>
                                2. Users who continue to use the Service after the Terms have been amended are deemed to have agreed to the updated Terms.
                                </Text>
                        </ScrollView>
                    </View>


                <View style={styles.checkContainer}>

                    <View style={styles.agreeCheck}>
                        <Pressable onPress={toggleCheckbox} style={styles.checkIcon}>
                            <Icon 
                                name={isChecked ? 'check-box' : 'check-box-outline-blank'}
                                size={19} 
                                color="black" 
                                style={{marginRight: 5,}}
                            />
                            <Text>
                                agree to the terms of service that apply to the use of Camell Drive and all its related features.
                            </Text>
                        </Pressable>
                        
                    </View>
                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={[
                            styles.closeButton,
                            { opacity: isChecked ? 1 : 0.5 },
                            ]}
                            onPress={() => {
                                if (isChecked) {
                                    setModalVisible(false);
                                    setTimeout(() => setPrivateKeyModalVisible(true), 600);
                                }}}
                            disabled={!isChecked}
                        >
                            <Text style={styles.closeButtonText}>Agree</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalView: {
    backgroundColor: Colors.authBackground,
    padding: 20,
    height: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: Colors.primary400,
    padding: 10,
    borderRadius: 20,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600'
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
    
  },
  agreeContainer: {
      width: '100%',
      flex: 4,  // 스크롤이 적용되도록 높이를 유동적으로 설정
      borderWidth: 0.5,
      borderColor: 'black',
      marginVertical: 10,
      backgroundColor: 'snow',
  },
  scrollContainer: {
    padding: 10,
    flexGrow: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    fontStyle: 'italic',

  },
  bodyText: {
    fontSize: 14,
    marginBottom: 10,
    fontStyle: 'italic',

  },
  agreeCheck: {
    flexDirection: 'row',
    alignItems: 'center',
    top: -5,
  },
  checkIcon: {
    flexDirection: 'row'
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
    fontStyle: 'italic',

  },
  agreeTitle: {
    fontWeight: '600',
    fontSize: 15,
    margin: 10,
  },
  checkContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
});
