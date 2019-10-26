// Main.js
import React, {Fragment} from 'react'
import {   SafeAreaView,
           StyleSheet, } from 'react-native'
import {WebView} from 'react-native-webview'

export default class webauth extends React.Component {
  render() {
    return (
      <WebView
        originWhitelist={['*']}
        source={'localhost:3000/users/auth/spotify'}
      />
    );
  }
}


const styles = StyleSheet.create({
  body: {
    backgroundColor: '#FFFFFF',
  },
});
