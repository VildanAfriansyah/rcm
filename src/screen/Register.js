import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Card} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';

export default class Register extends Component {
  state = {email: '', password: '', errorMessage: null};

  register = () => {
    const {email, password} = this.state;
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => this.props.navigation.navigate('Login'))
      .catch(error => this.setState({errorMessage: error.message}));
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
            {this.state.errorMessage && (
              <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
            )}
          </View>
          <Card style={styles.card} transparent>
            <View style={styles.formItem}>
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor="#7e8a8c"
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

            <View style={styles.alert}>
              {/* {msg && <Text style = { styles.alert }>{this.props.login.data.msg}</Text>} */}
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
