import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ToastAndroid,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import { useForm, Controller } from 'react-hook-form';
import { RootStateOrAny, useSelector } from 'react-redux';
import { userRegiter } from './userSlice';
import { globalStyles } from '../../style/global';
import { useTogglePasswordVisibility } from '../../hooks/useTogglePasswordVisibility';
import PhoneInput from 'react-native-phone-number-input';
import { colors } from '../../utils/colors';
import { Container } from '../../components/Container';
import { BasicView } from '../../components/BasicView';
import { TextInputField } from '../../components/TextInputField';
import { useAppDispatch } from '../../app/store';
import Button from '../../components/Button';
import { ButtonText } from '../../components/ButtonText';
import DropDownPicker from 'react-native-dropdown-picker';
import Pdf from 'react-native-pdf';
import DocumentPicker, { types } from 'react-native-document-picker';
// import 'react-native-get-random-values';
import { firebase } from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
import { PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';

const RegisterScreen = ({ route, navigation }: any) => {

  const dispatch = useAppDispatch();
  const { user, loading, status } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const { passwordVisibility, rightIcon, handlePasswordVisibility } =
    useTogglePasswordVisibility();

  const phoneInput = useRef<PhoneInput>(null);

  const [message, setMessage] = useState('');

  DropDownPicker.setListMode("SCROLLVIEW")

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [fileDoc, setFileDoc] = useState<string | null>(null);
  const [showUploadView, setShowUploadView] = useState(false);
  const [accountType, setAccountType] = useState<string | ''>('');
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

  const [items, setItems] = useState([
    { label: 'Patient/User', value: 'patient' },
    { label: 'Wholesaler', value: 'wholesaler' },
    { label: 'Retailer', value: 'retailer' },
    { label: 'Dialysis', value: 'dialysis' },
    { label: 'Insurance agency', value: 'insuarance' },
  ]);

  const removeAttachment = () => {
    setFileDoc(null)
  }

  const selectFileDoc = async () => {

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      })
      setFileDoc(res);
    } catch (error) {

      if (DocumentPicker.isCancel(error)) {
        setFileDoc(null)
      } else {
        alert('Unknown Error: ' + JSON.stringify(error));
        throw error
      }
    }
  }

  const onAccountChange = (account: any) => {

    if (account !== 'patient') {
      setAccountType(account)
      setShowUploadView(true)
      setFileDoc(null)
    } else {
      setAccountType(account)
      setShowUploadView(false)
    }
  }

  const makeid = (length: any) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }


  const getPathForFirebaseStorage = async (uri: any) => {

    // if (Platform.OS === "ios") return uri;
    // const stat = await RNFetchBlob.fs.stat(uri);
    // return stat.path;
    const destPath = `${RNFS.TemporaryDirectoryPath}/text`;
    await RNFS.copyFile(uri, destPath);

    return (await RNFS.stat(destPath)).path;
  };

  useEffect(() => {
    if (status !== '') {
      setMessage(status);
    }
  }, [status]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      phone: '',
      password: '',
      first_name: '',
      last_name: '',
      business_name: ''
    },
  });


  const setDisappearMessage = (message: any) => {
    setMessage(message);

    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  const onSubmit = async (data: any) => {
    // console.log('business_name', data.business_name)
    data.account = accountType;


    if (fileDoc !== null) {
      data.doc_type = fileDoc[0].type;
      console.log('file document', fileDoc);
      const fileExtension = fileDoc[0].type.split("/").pop();
      var uuid = makeid(10)
      const fileName = `${uuid}.${fileExtension}`;
      var storageRef = firebase.storage().ref(`businesses/docs/${fileName}`);

      console.log('file docs', fileDoc[0].uri);
      const fileUri = await getPathForFirebaseStorage(fileDoc[0].uri);
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: "Read Permission",
            message: "Your app needs permission.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setUploadingDoc(true);
          storageRef.putFile(fileUri).on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot: any) => {
              console.log("snapshost: " + snapshot.state);
              if (snapshot.state === firebase.storage.TaskState.SUCCESS) {
              }
            },
            (error) => {
              unsubscribe();
            },
            () => {
              storageRef.getDownloadURL().then((downloadUrl: any) => {
                data.doc_url = downloadUrl;
                setUploadingDoc(false);
                //    console.log('on submit data', data);
                dispatch(userRegiter(data))
                  .unwrap()
                  .then(result => {
                    console.log('resultsss', result);
                    if (result.status) {
                      console.log('excuted this true block')
                      ToastAndroid.show("User created successfuly!", ToastAndroid.SHORT);

                      navigation.navigate('Login', {
                        screen: 'Login',
                        message: message
                      });
                    } else {
                      setDisappearMessage(
                        'Unable to process request. Please try again later.',
                      );
                      console.log('dont navigate');
                    }

                    console.log('result');
                    console.log(result);
                  })
                  .catch(rejectedValueOrSerializedError => {
                    // handle error here
                    console.log('error');
                    console.log(rejectedValueOrSerializedError);
                  });
              });
            }
          );
        } else {
          return false;
        }
      } catch (error) {
        console.warn(error);
        return false;
      }
    } else {
      dispatch(userRegiter(data))
        .unwrap()
        .then(result => {
          console.log(result);

          // if (result.status) {
          //   console.log('Navigate to verify');
          //   navigation.navigate('Verify');
          // } else {
          //   console.log('dont navigate');
          // }
        })
        .catch(rejectedValueOrSerializedError => {
          // handle error here
          console.log('error');
          console.log(rejectedValueOrSerializedError);
        });

    }
  };

  return (

    <SafeAreaView>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Container>
          <View style={globalStyles.centerView}>
            <Image
              source={require('./../../../assets/images/logo.png')}
              style={globalStyles.verticalLogo}
            />
          </View>
          <View>
            <Text style={globalStyles.largeHeading}>Register</Text>
          </View>
          <View>
            <BasicView style={globalStyles.centerView}>
              <Text style={globalStyles.errorMessage}>{message}</Text>
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop10,
                ]}>
                Phone
              </Text>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <PhoneInput
                    ref={phoneInput}
                    placeholder="700 111 222"
                    defaultValue={value}
                    defaultCode="TZ"
                    countryPickerProps={{
                      countryCodes: ['TZ', 'KE', 'UG', 'RW', 'BI'],
                    }}
                    layout="first"
                    // onChangeText={}
                    onChangeFormattedText={text => {
                      onChange(text);
                    }}
                    withDarkTheme
                    withShadow
                    autoFocus
                    containerStyle={globalStyles.phoneInputContainer}
                    textContainerStyle={globalStyles.phoneInputTextContainer}
                    textInputStyle={globalStyles.phoneInputField}
                    textInputProps={{
                      maxLength: 9,
                    }}
                  />
                )}
                name="phone"
              />
              {errors.phone && (
                <Text style={globalStyles.errorMessage}>
                  Phone number is required.
                </Text>
              )}
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                First Name
              </Text>

              <Controller
                control={control}
                rules={{
                  maxLength: 12,
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder="Enter First Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="first_name"
              />

              {errors.first_name && (
                <Text style={globalStyles.errorMessage}>
                  First name is required
                </Text>
              )}
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                Last Name
              </Text>

              <Controller
                control={control}
                rules={{
                  maxLength: 12,
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputField
                    placeholder="Enter Last Name"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name="last_name"
              />

              {errors.last_name && (
                <Text style={globalStyles.errorMessage}>
                  Last name is required
                </Text>
              )}
            </BasicView>

            <BasicView>
              <Text
                style={[
                  globalStyles.inputFieldTitle,
                  globalStyles.marginTop20,
                ]}>
                Password
              </Text>

              <View style={globalStyles.passwordInputContainer}>
                <Controller
                  control={control}
                  rules={{
                    maxLength: 12,
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={globalStyles.passwordInputField}
                      secureTextEntry={passwordVisibility}
                      placeholder="Enter Password"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="password"
                />

                <TouchableOpacity onPress={handlePasswordVisibility}>
                  <Icon name={rightIcon} size={20} color={colors.grey} />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={globalStyles.errorMessage}>
                  Password is required.
                </Text>
              )}
            </BasicView>

            <BasicView>
              <View style={{
                marginVertical: 20
              }}>
                <DropDownPicker
                  open={open}
                  placeholder='Select Account'
                  listMode='SCROLLVIEW'
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  onChangeValue={onAccountChange}
                  setItems={setItems}
                />

              </View>


            </BasicView>

            {showUploadView ? (<>

              <BasicView>
                <Text
                  style={[
                    globalStyles.inputFieldTitle,
                    globalStyles.marginTop20,
                  ]}>
                  Business Name
                </Text>

                <Controller
                  control={control}
                  rules={{
                    maxLength: 100,
                    required: true,
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInputField
                      placeholder="Enter Business name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="business_name"
                />

                {errors.business_name && (
                  <Text style={globalStyles.errorMessage}>
                    Business name is required
                  </Text>
                )}
              </BasicView>

              <BasicView>
                <View style={globalStyles.uploadView} >
                  <Text style={{ fontSize: 12 }}>
                    {fileDoc == null ? 'Attach Authorization permit' : 'File Attach'}
                  </Text>
                  <View style={globalStyles.attachmentDiv}>
                    <TouchableOpacity
                      style={globalStyles.uploadBtn}
                      onPress={selectFileDoc}
                      disabled={fileDoc == null ? false : true}
                    >
                      {
                        fileDoc == null ? (<View />) : (
                          <Icon name={rightIcon} size={20} color={colors.successGreen} />
                        )
                      }

                      <Text style={{
                        color: colors.white,
                        fontSize: 12
                      }}>
                        {fileDoc == null ? 'Attach' : 'Attached'}
                      </Text>
                    </TouchableOpacity>
                    {fileDoc == null ? (<View />) : (
                      <TouchableOpacity style={{
                        alignSelf: 'center',
                        marginLeft: 30
                      }}
                        onPress={() => removeAttachment()}
                      >
                        <Text style={globalStyles.textChange}>Change</Text>
                      </TouchableOpacity>)}
                  </View>
                  {fileDoc == null ? (<View>
                    <Text style={{ color: '#f25d52' }}>

                    </Text>
                  </View>) : (<View />)}
                </View>
                {fileDoc == null ? (<View />) : (
                  <View style={globalStyles.displayDoc}>
                    {
                      fileDoc[0].type == 'application/pdf' ? (
                        <Pdf source={{ uri: fileDoc[0].uri }} style={globalStyles.pdf}
                          maxScale={3}
                        />
                      ) : (
                        <Image source={{ uri: fileDoc[0].uri }}
                          style={globalStyles.pdf}
                        />
                      )
                    }
                  </View>)}
              </BasicView>


            </>
            ) : (<View />)
            }

            <BasicView>
              <Button loading={uploadingDoc || loading} onPress={handleSubmit(onSubmit)}>
                <ButtonText>Register</ButtonText>
              </Button>
            </BasicView>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Login');
              }}
              style={[globalStyles.marginTop20, globalStyles.centerView]}>
              <Text style={globalStyles.touchablePlainTextSecondary}>
                Already have an account? Login
              </Text>
            </TouchableOpacity>
          </View>
        </Container>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RegisterScreen;
