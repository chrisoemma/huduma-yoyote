import React from 'react';
import styled from 'styled-components/native';
import {colors} from '../utils/colors';
import {Text} from 'react-native';
import TextView from './TextView';

const Avatar = ({name, dimensions}: any) => {
  const View = styled.View`
    background-color: ${colors.primaryBlue};
    color: ${colors.white}
    height: ${dimensions}px;
    width: ${dimensions}px;
    border-radius: ${dimensions}px;
    justify-content: center;
    align-items:center;
    margin-vertical: 15px;
  `;

  name = name ? name : 'Daktari Nyumbani';

  const getInitialsFromName = (name: string): string => {
    let initials = name
      .replace(/[^\p{L}\s]|_|\d/gu, '') // remove all non letters from the string
      .replace(/\s+/g, ' ') // trailing space to single char
      .replace(/^\s+|\s+$/g, '') // remove spaces in the begining and the end
      .split(' ') // split the string to the array of names
      .filter((word, index, arr) => index === 0 || index === arr.length - 1)
      // get the first and last names only
      .map(word => word.substr(0, 1)) // get the first letters from the names
      .join('') // convert to string
      .toUpperCase(); // and make the initials uppercased

    if (initials.length === 0) {
      return '#'; // in our case, if there are no initals it's a number
    }
    return initials.substr(0, 2); // return just the first two letters from the name
  };

  return (
    <View>
      <TextView
        fontSize={dimensions * 0.35}
        type="semiBold"
        color={colors.white}>
        {getInitialsFromName(name)}
      </TextView>
    </View>
  );
};

export default Avatar;
