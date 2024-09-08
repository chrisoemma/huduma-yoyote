import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';
import { colors } from '../src/utils/colors';


const CustomAlert = ({ isVisible, onConfirm, onCancel, title, message }) => {

  const { t } = useTranslation();

  return (
    <Modal 
    backdropOpacity={0.3} 
    isVisible={isVisible}>
      <View style={styles.modalContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <Text style={[styles.buttonText,{color:'red'}]}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onConfirm}>
            <Text style={[styles.buttonText,{color:colors.secondary}]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Prompt-Bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    fontFamily: 'Prompt-Regular',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: 'Prompt-Regular',
    fontSize: 16,
  },
});

export default CustomAlert;
