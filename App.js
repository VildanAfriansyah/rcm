import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import splash from './src/screen/Splash';
import Home from './src/screen/Home';
import Map from './src/screen/Map';
import Profile from './src/screen/Profile';

const homeStack = createStackNavigator({
  Home,
});

const mapStack = createStackNavigator({
  Map,
});

const profileStack = createStackNavigator({
  Profile,
});

const bottomTab = createBottomTabNavigator({
  homeStack: {
    screen: homeStack,
    navigationOptions: {
      title: 'Chat',
      tabBarIcon: ({focused, horizontal, tintcolor}) => (
        <Icon name="comments" color={tintcolor} size={28} />
      ),
      tabBarOptions: {
        activeTintColor: '#006b3a',
        labelStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
  LocationStack: {
    screen: mapStack,
    navigationOptions: {
      title: 'Locations',
      tabBarIcon: ({focused, horizontal, tintColor}) => (
        <Icon name="map-marker" color={tintColor} size={28} />
      ),
      tabBarOptions: {
        activeTintColor: '#006b3a',
        labelStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
  ProfileStack: {
    screen: profileStack,
    navigationOptions: {
      title: 'Profile',
      tabBarIcon: ({focused, horizontal, tintColor}) => (
        <Icon name="user" color={tintColor} size={28} />
      ),
      tabBarOptions: {
        activeTintColor: '#006b3a',
        labelStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

const SwitchContainer = createSwitchNavigator({
  splash,
  bottomTab,
});

const AppContainer = createAppContainer(SwitchContainer);

const App = () => {
  return (
    <>
      <AppContainer />
    </>
  );
};

export default App;
