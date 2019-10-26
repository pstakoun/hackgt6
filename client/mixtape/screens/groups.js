// Main.js
import React, {Fragment} from 'react'
import {   SafeAreaView,
  StyleSheet, Platform,   StatusBar,
  Switch, Text, View , Button, TextInput, Alert} from 'react-native'
import GropuItem from '../components/groupItem'
import global from '../style/global'

export default class groups extends React.Component {
  constructor(props) {
    super(props);

  }

  static navigationOptions = ({ navigation }) => {
    return {
      title:'Groups',
      headerRight: () => (
        <Button
          onPress={navigation.getParam('makeGroup')}
          title="+"
          color="#007bff"
        />
      ),
    };
  };

  componentDidMount() {
    fetch('http://localhost:3000/groups')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch(error => console.log(error.message));
    this.props.navigation.setParams({ makeGroup: this._makeGroup });
  }

  _makeGroup = () => {
    Alert.prompt(
      'Create Group', null, (text) => (
        fetch('http://localhost:3000/groups', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          //edit this to choose what data you want in new group (the name and members are both in state)
          body: JSON.stringify({name: text}),
        })
          .then((response) => response.json())
          .then((data) => console.log(data))
          .then(() => this.props.navigation.navigate('Main'))
          .catch(error => console.log(error.message))
      )
    );
  };

  render() {

    return (
      <View style={global.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View>
            <GropuItem id={'1234abcd'} title={"Apes"} mood={"Crazy"} navigation={this.props.navigation}/>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
