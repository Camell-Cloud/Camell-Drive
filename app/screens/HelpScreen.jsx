import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import SubTabScreenHeader from '../main/SubTabScreenHeader';
import { Colors } from '../theme/color';

export default function HelpScreen({ navigation }) {
  const [issueType, setIssueType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    alert('정보가 제출되었습니다!');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SubTabScreenHeader title="고객 지원" navigation={navigation} />
        <View style={styles.mainContainer}>
          <Text style={styles.label}>어떤 문제인지 선택하세요</Text>
          <RNPickerSelect
            onValueChange={(value) => setIssueType(value)}
            items={[
              { label: '기술문의', value: 'technical' },
              { label: '결제문제', value: 'payment' },
              { label: '계정문제', value: 'account' },
              { label: '지갑문제', value: 'wallet' },
              { label: '기타', value: 'other' },
            ]}
            placeholder={{
              label: '선택',
              value: null,
            }}
            style={pickerSelectStyles}
          />
          <Text style={styles.label}>제목</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="제목을 입력하세요"
          />
          <Text style={styles.label}>내용</Text>
          <TextInput
            style={styles.Contentinput}
            value={content}
            onChangeText={setContent}
            placeholder="상세 내용을 입력하세요"
            multiline
            numberOfLines={4}
          />
          <Button
            title="보내기"
            onPress={handleSubmit}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  Contentinput: {
    height: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    marginBottom: 50,
    paddingHorizontal: 10,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});