import React, { useEffect, useRef, useState } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "./Colors";
import IconA from 'react-native-vector-icons/AntDesign'
import IconI from 'react-native-vector-icons/Ionicons'

export default function PlusMenuAction({ setModalVisible, modalVisible, pageType }) {
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
  
    const items = pageType === "file" 
      ? [
          { icon: "addfile", text: "Upload File", action: () => console.log("Upload File"), iconComponent: IconA },
          { icon: "addfolder", text: "Create Folder", action: () => console.log("Create Folder"), iconComponent: IconA },
          { icon: "camerao", text: "Photo shoot", action: () => console.log("Photo Shoot"), iconComponent: IconA },
        ]
      : [
          { icon: "picture", text: "Upload Media", action: () => console.log("Upload Media"), iconComponent: IconA },
          { icon: "albums-outline", text: "Create Album", action: () => console.log("Create Album"), iconComponent: IconI },
          { icon: "camerao", text: "Photo shoot", action: () => console.log("Photo Shoot"), iconComponent: IconA },
        ];
  
    return (
      <Modal transparent={true} visible={isVisible} animationType="none">
        <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
          <Pressable style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
        </Animated.View>
        <Animated.View style={[styles.rootContainer, { transform: [{ translateY: slideAnim }] }]}>
          {items.map((item, index) => (
            <Pressable
              key={index}
              onPress={item.action}
              style={({ pressed }) =>
                pressed
                  ? [styles.itemContainer, styles.pressed]
                  : styles.itemContainer
              }
            >
              <item.iconComponent name={item.icon} size={22} color="black" />
              <Text style={styles.itemText}>{item.text}</Text>
            </Pressable>
          ))}
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
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    justifyContent: 'space-around'
},
itemContainer: { 
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
},
  itemText: {
    fontSize: 15,
    marginLeft: 7,
  },
  pressed: {
    opacity: 0.25
  }
});
