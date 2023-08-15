import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../utils/colors';
import {ActivityIndicator, Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

const Button = ({
  loading,
  onPress,
  children,
  height = 60,
  backgroundColor = colors.primary,
  elevation = 0,
}: any) => {
  const TouchableOpacity = styled.TouchableOpacity`
    background-color: ${backgroundColor};
    align-items: center;
    height: ${height}px;
    width: ${width - 32}px;
    border-radius: 6px;
    justify-content: space-around;
    margin-vertical: 15px;
    elevation: ${elevation};
  `;

  return (
    <TouchableOpacity disabled={loading} onPress={onPress}>
      {loading ? (
        <ActivityIndicator size={20} color={colors.white} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

export default Button;
