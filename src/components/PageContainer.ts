import styled from 'styled-components/native';
import { colors } from '../utils/colors';
import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const PageContainer = styled.View`
  flex: 1;
  background-color: ${colors.lightGrey};

  padding-bottom: 30px;
  width: ${width}px;
  min-height: ${height}px;
`;

// align-items: center;
//   justify-content: center;
