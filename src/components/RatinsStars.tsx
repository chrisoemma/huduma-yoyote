import React from 'react';
import styled from 'styled-components/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {colors} from '../utils/colors';

const RatingStars = ({rating}: any) => {
  const Container = styled.View`
    flex-direction: row;
    align-self: baseline;
  `;

  if (rating > 5) {
    rating = 5;
  }

  if (rating <= 0) {
    rating = 0;
  }

  const Star = ({currentIndex}: any) => {
    let solid = false;

    if (rating >= currentIndex) {
      solid = true;
    }
    return (
      <FontAwesome5 name="star" color={colors.gold} size={15} solid={solid} />
    );
  };

  return (
    <Container>
      {[...Array(5)].map((e, i) => (
        <Star currentIndex={i + 1} />
      ))}
    </Container>
  );
};

export default RatingStars;
