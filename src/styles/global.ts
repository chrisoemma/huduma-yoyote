import { StyleSheet } from 'react-native';
import { useSelector,RootStateOrAny } from 'react-redux';
import { colors } from '../utils/colors';

  const globalStyles = () => {
 
  const {isDarkMode} = useSelector(
    (state: RootStateOrAny) => state.theme,
  );

  const containerBackgroundColor = isDarkMode ? 'black' : colors.lightGrey;
  const scrollBgBackgroundColor = isDarkMode ? 'black' : colors.whiteBackground;
  const textInputColor = isDarkMode ? 'white' : 'black';
  const buttonText = isDarkMode ? colors.white : colors.primary;
  const borderColor = isDarkMode ? 'gray' : colors.lightGrey;
  const shadowColor = isDarkMode ? '#000' : 'transparent';

  const styles= StyleSheet.create({
    container: {
      backgroundColor: containerBackgroundColor,
      marginHorizontal: 16,
    },
    scrollBg: {
      height: '100%',
      backgroundColor: scrollBgBackgroundColor,
    },
    searchInput: {
      marginLeft: 15,
      padding: 10,
      fontSize: 16,
      color: textInputColor,
    },
    autocompleteContainer: {
      position: 'absolute',
      top: 50,
      left: 0,
      padding: 15,
      right: 0,
      zIndex: 1000,
      backgroundColor: isDarkMode ? 'black' : 'white',
      borderWidth: 1,
      borderColor: borderColor,
      borderRadius: 20,
      maxHeight: 150,
      overflow: 'scroll',
      elevation: 2,
      shadowColor: shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDarkMode ? 0.25 : 0,
      shadowRadius: isDarkMode ? 3.84 : 0,
    },
    appView: {
      margin: 10,
    },
    categoryWrapper: {
      
     // flexDirection: 'row',
     // flexWrap: 'wrap',
    },
    seeAll: {
      marginTop: 8,
      paddingRight: 10,
      color: colors.secondary,
      fontSize: 13,
    },
    topServices: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    serviceText: {
      color: isDarkMode ? 'white' : colors.black,
      fontSize: 17,
      marginBottom: 3,
    },
    homepageHeader: {
      zIndex: 1000,
      height: 100,
      width: '100%',
      backgroundColor: colors.secondary,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
    },
    searchContainer: {
      marginTop: '3%',
    },
    search: {
      height: 50,
      width: '72%',
      backgroundColor: colors.primary,
      marginLeft: 10,
      borderRadius: 30,
    },
    searchText: {
      color: colors.white,
      fontSize: 17,
      marginLeft: 5,
    },
    searchContent: {
      flexDirection: 'row',
      marginLeft: 10,
      marginVertical: 15,
    },
    verticalLogo: {
      width: '60%', 
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    horizontalLogo: {
      width: 150,
      height: '63%',
      resizeMode: 'contain',
      alignSelf: 'center',
    },
    banner: {
      zIndex: 1,
      marginHorizontal: 10,
      marginVertical: 8,
      elevation: 4,
      shadowColor: shadowColor,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: isDarkMode ? 0.25 : 0,
      shadowRadius: isDarkMode ? 3.84 : 0,
    },
     
    centerView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    largeHeading: {
      fontFamily: 'Prompt-Black',
      textTransform: 'uppercase',
      fontSize: 60,
      textAlign: 'center',
      color: colors.primary,
    },
    mediumHeading: {
      fontFamily: 'Prompt-Bold',
      textTransform: 'capitalize',
      fontSize: 35,
      textAlign: 'left',
      justifyContent: 'flex-start',
      lineHeight: 40,
      color: colors.primary,
    },
    smallHeading: {
      fontFamily: 'Prompt-Bold',
      fontSize: 27,
      color: colors.primary,
    },
    errorMessage: {
      color: colors.dangerRed,
      fontFamily: 'Prompt-Regular',
    },
    separator: {
      borderWidth: 0.4,
      backgroundColor: borderColor,
      marginVertical: 8,
    },
    inputFieldTitle: {
      fontFamily: 'Prompt-Regular',
      color: colors.primary,
      fontSize: 16,
    },
    touchableOpacityPlain: {},
    touchablePlainTextSecondary: {
      fontFamily: 'Prompt-Regular',
      color: colors.secondary,
      fontSize: 16,
    },
    primaryButton: {
      backgroundColor: colors.primary,
      height: 70,
      borderRadius: 6,
      justifyContent: 'center',
    },
    smallTransparentButton: {
      borderRadius: 4,
      justifyContent: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    primaryButtonText: {
      fontFamily: 'Prompt-Regular',
      color: buttonText,
      fontSize: 18,
      textAlign: 'center',
    },
    passwordInputContainer: {
      backgroundColor:colors.white,
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    passwordInputField: {
      fontFamily: 'Prompt-Regular',
      height: 65,
      fontSize: 14,
      width: '90%',
      paddingHorizontal: 10,
      color: textInputColor,
    },
    phoneInputContainer: {
      backgroundColor: colors.white,
      width: '100%',
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
      height: 70,
    },
    phoneInputTextContainer: {
      paddingHorizontal: 10,
      marginHorizontal: 10,
      backgroundColor: colors.white ,
    },
    phoneInputField: {
      fontFamily: 'Prompt-Regular',
      fontSize: 15,
      padding: 0,
      color: colors.black,
    },
    radioButtonLabel: {
      fontFamily: 'Prompt-Regular',
      fontSize: 9,
      textAlign: 'center',
    },
    pickerInput: {
      backgroundColor: isDarkMode ? 'black' : 'white',
      width: '100%',
      borderRadius: 6,
      flexDirection: 'row',
      alignItems: 'center',
    },
    marginTop10: {
      marginTop: 10,
    },
    marginTop20: {
      marginTop: 20,
    },
    marginTop30: {
      marginTop: 30,
    },
    marginTop60: {
      marginTop: 60,
    },
    uploadView: {
      marginTop: 30,
    },
    linkButton: {
      paddingLeft: 17,
      color: colors.primary,
      fontSize: 16,
    },
    uploadBtn: {
      marginVertical: 10,
      backgroundColor: colors.lightBlue,
      height: 40,
      width: '50%',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    attachmentDiv: {
      flexDirection: 'row',
    },
    textChange: {
      fontSize: 17,
      color: colors.lightBlue,
    },
    displayDoc: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      height: 150,
      width: 150,
    },
    pdf: {
      flex: 1,
      width: 200,
      height: 200,
    },
    mainContainer: {
      flexDirection: 'row',
    },
    side: {
      flexDirection: 'column',
      height: '100%',
      width: '25%',
      backgroundColor: isDarkMode ? 'black' : colors.lightGrey,
    },
    sub: {
      flex: 1,
      flexDirection: 'column',
      paddingHorizontal: 5,
    },
    floatingButton: {
      position: 'absolute',
      bottom: 20,
      right: 20,
      padding: 10,
      borderRadius: 5,
      backgroundColor: isDarkMode ? colors.darkGrey : colors.primary,
    },
    floatingBtnText: {
      color: colors.white,
      fontSize: 16,
    },
    circle: {
      width: 100,
      height: 100,
      borderRadius: 100,
      backgroundColor: isDarkMode ? '#2C2C2C' : '#F7F6FF',
      alignSelf: 'center',
    },
    chooseServiceBtn: {
      marginVertical: 5,
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    chooseBtn: {
      marginHorizontal: 3,
      backgroundColor: isDarkMode ? colors.secondary : colors.primary,
      padding: 5,
      borderRadius: 5,
    },
    otherBtn: {
      marginHorizontal: 3,
      backgroundColor: isDarkMode ? colors.warningYellow : colors.primary,
      padding: 5,
      borderRadius: 5,
    },
  });

  return styles
};

export { globalStyles };

