import React from 'react';
import { StyleSheet } from 'react-native';
import { colors } from '../utils/colors';

export const globalStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGrey,
    marginHorizontal: 16,
  },
  scrollBg:{
  height:'100%',
  backgroundColor:colors.whiteBackground
},

  appView:{
   margin:10
  },
  categoryWrapper:{
      flexDirection:'row',
      flexWrap:'wrap'
  },
  seeAll:{
    marginTop:8,
    paddingRight:10,
    color:colors.secondary,
    fontSize:13
  },
  topServices:{
    flexDirection:'row',
    flexWrap:'wrap'
  },
  serviceText:{
   color:colors.black,
   fontSize:17,
   marginBottom:8
  },
  homepageHeader:{
   height:100,
   width:'100%',
   backgroundColor:colors.primary,
   borderBottomLeftRadius:20,
   borderBottomRightRadius:20
  },
  searchContainer:{
    marginTop:'8%'
  },
  search:{
   height:50,
   width:'72%',
   backgroundColor:colors.lightBlue,
   marginLeft:10,
   borderRadius:30,   
  },
  searchText:{
   color:colors.white,
   fontSize:17,
   marginLeft:5
  },
  searchContent:{
    flexDirection:'row',
    marginLeft:10,
    marginVertical:15
  },
  verticalLogo: {
    width: 160,
    height: 200,
  },
  horizontalLogo: {
    width: 150,
    height: 50,
  },
 
    banner: {
      marginHorizontal:10,
      marginVertical:15,
      borderRadius:10
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
  errorMessage: {
    color: colors.dangerRed,
    fontFamily: 'Prompt-Regular',
  },
  separator:{
    borderWidth:0.4,
    backgroundColor:colors.lightGrey,
    marginVertical:8 
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
    color: colors.white,
    fontSize: 18,
    textAlign: 'center',
  },

  passwordInputContainer: {
    backgroundColor: 'white',
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
  },

  phoneInputContainer: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    height: 70,
  },
  phoneInputTextContainer: {
    paddingHorizontal: 10,
    marginHorizontal: 10,
    backgroundColor: colors.white,
  },
  phoneInputField: {
    fontFamily: 'Prompt-Regular',
    fontSize: 15,
    padding: 0,
  },
  radioButtonLabel: {
    fontFamily: 'Prompt-Regular',
    fontSize: 9,
    textAlign: 'center',
  },

  pickerInput: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  //PADDING & MARGINS
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
    fontSize: 16
  },
  uploadBtn: {
    marginVertical: 10,
    backgroundColor: colors.lightBlue,
    height: 40,
    width: '50%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  attachmentDiv: {
    flexDirection: 'row',
  },
  textChange: {
    fontSize: 17,
    color: colors.lightBlue
  },
  displayDoc: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 150,
    width: 150
  },
  pdf: {
    flex: 1,
    width: 200,
    height: 200
  },

  mainContainer:{
   flexDirection:'row',
  
  },
  side:{
    
   flexDirection:'column',
    height:'100%',
    width:'25%',
    backgroundColor:colors.lightGrey
  },
  sub:{
    flex:1,
    flexDirection:'column',
    paddingHorizontal:5
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    padding: 10,
    borderRadius: 5,
  },
  floatingBtnText: {
    color: colors.white,
    fontSize: 16,
  },
  circle:{
    width:100,
    height:100,
    borderRadius:100,
    backgroundColor:'#F7F6FF',
    alignSelf:'center'
   },
   chooseServiceBtn:{
    marginVertical:5,
    flexDirection:'row',
    justifyContent:'flex-end'
   },
   chooseBtn:{
   marginHorizontal:3,
   backgroundColor:colors.secondary,
   padding:5,
   borderRadius:5
   },
   otherBtn:{
    marginHorizontal:3,
   backgroundColor:colors.warningYellow,
   padding:5,
   borderRadius:5
   }
});
