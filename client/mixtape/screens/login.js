// Main.js
import React, {Fragment} from 'react'
import {    SafeAreaView,
            StyleSheet,
            StatusBar,
            Text,
            View ,
            TouchableOpacity} from 'react-native'

export default class login extends React.Component {
  constructor(props) {
    super(props);

    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin() {
    this.props.navigation.navigate('Main')
  };

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View>
            <Text>Sign In</Text>
            <TouchableOpacity
              type="submit"
              onPress={this.handleLogin}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>
                Login
              </Text>
            </TouchableOpacity>
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
  loginButton: {

  },
  loginText: {

  }
});
