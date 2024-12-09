import { Pressable, SafeAreaView, StyleSheet, TextInput, View } from "react-native";
import { useNavigation } from '@react-navigation/native';
import IconI from 'react-native-vector-icons/Ionicons';
import Colors from "./Colors";
import { useState } from "react";

export default function Header() {
  const [text, setText] = useState("");

  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        {/* 메뉴 */}
        <Pressable onPress={() => navigation.openDrawer()}>
          <IconI name="menu-sharp" size={35} color="black" />
        </Pressable>

        {/* 검색 */}
        <View style={styles.searchContainer}>
          <IconI name="search-outline" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={(inputText) => setText(inputText)}
            placeholder="Search the files..."
            placeholderTextColor="#888"
          />
        </View>

        {/* 프로필 */}
        <Pressable onPress={() => console.log("Profile Pressed")}>
          <IconI name="person-circle-outline" size={35} color="black" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,

  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
    justifyContent: 'space-between',
    width: '100%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    width: 240,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
