import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Right, Icon} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {GiftedChat} from 'react-native-gifted-chat';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';

export default class Chat extends React.Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hai Sayang',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    });
  }

  back() {
    this.props.navigation.navigate('homeStack');
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
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
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
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
