import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { colors } from '../../utils/colors';


const CustomModal = ({ children, isVisible, onClose }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);

  const handleGesture = (event) => {
    const { translationY, state } = event.nativeEvent;

    if (state === State.ACTIVE) {
      setSwipeOffset(translationY);
    } else if (state === State.END) {
      if (translationY > 100) {
        onClose();
      }
      setSwipeOffset(0);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <Modal
        isVisible={isVisible}
        onBackdropPress={onClose}
        swipeDirection="down"
        backdropOpacity={0.3} 
        onSwipeComplete={onClose}
        style={styles.modal}
      >
        <PanGestureHandler onGestureEvent={handleGesture} onHandlerStateChange={handleGesture}>
          <View style={[styles.modalContent, { transform: [{ translateY: swipeOffset }] }]}>
            <View style={styles.header}>
              <View style={styles.handle} />
            </View>
            {children}
            <View style={styles.divider} />
            <TouchableOpacity onPress={onClose} style={styles.footerButton}>
              <Text style={styles.footerText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </PanGestureHandler>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    padding: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  footerButton: {
    padding: 15,
    alignItems: 'center',
  },
  footerText: {
    color:colors.secondary,
    fontFamily: 'Prompt-Regular',
    fontSize: 16,
  },
});

export default CustomModal;
