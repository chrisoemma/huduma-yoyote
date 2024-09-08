import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import CustomModal from './CustomModal';
import { colors } from '../../utils/colors';



const EditRemoveModal = ({ isVisible, onClose, onEdit, onRemove }) => {
  return (
    <CustomModal isVisible={isVisible} onClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.modalItem} onPress={onEdit}>
          <Icon name="edit" color={colors.black} size={20} />
          <Text style={styles.modalText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.modalItem} onPress={onRemove}>
          <Icon name="close" color={colors.black} size={20} />
          <Text style={styles.modalText}>Remove Item</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 15,
    marginVertical: 15,
  },
  modalItem: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  modalText: {
    fontSize: 17,
    fontFamily: 'Prompt-Regular',
    marginLeft: 20,
    color: colors.black,
  },
});

export default EditRemoveModal;
