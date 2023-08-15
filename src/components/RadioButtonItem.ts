import styled from 'styled-components/native';
import {colors} from '../utils/colors';

export const RadioButtonItem = styled.View`
  flex-direction: row;
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  background-color: ${colors.white};
  border-radius: 6px;
  elevation: 8;
  margin-horizontal: 5px;
`;
