import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {Right, Icon} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {GiftedChat, Send, Bubble} from 'react-native-gifted-chat';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

export default class Chat extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('item').name,
      headerStyle: {
        backgroundColor: '#f48023',
        height: 100,
      },
      headerTitleStyle: {
        color: 'white',
      },
    };
  };
  state = {
    message: '',
    messageList: [],
    person: this.props.navigation.getParam('item'),
    userId: AsyncStorage.getItem('userid'),
    userName: AsyncStorage.getItem('user.name'),
    userAvatar: AsyncStorage.getItem('user.photo'),
  };

  onSend = async () => {
    if (this.state.message.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(this.state.userId)
        .child(this.state.person.id)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.message,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.userId,
          name: this.state.userName,
          avatar: this.state.userAvatar,
        },
      };
      updates[
        'messages/' +
          this.state.userId +
          '/' +
          this.state.person.id +
          '/' +
          msgId
      ] = message;
      updates[
        'messages/' +
          this.state.person.id +
          '/' +
          this.state.userId +
          '/' +
          msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({message: ''});
    }
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    this.setState({userId, userName, userAvatar});
    firebase
      .database()
      .ref('messages')
      .child(this.state.userId)
      .child(this.state.person.id)
      .on('child_added', val => {
        this.setState(previousState => ({
          messageList: GiftedChat.append(previousState.messageList, val.val()),
        }));
      });
  };

  back() {
    this.props.navigation.navigate('homeStack');
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#F3AC14',
          },
        }}
      />
    );
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View>
          <Image
            source={require('../../assets/icons/send.png')}
            style={{margin: 1}}
          />
        </View>
      </Send>
    );
  }

  render() {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => this.back()}>
              <Icon1 name="arrow-left" style={styles.icon} />
            </TouchableOpacity>
            <View style={styles.profilePic}>
              <Text>asd</Text>
            </View>
            <View>
              <Text style={styles.personName}>SkyNeko</Text>
              <Text style={styles.status}>Online</Text>
            </View>
            <Right>
              <Icon name="more" style={styles.setting} />
            </Right>
          </View>
        </View>
        <GiftedChat
          renderSend={this.renderSend}
          renderBubble={this.renderBubble}
          text={this.state.message}
          onInputTextChanged={val => {
            this.setState({message: val});
          }}
          messages={this.state.messageList}
          onSend={() => this.onSend()}
          user={{
            _id: this.state.userId,
          }}
        />
      </View>
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
    backgroundColor: '#30BCC9',
    elevation: 10,
    padding: 10,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  setting: {
    fontSize: 30,
    color: '#000',
    marginRight: 10,
  },
  personName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  icon: {
    color: 'white',
    fontSize: 25,
    marginRight: 5,
  },
  status: {
    color: '#76d636',
  },
});
