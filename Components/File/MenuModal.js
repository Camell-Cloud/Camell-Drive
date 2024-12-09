import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../Colors";
import { addUpdatesStateChangeListener } from "expo-updates";


export default function MenuModal({ setModalVisible, modalVisible }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(300)).current;
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      if (modalVisible) {
        setIsVisible(true);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      } else if (!modalVisible && isVisible) {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 300,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsVisible(false);
        });
      }
    }, [modalVisible]);

    return (
      <Modal transparent={true} visible={isVisible} animationType="none">
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
        </Animated.View>
        <Animated.View style={[styles.rootContainer, { transform: [{ translateY: slideAnim }] }]}>


            <View style={styles.mainContainer}>
                <View style={styles.itemTitleContainer}>
                    <Text style={{fontSize: 16, fontWeight: '500'}}>test</Text>
                </View>
                <View style={{flex: 1}}>

                </View>
                <View style={styles.itemContainer}>

                    <Pressable style={styles.item}>
                        <Text style={styles.itemText}>Change file name</Text>
                    </Pressable>

                    <Pressable style={styles.item}>
                        <Text style={styles.itemText}>Download</Text>
                    </Pressable>

                    <Pressable style={styles.item}>
                        <Text style={styles.itemText}>Favorite</Text>
                    </Pressable>

                    <Pressable style={styles.item}>
                        <Text style={styles.itemText}>Share</Text>
                    </Pressable>

                    <Pressable style={styles.item}>
                        <Text style={styles.itemText}>Move to bin</Text>
                    </Pressable>

                    <Pressable style={styles.item}>
                        <Text style={styles.itemText}>Show Detail</Text>
                    </Pressable>
                </View>
            </View>
        </Animated.View>
      </Modal>
    );
  }
  

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  rootContainer: {
    backgroundColor: Colors.background,
    width: "100%",
    position: "absolute",
    bottom: 0,
    height: 300,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 24,
},
mainContainer: {
    flex: 1
},
itemTitleContainer: {
    borderBottomWidth: 0.5,
    flex: 2,
    justifyContent: 'center'
},
itemContainer: {
    flex : 17,
    justifyContent: 'space-between'
},

item: {
    padding: 5,
},
itemText: {
    fontSize: 14,
},
  pressed: {
    opacity: 0.25
  }
});
