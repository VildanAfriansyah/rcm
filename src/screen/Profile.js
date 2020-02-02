import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  PermissionsAndroid,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {Card} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

export default class Profile extends Component {
  state = {
    currentUser: null,
    userId: null,
    permissionsGranted: null,
    errorMessage: null,
    loading: false,
    updatesEnabled: false,
    location: {},
    photo: null,
    imageUri: null,
    imgSource: '',
    uploading: false,
    refreshing: false,
  };

  componentDidMount = async () => {
    const {currentUser} = firebase.auth();
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.image');
    const userEmail = await AsyncStorage.getItem('user.email');
    this.setState({currentUser, userId, userName, userAvatar, userEmail});
    console.log(this.state.userAvatar);
  };

  Logout = async () => {
    await AsyncStorage.getItem('userid').then(async userid => {
      firebase
        .database()
        .ref('user/' + userid)
        .update({status: 'Offline'});
      await AsyncStorage.clear();
      firebase
        .auth()
        .signOut()
        .then(() => this.props.navigation.navigate('Login'));
      Alert.alert('See you next time');
    });
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  changeImage = async type => {
    const Blob = RNFetchBlob.polyfill.Blob;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
    };

    let cameraPermission =
      (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    if (!cameraPermission) {
      cameraPermission = await this.requestCameraPermission();
    } else {
      ImagePicker.showImagePicker(options, response => {
        if (response.didCancel) {
          ToastAndroid.show('You cancelled image picker', ToastAndroid.LONG);
        } else if (response.error) {
          ToastAndroid.show(response.error, ToastAndroid.LONG);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          ToastAndroid.show('loading...', ToastAndroid.LONG);
          const imageRef = firebase
            .storage()
            .ref('image/' + this.state.userId)
            .child('photo');
          imageRef
            .putFile(response.path)
            .then(data => {
              ToastAndroid.show('Upload success', ToastAndroid.LONG);
              firebase
                .database()
                .ref('user/' + this.state.userId)
                .update({image: data.downloadURL});
              this.setState({userAvatar: data.downloadURL});
              AsyncStorage.setItem('user.image', this.state.userAvatar);
            })

            .catch(err => console.log(err));
        }
      });
    }
  };

  render() {
    // const {currentUser, userAvatar, userName, userEmail} = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.box}>
          <TouchableOpacity onPress={this.changeImage}>
            <View style={styles.image}>
              <Image
                source={{uri: this.state.userAvatar}}
                style={styles.image}
              />
            </View>
          </TouchableOpacity>
          <Card style={styles.card} transparent>
            <View style={styles.formItem}>
              <TextInput
                style={styles.input}
                placeholderTextColor="#7e8a8c"
                // onChangeText={email => this.setState({name})}
                value={this.state.userName}
              />
            </View>
            <View style={styles.formItem}>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#7e8a8c"
                // onChangeText={password => this.setState({email})}
                value={this.state.userEmail}
              />
            </View>

            <View style={styles.row}>
              <View style={styles.row}>
                <LinearGradient
                  style={styles.buttonLogout}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#FADA80', '#f0c95d']}>
                  <TouchableOpacity
                    style={styles.buttonLogout}
                    onPress={this.Logout}>
                    <Text style={styles.buttonTextLogout}>LOGOUT</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </Card>

          <View style={{alignSelf: 'center'}}>
            {this.state.errorMessage && (
              <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  image: {
    height: hp('30%'),
    width: wp('60%'),
    borderRadius: hp('50%'),
    alignSelf: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  box: {
    flex: 1,
    // justifyContent: 'center',
  },
  card: {
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgb(157, 228, 245)',
    borderRadius: 20,
    width: wp('80%'),
  },
  formItem: {
    marginTop: 5,
    marginBottom: 5,
  },
  input: {
    borderWidth: 0.3,
    borderRadius: 8,
    margin: 10,
    fontSize: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginBottom: 5,
  },
  buttonLogout: {
    borderRadius: 8,
    height: hp('6%'),
    width: wp('70%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextLogout: {
    fontWeight: 'bold',
    color: '#FAF3E3',
    fontSize: 15,
  },
});
