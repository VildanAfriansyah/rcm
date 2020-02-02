import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

import splash from './src/screen/Splash';
import Home from './src/screen/Home';
import Map from './src/screen/Map';
import Profile from './src/screen/Profile';
import Login from './src/screen/Login';
import Register from './src/screen/Register';
import Chat from './src/screen/Chat';
import Contact from './src/screen/contact';
import Add from './src/screen/Add';

const loginStack = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      headerShown: false,
    },
  },
  Register: {
    screen: Register,
    navigationOptions: {
      headerShown: false,
    },
  },
});

// const homeStack = createStackNavigator({
//   Home: {
//     screen: Home,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
//   Chat: {
//     screen: Chat,
//     navigationOptions: {
//       headerShown: false,
//     },
//   },
// },{ initialRouteName: 'Home' });

const mapStack = createStackNavigator({
  Map: {
    screen: Map,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const profileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: {
      headerShown: false,
    },
  },
});

const bottomTab = createBottomTabNavigator({
  homeStack: {
    screen: Home,
    navigationOptions: {
      title: 'Chat',
      tabBarIcon: ({focused, horizontal, tintColor}) => (
        <Icon name="comments" color={tintColor} size={28} />
      ),
      tabBarOptions: {
        activeTintColor: '#FADA80',
        activeBackgroundColor: '#30BCC9',
        inactiveTintColor: '#30BCC9',
        style: {
          backgroundColor: 'white',
          borderTopColor: 'transparent',
        },
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
        activeTintColor: '#FADA80',
        activeBackgroundColor: '#30BCC9',
        inactiveTintColor: '#30BCC9',
        style: {
          backgroundColor: 'white',
          borderTopColor: 'transparent',
        },
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
        activeTintColor: '#FADA80',
        activeBackgroundColor: '#30BCC9',
        inactiveTintColor: '#30BCC9',
        style: {
          backgroundColor: 'white',
          borderTopColor: 'transparent',
        },
        labelStyle: {
          fontWeight: 'bold',
        },
      },
    },
  },
});

const AppNavigationStack = createStackNavigator(
  {
    bottomTab,
    Chat,
    Contact,
    Add,
    loginStack,
  },
  {
    initialRouteName: 'bottomTab',
    headerMode: 'none',
  },
);

const SwitchContainer = createSwitchNavigator({
  splash,
  AppNavigationStack,
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
