import React from 'react';
import LottieView from 'lottie-react-native';
import styled from 'styled-components/native';
import {colors} from '../utils/colors';
import {Dimensions, View} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import TextView from './TextView';
import {globalStyles} from '../style/global';

const width = Dimensions.get('window').width;

const RequestStatusView = ({request}: any) => {
  let backgroundColor = colors.dullYellow;

  //TODO set up the colors based on what's available from API
  //   switch (request.status) {
  //       case 'value':

  //           break;

  //       default:
  //           break;
  //   }

  const Container = styled.View`
    background-color: ${backgroundColor};
    width: ${width}px;
    padding-horizontal: 16px;
    padding-vertical: 8px;
  `;

  const IconContainer = styled.View`
    background-color: ${colors.fadedWhite};
    width: 50px;
    height: 50px;
    border-radius: 50px;
    padding: 10px;
    align-items: center;
    justify-content: center;
  `;

  const RowView = styled.View`
    flex-direction: row;
    justify-content: space-between;
  `;

  const PillView = styled.View`
    padding-horizontal: 10px;
    padding-vertical: 5px;
    background-color: ${colors.fadedWhite};
    border-radius: 8px;
  `;

  return (
    <Container>
      <RowView>
        <IconContainer>
          <FontAwesome5 name="user-md" color={colors.white} size={20} />
        </IconContainer>

        <View>
          <LottieView
            style={{width: 50, height: 50}}
            source={require('./../../assets/lottie/pulse-circle.json')}
            autoPlay
            loop
          />
        </View>
      </RowView>

      <RowView style={globalStyles.marginTop20}>
        <View>
          <TextView
            type="semiBold"
            fontSize="18"
            color={colors.white}
            textTransform="capitalize">
            Dr. ABC DEF
          </TextView>
          <TextView
            type="regular"
            fontSize="14"
            color={colors.white}
            textTransform="capitalize">
            5km away
          </TextView>
        </View>

        <View>
          <PillView>
            <TextView
              type="semiBold"
              fontSize="12"
              color={colors.white}
              textTransform="uppercase">
              Home Visit
            </TextView>
          </PillView>
        </View>
      </RowView>
    </Container>
  );
};

export default RequestStatusView;
