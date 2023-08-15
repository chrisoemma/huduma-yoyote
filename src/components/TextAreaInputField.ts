import styled from 'styled-components/native';
import {colors} from '../utils/colors';

export const TextAreaInputField = styled.TextInput`
  font-family: 'Prompt-Regular';
  height: 100px;
  background-color: ${colors.white};
  border-radius: 8px;
  font-size: 14px;
  padding-horizontal: 10px;
  border-width: 1px;
  border-color: ${colors.alsoLightGrey};
`;
