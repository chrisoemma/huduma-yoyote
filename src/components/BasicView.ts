import styled from 'styled-components/native';
import {colors} from '../utils/colors';
import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

export const BasicView = styled.View`
  width: ${width - 32}px;
  align-self: center;
`;
