import styled from 'styled-components/native';
import {colors} from '../utils/colors';
import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
export const Container = styled.View`
  flex: 1;
  background-color: ${colors.whiteBackground};
  padding-bottom: 30px;
  width: ${width}px;
  height:100%;
`;
