// Main.js
import React, {Fragment} from 'react'
import {   SafeAreaView,
  StyleSheet, Platform,   StatusBar,
  Switch, Text, View , Button, Linking} from 'react-native'

export default class groups extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View>
            <Text>DID THIS WORK</Text>
          </View>
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
