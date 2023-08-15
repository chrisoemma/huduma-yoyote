import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { colors } from '../utils/colors'


const ActionLoader = ({ action, text }: any) => {
  return (
    <View style={{
      alignItems: 'center',
      zIndex: 1000,
      marginTop: 100,
      position: 'absolute',
      left: '25%',
      backgroundColor: colors.white,
      padding: 20
    }}>
      <ActivityIndicator
        color={colors.primaryBlue}
      />
      <Text>{text}...</Text>
    </View>
  )
}

export default ActionLoader