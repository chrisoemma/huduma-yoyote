import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../utils/colors';
import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

const Card = ({
  onPress,
  backgroundColor = colors.white,
  width = 120,
  height = 100,
  borderRadius = 18,
  elevation = 20,
  paddingVertical = 8,
  paddingHorizontal = 5,
  marginHorizontal = 0,
  marginVertical = 15,
  justifyContent = 'center',
  alignItems = 'center',
  children,
}: any) => {
  const CardView = styled.TouchableOpacity`
    background-color: ${backgroundColor};
    width: ${width}px;
    min-height: ${height}px;
    align-items: ${alignItems};
    justify-content: ${justifyContent};
    border-radius: ${borderRadius}px;
    elevation: ${elevation};
    padding-vertical: ${paddingVertical}px;
    padding-horizontal: ${paddingHorizontal}px;
    margin-vertical: ${marginVertical}px;
    margin-horizontal: ${marginHorizontal}px;
  `;

  return <CardView onPress={onPress}>{children}</CardView>;
};

export default Card;
