import styled from 'styled-components/native';
import {colors} from '../utils/colors';
import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

export const RowView = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;
