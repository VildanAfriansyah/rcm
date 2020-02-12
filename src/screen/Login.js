import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  PermissionsAndroid,
  ToastAndroid,
  Platform,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {Card} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import firebase from 'react-native-firebase';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      email: '',
      password: '',
      errorMesasge: null,
      loading: false,
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await this.getLocation();
  };

  componentWillUnmount() {
    this._isMounted = false;
    Geolocation.clearWatch();
    Geolocation.stopObserving();
  }

  exit = () => {
    BackHandler.exitApp();
  };

  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));
  };

  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location Permission Denied By User.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permission Revoked By User.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      this.exit();
    }
    Geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
        });
      },
      error => {
        this.setState({errorMessage: error});
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 2000,
        distanceFilter: 50,
        forceRequestLocation: true,
      },
    );
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  login = async () => {
    const {email, password} = this.state;
    if (email.length < 6) {
      ToastAndroid.show(
        'Please input a valid email address',
        ToastAndroid.LONG,
      );
    } else if (password.length < 6) {
      ToastAndroid.show(
        'Password must be at least 6 characters',
        ToastAndroid.LONG,
      );
    } else {
      firebase
        .database()
        .ref('user/')
        .orderByChild('/email')
        .equalTo(email)
        .once('value', result => {
          let data = result.val();
          if (data !== null) {
            let user = Object.values(data);
            AsyncStorage.setItem('user.email', user[0].email);
            AsyncStorage.setItem('user.name', user[0].name);
            AsyncStorage.setItem('user.image', user[0].image);
          }
        });

      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(async response => {
          firebase
            .database()
            .ref('/user/' + response.user.uid)
            .update({
              status: 'Online',
              latitude: this.state.latitude || null,
              longitude: this.state.longitude || null,
            });
          await AsyncStorage.setItem('userid', response.user.uid);
          ToastAndroid.show('Login success', ToastAndroid.LONG);
          await this.props.navigation.navigate('homeStack');
        })
        .catch(error => {
          this.setState({
            errorMessage: error.message,
            email: '',
            password: '',
          });
          ToastAndroid.show(this.state.errorMessage, ToastAndroid.LONG);
        });
    }
  };

  register() {
    this.props.navigation.navigate('Register');
  }

  render() {
    const {loading} = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.box}>
          <View style={styles.image}>
            <Image
              source={require('../assets/login.jpg')}
              style={styles.image}
            />
          </View>
          <Card style={styles.card} transparent>
            <View style={styles.formItem}>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                placeholder="Email"
                placeholderTextColor="#7e8a8c"
                onChangeText={email => this.setState({email})}
                value={this.state.email}
              />
            </View>
            <View style={styles.formItem}>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor="#7e8a8c"
                onChangeText={password => this.setState({password})}
                value={this.state.password}
              />
            </View>

            <View style={styles.alert}>
              {/* {msg && <Text style = { styles.alert }>{this.props.login.data.msg}</Text>} */}
            </View>
            <View style={styles.row}>
              <View style={styles.row}>
                {loading === false ? (
                  <LinearGradient
                    style={styles.buttonLogin}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#FADA80', '#f0c95d']}>
                    <TouchableOpacity
                      style={styles.buttonLogin}
                      onPress={this.login}>
                      <Text style={styles.buttonTextLogin}>Login</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    style={styles.buttonLogin}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#f0d797', '#f0d797']}>
                    <TouchableOpacity
                      style={styles.buttonLogin}
                      onPress={this.login}>
                      <ActivityIndicator />
                    </TouchableOpacity>
                  </LinearGradient>
                )}
              </View>
              <View style={styles.row}>
                {loading === false ? (
                  <LinearGradient
                    style={styles.buttonLogin}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#FADA80', '#f0c95d']}>
                    <TouchableOpacity
                      style={styles.buttonLogin}
                      onPress={() => this.register()}>
                      <Text style={styles.buttonTextRegister}>REGISTER</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    style={styles.buttonLogin}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#FADA80', '#f0c95d']}>
                    <TouchableOpacity
                      style={styles.buttonLogin}
                      onPress={this.login}>
                      <ActivityIndicator />
                    </TouchableOpacity>
                  </LinearGradient>
                )}
              </View>
            </View>
          </Card>
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
    width: wp('80%'),
    height: hp('40%'),
    justifyContent: 'center',
    alignSelf: 'center',
    resizeMode: 'contain',
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
    marginBottom: 5,
  },
  buttonLogin: {
    borderRadius: 8,
    height: hp('6%'),
    width: wp('30%'),
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  buttonTextLogin: {
    fontWeight: 'bold',
    color: '#FAF3E3',
    fontSize: 15,
  },
  buttonRegister: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    height: hp('6%'),
    width: wp('30%'),
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  buttonTextRegister: {
    fontWeight: 'bold',
    color: '#FAF3E3',
    fontSize: 15,
  },
});
