import { Pressable, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/Entypo";
import Colors from "./Colors";
import PlusMenuAction from "./PlusMenuAction";
import { useState } from "react";

export default function PlusMenu({ pageType }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Pressable style={styles.rootContainer} onPress={() => setModalVisible(true)}>
      <Icon name="plus" size={40} color="white" />
      <PlusMenuAction
        setModalVisible={setModalVisible}
        modalVisible={modalVisible}
        pageType={pageType}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: Colors.primary400,
    padding: 10,
    borderRadius: 50,
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 30,
  },
});
