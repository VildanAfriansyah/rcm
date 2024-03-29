import React, {Component} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {Input, Button, Form, Item, Icon} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import firebase from 'react-native-firebase';
import AsyncStorage from '@react-native-community/async-storage';

class Contact extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuth: null,
      id: null,
      email: null,
      name: null,
      latitude: null,
      longitude: null,
      image: null,
      friendList: [],
      modalVisible: false,
      modalRefresh: false,
      emailAddFriend: null,
    };
  }

  async componentDidMount() {
    // await firebase.auth().onAuthStateChanged(async user => {
    //   if (user) {
    //     await this.setState({
    //       isAuth: true,
    //       id: user.uid,
    //       email: user.email,
    //     });
    //   } else {
    //     await this.props.navigation.replace('loginStack');
    //   }
    // });
    const {currentUser} = firebase.auth();
    const id = await AsyncStorage.getItem('userid');
    const name = await AsyncStorage.getItem('user.name');
    const image = await AsyncStorage.getItem('user.image');
    const email = await AsyncStorage.getItem('user.email');
    this.setState({currentUser, id, name, image, email});
  }

  onSubmitAddFriend = event => {
    firebase
      .database()
      .ref('user')
      .once('value')
      .then(async snapshot => {
        const db_users = await Object.values(snapshot.val());
        const friend = await db_users.find(
          item => item.email === this.state.emailAddFriend,
        );
        if (friend.id !== undefined) {
          firebase
            .database()
            .ref('mess/')
            .child(this.state.id)
            .once('value', async snapshot => {
              if ('friendList' in db_users) {
                const friendList = await Object.keys(snapshot.val().friendList);
                const cekFriendList = friendList.find(
                  item => item === friend.id_users,
                );
                if (cekFriendList !== undefined) {
                  Alert.alert(
                    'Oops..',
                    'Ternyata anda sudah berteman.',
                    [
                      {
                        text: 'Ok',
                        style: 'cancel',
                      },
                    ],
                    {cancelable: false},
                  );
                }
              } else {
                await firebase
                  .database()
                  .ref('mess/')
                  .child(this.state.id)
                  .child('/friendList/')
                  .child(friend.id)
                  .set({data: true});

                await firebase
                  .database()
                  .ref('mess/')
                  .child(this.state.id)
                  .child('/friendList/')
                  .child(friend.id)
                  .child('/data')
                  .push({
                    email: friend.email,
                    id: friend.id,
                    name: friend.name,
                    image: friend.image,
                  });

                await firebase
                  .database()
                  .ref('mess/')
                  .child(friend.id)
                  .child('/friendList/')
                  .child(this.state.id)
                  .set({data: true});

                await firebase
                  .database()
                  .ref('mess/')
                  .child(friend.id)
                  .child('/friendList/')
                  .child(this.state.id)
                  .child('/data')
                  .push({
                    id: this.state.id,
                    email: this.state.email,
                    name: this.state.name,
                    image: this.state.image,
                  });

                Alert.alert(
                  'Success',
                  'Selamat anda sudah bisa mengobrol dengan teman yang anda tambahkan.',
                  [
                    {
                      text: 'Kembali Ke Contact',
                      onPress: () => this.props.navigation.navigate('Contact'),
                    },
                    {
                      text: 'Tambah Lagi',
                      style: 'cancel',
                    },
                  ],
                  {cancelable: false},
                );
              }
            });
        } else {
          Alert.alert(
            'Error',
            'Oops... sesuatu terjadi dan saya tidak mengerti...',
            [
              {
                text: 'Ok',
                style: 'cancel',
              },
            ],
            {cancelable: false},
          );
        }
      })
      .catch(message => {
        Alert.alert(
          'Tidak Ditemukan',
          'Pengguna dengan email tersebut tidak terdaftar, Silahkan coba lagi.',
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      });
  };

  render(props) {
    return (
      <>
        <View style={styles.root}>
          <View style={styles.header}>
            <View style={styles.row}>
              <Text style={styles.title}>Add Contact</Text>
            </View>
          </View>
          <View style={styles.add}>
            <Form>
              <Item rounded>
                <Icon
                  type="MaterialCommunityIcons"
                  name="email"
                  style={{
                    paddingRight: 10,
                  }}
                />
                <Input
                  placeholder="Email"
                  keyboardType="email-address"
                  value={this.state.emailAddFriend}
                  onChangeText={value =>
                    this.setState({
                      emailAddFriend: value,
                    })
                  }
                />
              </Item>
              <Button
                block
                rounded
                style={{
                  marginTop: 40,
                  backgroundColor: '#f0c95d',
                }}
                onPress={event => this.onSubmitAddFriend(event)}>
                <Text>Add</Text>
              </Button>
            </Form>
          </View>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  profilePic: {
    height: hp('8%'),
    width: wp('16%'),
    borderRadius: wp('50%'),
    backgroundColor: '#eddbb9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  header: {
    height: hp('10%'),
    backgroundColor: '#FFF',
    elevation: 10,
    padding: 20,
  },
  add: {
    margin: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
});

export default Contact;
