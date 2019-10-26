import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createSwitchNavigator } from 'react-navigation'
// import the different screens
import login from './screens/login'

import groups from './screens/groups'

// create our app's navigation stack
const AuthStack = createSwitchNavigator( {
  Login: {
    screen: login
  },
});

const MainStack = createStackNavigator( {
    Main: {
      screen: groups,
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        height: 60,
      },
      headerTitleStyle: {
        fontWeight: 'normal',
        fontSize: 25,
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
