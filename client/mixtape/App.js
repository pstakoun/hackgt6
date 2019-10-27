import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createSwitchNavigator } from 'react-navigation'
// import the different screens
import login from './screens/login'

import groups from './screens/groups'
import curGroup from './screens/curGroup'
import newGroup from './screens/newGroup'
import addMembers from './screens/addMembers'

import global from './style/global'

// create our app's navigation stack
const AuthStack = createSwitchNavigator( {
    Login: {
      screen: login
    },
});

const MainStack = createStackNavigator( {
    Groups: {
      screen: groups,
    },
    CurGroup: {
      screen: curGroup,
    },
    AddMembers: {
      screen: addMembers,
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        height: 60,
        backgroundColor: '#242424',
      },
      headerTitleStyle: {
        fontWeight: 'bold',
        fontSize: 30,
        color: 'white',
      },
    }
  });

const RootStack = createSwitchNavigator(  {
    Loading: {
      screen: AuthStack,
    },
    Main: {
      screen: MainStack,
    },
  },
  {
    initialRouteName: 'Loading'
  });

const AppContainer = createAppContainer(RootStack);
export default AppContainer;
