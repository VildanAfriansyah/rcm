import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {Card} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import firebase from 'react-native-firebase';

export default class Profile extends Component {
  state = {currentUser: null};

  componentDidMount() {
    const {currentUser} = firebase.auth();
    this.setState({currentUser});
  }

  Logout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => this.props.navigation.navigate('Login'));
    Alert.alert('See you next time');
  };

  render() {
    const {currentUser} = this.state;
    return (
      <View style={styles.root}>
        <View style={styles.box}>
          <View style={styles.image}>
            <Image
              source={{uri: 'https://placeimg.com/140/140/any'}}
              style={styles.image}
            />
          </View>
          <Card style={styles.card} transparent>
            <View style={styles.formItem}>
              <TextInput
                style={styles.input}
                placeholderTextColor="#7e8a8c"
                onChangeText={email => this.setState({email})}
                value={currentUser && currentUser.email.split('@')[0]}
              />
            </View>
            <View style={styles.formItem}>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                placeholderTextColor="#7e8a8c"
                onChangeText={password => this.setState({password})}
                value={currentUser && currentUser.email}
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
