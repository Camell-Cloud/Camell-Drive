import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput } from 'react-native';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import SubTabScreenHeader from '../main/SubTabScreenHeader';
import { Colors } from '../Utils/colors';

export default function HelpScreen({ navigation }) {
  const [issueType, setIssueType] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    alert('To be updated.');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SubTabScreenHeader title="Customer Support" navigation={navigation} />
        <View style={styles.mainContainer}>
          <Text style={styles.label}>Please choose what kind of problem it is</Text>
          <RNPickerSelect
            onValueChange={(value) => setIssueType(value)}
            items={[
              { label: 'Technical questions', value: 'technical' },
              { label: 'Payment questions', value: 'payment' },
              { label: 'Account questions', value: 'account' },
              { label: 'Wallet problem', value: 'wallet' },
              { label: 'Other', value: 'other' },
            ]}
            placeholder={{
              label: 'Select',
              value: null,
            }}
            style={pickerSelectStyles}
          />
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Please enter a title"
          />
          <Text style={styles.label}>Content</Text>
          <TextInput
            style={styles.Contentinput}
            value={content}
            onChangeText={setContent}
            placeholder="Please enter details"
            multiline
            numberOfLines={4}
          />
          <Button
            title="Send"
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