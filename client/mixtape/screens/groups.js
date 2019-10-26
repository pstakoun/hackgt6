// Main.js
import React, {Fragment} from 'react'
import {   SafeAreaView,
  StyleSheet, Platform,   StatusBar,
  Switch, Text, View , Button, Linking} from 'react-native'
//import GropuItem from '../components/groupItem'

export default class groups extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>

        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#FFFFFF',
  },
});
