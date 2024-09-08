import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors } from '../utils/colors'; // Assume you have light and dark mode colors defined here
import { useDispatch, useSelector } from 'react-redux';
import { markAsViewed, removeNotification } from '../features/Notifications/NotificationSlice';


const NotificationItem = ({ notification, openContentModal }: any) => {
  const dispatch = useDispatch();
  const { id, type, title, message, viewed } = notification;

  const typeColor = type === 'Account' ? colors.primary : colors.secondary;
  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const handleNotificationPress = () => {
    dispatch(markAsViewed(id));  // Mark notification as viewed
    openContentModal(notification);
  };

  const renderRightActions = () => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => dispatch(removeNotification(id))}
    >
      <AntDesign name="delete" size={24} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        style={[
          styles.notificationItem,
          viewed 
            ? (isDarkMode ? styles.viewedDark : styles.viewedLight)
            : (isDarkMode ? styles.notViewedDark : styles.notViewedLight),
        ]}
        onPress={handleNotificationPress}
      >
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationType, { color: typeColor }]}>{type}</Text>
          <View 
            style={[
              styles.notificationDot, 
              viewed 
                ? styles.viewedDot 
                : styles.notViewedDot,
            ]}
          />
        </View>
        <Text style={[styles.notificationTitle, {color: isDarkMode ? colors.white : colors.black}]}>{title}</Text>
        <Text style={[styles.notificationMessage, {color: isDarkMode ? colors.white : colors.black}]}
          numberOfLines={2}
          ellipsizeMode="tail" 
        >{message}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    padding: 15,
  },
  viewedLight: {
    backgroundColor: colors.white,
  },
  notViewedLight: {
    backgroundColor: colors.lightGrey,
    borderWidth: 0.6,
    borderColor: colors.primary,
  },
  viewedDark: {
    // backgroundColor: colors.darkGrey,
    borderWidth: 0.6,
  },
  notViewedDark: {
    // backgroundColor: colors.alsoLightGrey,
    borderWidth: 0.6,
    borderColor: colors.alsoGrey,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  notificationType: {
    fontSize: 16,
    fontFamily: 'Prompt-Regular', // Apply custom font
    fontWeight: 'bold',
  },
  notificationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  viewedDot: {
    backgroundColor: colors.grey,
  },
  notViewedDot: {
    backgroundColor: colors.dangerRed,
  },
  notificationTitle: {
    fontSize: 15,
    fontFamily: 'Prompt-Bold', // Apply custom font
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 13,
    fontFamily: 'Prompt-Regular', // Apply custom font
  },
  deleteButton: {
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: '100%',
    paddingHorizontal: 10,
  },
});

export default NotificationItem;
