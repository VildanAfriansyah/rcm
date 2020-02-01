import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  PermissionsAndroid,
  ToastAndroid,
} from 'react-native';
import {Card} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';
import Geolocation from 'react-native-geolocation-service';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      name: '',
      email: '',
      password: '',
      latitude: null,
      longitude: null,
      errorMessage: null,
      loading: false,
      updatesEnabled: false,
    };
  }

  componentDidMount = async () => {
    await this.getLocation();
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
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
          });
          console.warn(position);
        },
        error => {
          this.setState({errorMessage: error, loading: false});
          console.warn(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 2000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
  };

  register = () => {
    const {name, email, password} = this.state;
    if (name.length < 1) {
      ToastAndroid.show('Please input your fullname', ToastAndroid.LONG);
    } else if (email.length < 6) {
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
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          console.warn(response);
          firebase
            .database()
            .ref('/user/' + response.user.uid)
            .set({
              name: this.state.name,
              status: 'Offline',
              email: this.state.email,
              photo: 'https://i.imgur.com/1KoMPoK.png',
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              id: response.user.uid,
            })
            .catch(error => {
              ToastAndroid.show(error.message, ToastAndroid.LONG);
              this.setState({
                name: '',
                email: '',
                password: '',
              });
            });
          ToastAndroid.show(
            'Your account is successfully registered!',
            ToastAndroid.LONG,
          );

          this.props.navigation.navigate('Login');
        })
        .catch(error => {
          this.setState({
            errorMessage: error.message,
            name: '',
            email: '',
            password: '',
          });
          ToastAndroid.show(this.state.errorMessage.message, ToastAndroid.LONG);
        });
    }
  };

  render() {
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
                placeholder="Username"
                placeholderTextColor="#7e8a8c"
                onChangeText={name => this.setState({name})}
                value={this.state.name}
              />
            </View>
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

            <View style={styles.row}>
              <View style={styles.row}>
                <LinearGradient
                  style={styles.buttonLogin}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#FADA80', '#f0c95d']}>
                  <TouchableOpacity
                    style={styles.buttonLogin}
                    onPress={() => this.login()}>
                    <Text style={styles.buttonTextLogin}>MASUK</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
              <View style={styles.row}>
                <LinearGradient
                  style={styles.buttonLogin}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  colors={['#FADA80', '#f0c95d']}>
                  <TouchableOpacity
                    style={styles.buttonLogin}
                    onPress={this.register}>
                    <Text style={styles.buttonTextRegister}>REGISTER</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </View>
          </Card>
          {/* <View style={{alignSelf: 'center'}}>
            {this.state.errorMessage && (
              <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
            )}
          </View> */}
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
