// Main.js
import React, {Fragment} from 'react'
import {    SafeAreaView,
            StyleSheet,
            Image,
            Text,
            View ,
            TouchableOpacity,
            Linking,} from 'react-native'
import global from '../style/global'

export default class login extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
    this.spotifyAuth = this.spotifyAuth.bind(this);

    this.state = {
      CLIENT_ID: '1eaa04d6551348fa84e7966990e45aeb',
      redirectUrl: 'mixtape://',
      authcode: null,
    }
  }

  handleLogin() {
    this.props.navigation.navigate('Main')
  }

  spotifyAuth() {
    Linking.openURL(
      `https://accounts.spotify.com/authorize?client_id=${this.state.CLIENT_ID}&redirect_uri=${encodeURIComponent(this.state.redirectUrl)}&scope=user-read-email,user-read-private,user-read-currently-playing,user-read-playback-state,user-top-read,user-modify-playback-state,playlist-modify-private,playlist-modify-public,playlist-read-collaborative,playlist-read-private,user-library-modify&response_type=token`)
      .catch((err) => console.error('An error occurred', err));
  }

  componentDidMount() {
    Linking.addEventListener('url', this._handleOpenURL.bind(this));
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL.bind(this));
  }
  _handleOpenURL(event) {
    let token = event.url.split("access_token=")[1];
    fetch('http://localhost:3000/users/auth/spotify/authorize?token=' + token)
      .then((response) => response.json())
      .then((data) => console.log(data))
      .then(() => this.props.navigation.navigate('Main'))
      .catch(error => console.log(error.message));
  }

  render() {
    return (
      <View style={[global.container, styles.container]}>
        <SafeAreaView>
          <View style={[styles.container, {marginBottom: 150}]}>
            <Image style={{aspectRatio: 1.7, height: 100}} source={require('../logo.png')} />
            <Text style={styles.logo}>MIXTAPE</Text>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={this.spotifyAuth.bind(this)}>
            <Text style={styles.loginText}>LOGIN WITH SPOTIFY</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }
}



const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#1DB954',
    borderRadius: 100,
  },
  loginText: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 15,
    marginHorizontal: 40,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    fontSize: 43,
    color: 'white'
  }
});
