import React, {useState} from 'react';
import {View, Dimensions, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import {Rating} from 'react-native-ratings';
import { BasicView } from './BasicView';
import { globalStyles } from '../styles/global';
import TextView from './TextView';
import { colors } from '../utils/colors';
import { TextAreaInputField } from './TextAreaInputField';
import { RowView } from './Views';
import { useTranslation } from 'react-i18next';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export const ModalView = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;

export const Container = styled.View`
  width: ${width}px;
  height: ${height * 0.45}px;
  background-color: ${colors.white};
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  padding-top: 10px;
`;

export const ModalHandle = styled.View`
  width: 100px;
  height: 7px;
  background-color: ${colors.primary};
  border-radius: 10px;
  align-self: center;
`;

export const ModalFooter = styled.View`
  width: ${width}px;
  height: 80px;
  background-color: ${colors.white};
  padding-vertical: 10px;
  justify-self: flex-end;
`;

function RatingModal({visible, cancel, confirm}: any) {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState();

  const ratingCompleted = (rating: any) => {
    console.log(rating);
    setRating(rating);
  };

  const { t } = useTranslation();

  return (
    <View style={{flex: 1, borderWidth: 1}}>
      <Modal
        style={{margin: 0, padding: 0}}
        isVisible={visible}
        swipeDirection="up"
        useNativeDriver={true}
        onBackdropPress={() => {
          cancel();
        }}
        hideModalContentWhileAnimating={true}>
        <ModalView>
          <Container>
            <ModalHandle />
            <BasicView style={globalStyles().marginTop30}>
              <TextView fontSize={26} color={colors.darkGrey} type="tabHeading">
               {t('screens:rateService')}
              </TextView>
            </BasicView>
            <BasicView>
              <Rating
                showRating
                onFinishRating={ratingCompleted}
                style={{paddingVertical: 10}}
              />
              <View style={{paddingTop: 15}}>
                <TextAreaInputField
                  placeholder={t('screens:enterComment')}
                  onChangeText={setComment}
                  value={comment}
                />
              </View>
            </BasicView>
          </Container>
          <ModalFooter>
            <BasicView>
              <RowView>
                <TouchableOpacity
                  onPress={() => cancel()}
                  style={globalStyles().smallTransparentButton}>
                  <TextView
                    type="semiBold"
                    fontSize={16}
                    color={colors.dangerRed}>
                    {t('screens:cancel')}
                  </TextView>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => confirm({comment, rating})}
                  style={[
                    globalStyles().smallTransparentButton,
                    {
                      backgroundColor: colors.primary,
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                    },
                  ]}>
                  <TextView type="semiBold" fontSize={16} color={colors.white}>
                   {t('screens:submitRating')}
                  </TextView>
                </TouchableOpacity>
              </RowView>
            </BasicView>
          </ModalFooter>
        </ModalView>
      </Modal>
    </View>
  );
}

export default RatingModal;
