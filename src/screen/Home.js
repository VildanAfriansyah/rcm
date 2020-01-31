import React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import {Right, Icon, Input} from 'native-base';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const contact = [
  {
    id: 1,
    name: 'User 1',
    chat: 'Hello',
    date: '19/01/2020',
  },
  {
    id: 2,
    name: 'User 2',
    chat: 'Hi',
    date: '1/01/2020',
  },
  {
    id: 3,
    name: 'User 3',
    chat: 'Bonjour',
    date: '28/11/2019',
  },
  {
    id: 4,
    name: 'User 4',
    chat: 'Namaste',
    date: '10/01/2020',
  },
  {
    id: 5,
    name: 'User 5',
    chat: 'Ni Hao',
    date: '30/12/2019',
  },
  {
    id: 6,
    name: 'User 6',
    chat: 'Hallo',
    date: '1/01/2020',
  },
];

const Home = props => {
  return (
    <>
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.row}>
            <Text style={styles.title}>Chat</Text>
            <Right>
              <Icon name="more" style={styles.setting} />
            </Right>
          </View>
          <View style={{height: hp('8%')}}>
            <Input
              style={styles.search}
              placeholder="Search Message"
              placeholderTextColor="#D1DAE0"
            />
          </View>
        </View>
        <FlatList
          data={contact}
          renderItem={({item}) => (
            <View>
              <View style={styles.listChat}>
                <View style={styles.profilePic}>
                  <Text>{item.name}</Text>
                </View>
                <View>
                  <Text style={styles.personName}>{item.name}</Text>
                  <Text style={styles.personChat}>{item.chat}</Text>
                </View>
                <Right>
                  <Text>{item.date}</Text>
                </Right>
              </View>
              <View style={styles.lineStyle} />
            </View>
          )}
          keyExtractor={item => item.id}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  profilePic: {
    height: hp('8%'),
    width: wp('15%'),
    backgroundColor: '#eddbb9',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  header: {
    height: hp('15%'),
    backgroundColor: '#FFF',
    elevation: 10,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
  },
  setting: {
    fontSize: 30,
    color: '#000',
  },
  search: {
    flexDirection: 'row',
    marginTop: 10,
    alignSelf: 'center',
    width: wp('80%'),
    height: hp('10%'),
    backgroundColor: '#F0F3F4',
    borderRadius: 3,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 10,
  },
  listChat: {
    padding: 20,
    height: hp('12%'),
    flexDirection: 'row',
    alignItems: 'center',
  },
  personName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  personChat: {
    color: '#1f1f1f',
  },
  lineStyle: {
    borderWidth: 0.6,
    borderColor: '#cccccc',
    width: wp('85%'),
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default Home;
