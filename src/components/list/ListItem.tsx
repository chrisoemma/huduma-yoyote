import React from 'react';
import styled from 'styled-components/native';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import TextView from '../TextView';
import { colors } from '../../utils/colors';
import Avatar from '../Avatar';

const ListItem = ({ avatarName = 'NA', title, description, onPress, refreshControl }: any) => {
  const ListRowView = styled.TouchableOpacity`
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-bottom-width: 0.5px;
    border-bottom-color: ${colors.justGrey};
    margin-bottom: 5px;
  `;

  const ListItemContent = styled.View`
    align-items: flex-start;
    justify-content: flex-start;
    align-content: flex-start;
    padding-left: 10px;
  `;

  const navigation = useNavigation();

  return (
    <ListRowView onPress={onPress}

    >
      <View>
        <Avatar name={avatarName} dimensions={50} />
      </View>
      <ListItemContent>
        <TextView fontSize={15} color={colors.primaryBlue} type="semiBold">
          {title}
        </TextView>
        <TextView fontSize={12} color={colors.darkGrey} type="regular">
          {description}
        </TextView>
      </ListItemContent>
    </ListRowView>
  );
};

export default ListItem;
