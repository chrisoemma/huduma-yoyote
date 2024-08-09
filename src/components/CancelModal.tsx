// RatingModal.js
import React, { useEffect, useState } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import Modal from 'react-native-modal';
import { Rating } from 'react-native-ratings';
import { BasicView } from './BasicView';
import { globalStyles } from '../styles/global';
import TextView from './TextView';
import { colors } from '../utils/colors';
import { TextAreaInputField } from './TextAreaInputField';
import { RowView } from './Views';
import { useTranslation } from 'react-i18next';
import RatingTemplate from './RatingTemplate';
import { useSelector } from 'react-redux';
import { selectLanguage } from '../costants/languageSlice';


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
  height: ${height * 0.4}px;
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

function CancelModal({ visible, cancel, confirmCancel, cancelData }:any) {
    const [templateOptions, setTemplateOptions] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const selectedLanguage = useSelector(selectLanguage);

   
    useEffect(() => {
        setSelectedIds([]);
        setTemplateOptions(cancelData.map(item => ({
          id: item.id,
          reason: selectedLanguage === 'en' ? item.reason.en : item.reason.sw,
        })));
      }, [cancelData, selectedLanguage]);



        const handleSelect = (selectedOptions) => {
            const ids = selectedOptions.map(option => option.id);
            setSelectedIds(ids);
          };

          const { t } = useTranslation();


          return (
            <View style={{ flex: 1, borderWidth: 1 }}>
              <Modal
                style={{ margin: 0, padding: 0 }}
                isVisible={visible}
                swipeDirection="up"
                useNativeDriver={true}
                onBackdropPress={() => cancel()}
                hideModalContentWhileAnimating={true}>
                <ModalView>
                  <Container>
                    <ModalHandle />
                    <BasicView>
                
                      <View style={{ paddingTop: 15 }}>
                        <View style={{ marginVertical: 15 }}>
                          <RatingTemplate options={templateOptions} onSelect={handleSelect} />
                        </View>
                   
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
                          onPress={() => confirmCancel({selectedIds })}
                          style={[
                            globalStyles().smallTransparentButton,
                            {
                              backgroundColor: colors.secondary,
                              paddingVertical: 10,
                              paddingHorizontal: 20,
                            },
                          ]}>
                          <TextView type="semiBold" fontSize={16} color={colors.white}>
                            {t('screens:cancelRequest')}
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

export default CancelModal