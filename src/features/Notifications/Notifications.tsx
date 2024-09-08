import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, FlatList, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import NotificationItem from '../../components/NotificationItem';
import CustomModal from '../../components/CustomModal';
import { colors } from '../../utils/colors';
import { globalStyles } from '../../styles/global';
import { markAsViewed, removeNotification } from './NotificationSlice';
import { useTranslation } from 'react-i18next';

const Notifications = () => {
  const stylesGlobal = globalStyles();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootStateOrAny) => state.notifications.notifications);
  const { isDarkMode } = useSelector((state: RootStateOrAny) => state.theme);
  const [isContentModalVisible, setContentModalVisible] = useState(false);
  const [content, setContent] = useState<any>({});

  const openContentModal = (item: any) => {
    setContent(item);
    dispatch(markAsViewed(item.id)); 
    setContentModalVisible(true);
  };

  const closeContentModal = () => {
    setContentModalVisible(false);
    setContent({});
  };


  const handleRemoveNotification = (notificationId: string) => {
    dispatch(removeNotification(notificationId));
  };

  return (
    <SafeAreaView style={[stylesGlobal.scrollBg, { backgroundColor: isDarkMode ? colors.darkBackground : colors.lightBackground }]}>
      <View style={styles.listContainer}>
        {notifications.length === 0 ? (
          <Text style={[styles.noNotificationsText, { color: isDarkMode ? colors.lightGrey : colors.grey }]}>
            {t('screens:noNotificationFound')}
          </Text>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <NotificationItem 
                notification={item} 
                removeNotification={handleRemoveNotification}
                openContentModal={openContentModal}
              />
            )}
          />
        )}
      </View>
      <CustomModal isVisible={isContentModalVisible} onClose={closeContentModal}>
        {content && (
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: content.type === 'Account' ? colors.primary : colors.secondary }]}>
              {content.title}
            </Text>
            <Text style={[styles.modalMessage, { color: colors.black }]}>
              {content.message}
            </Text>
          </View>
        )}
      </CustomModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    marginHorizontal: 5,
    paddingVertical: 20,
  },
  noNotificationsText: {
    fontSize: 16,
    fontFamily: 'Prompt-Regular', 
    textAlign: 'center',
    marginTop: 20,
  },
  modalContent: {
    marginHorizontal: 15,
    marginVertical: 20,
  },
  modalTitle: {
    alignSelf: 'center',
    fontSize: 15,
    fontFamily: 'Prompt-Regular', 
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    fontFamily: 'Prompt-Regular',
    marginTop: 10,
  },
});

export default Notifications;
