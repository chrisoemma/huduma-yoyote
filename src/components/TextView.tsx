import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../utils/colors';
import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;

const TextView = ({
  color = colors.darkGrey,
  type,
  align = 'left',
  fontSize = null,
  fontFamily = 'Prompt-Regular',
  textTransform = 'none',
  lineHeight = undefined,
  children,
}: any) => {
  switch (type) {
    case 'tabHeading':
      fontFamily = 'Prompt-Light';
      fontSize = fontSize ? fontSize : 30;
      break;
    case 'cardTitle':
      fontFamily = 'Prompt-Regular';
      fontSize = fontSize ? fontSize : 12;
      break;

    case 'pageSubHeading':
      fontFamily = 'Prompt-SemiBold';
      fontSize = 20;
      break;

    case 'cardSubHeading':
      fontFamily = 'Prompt-SemiBold';
      color = colors.secondaryOrange;
      fontSize = fontSize ? fontSize : 16;
      break;

    case 'semiBold':
      fontFamily = 'Prompt-SemiBold';
      break;

    case 'regular':
      fontFamily = 'Prompt-Regular';
      break;

    case 'light':
      fontFamily = 'Prompt-Light';
      break;

    default:
      break;
  }

  fontSize ? fontSize : 20;

  const Text = styled.Text`
    color: ${color};
    text-align: ${align};
    font-family: ${fontFamily};
    font-size: ${fontSize}px;
    text-transform: ${textTransform};
    flex-wrap: wrap;
  `;

  return <Text style={{lineHeight: lineHeight}}>{children}</Text>;
};

export default TextView;
