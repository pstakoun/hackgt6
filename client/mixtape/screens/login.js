// Main.js
import React, {Fragment} from 'react'
import {    SafeAreaView,
            StyleSheet,
            StatusBar,
            Text,
            View ,
            Button,
            Linking,} from 'react-native'

export default class login extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
    this.spotifyAuth = this.spotifyAuth.bind(this);

    this.state = {
      CLIENT_ID: '1eaa04d6551348fa84e7966990e45aeb',
      redirectUrl: 'mixtape://',
      authcode: null
    }
  }

  handleLogin() {
    this.props.navigation.navigate('Main')
  }

  spotifyAuth() {
    Linking.openURL(
      `https://accounts.spotify.com/authorize?client_id=${this.state.CLIENT_ID}&redirect_uri=${encodeURIComponent(this.state.redirectUrl)}&scope=user-read-email&response_type=code`)
      .catch((err) => console.error('An error occurred', err));
  }

  componentDidMount() {
    Linking.addEventListener('url', this._handleOpenURL.bind(this));
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL.bind(this));
  }
  _handleOpenURL(event) {
    var code = event.url.split("code=")[1];
    fetch('http://localhost:3000/users/auth/spotify/authorize?code=' + code)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => console.log(error.message));
  }

  render() {
    return (
      <SafeAreaView>
        <View>
          <Button title="login" onPress={this.spotifyAuth.bind(this)}>
            <Text>Click Me</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }
}



const styles = StyleSheet.create({
  body: {
    backgroundColor: '#FFFFFF',
  },
  loginButton: {

  },
  loginText: {

  }
});
