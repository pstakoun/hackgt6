// Main.js
import React, {Fragment} from 'react'
import {   SafeAreaView,
  StyleSheet, Platform,   StatusBar,
  Switch, Text, View , Button, TextInput} from 'react-native'
import GropuItem from '../components/groupItem'
import global from '../style/global'

export default class newGroup extends React.Component {
  constructor(props) {
    super(props);

    this.makeGroup = this.makeGroup.bind(this);
    this.addFriend = this.addFriend.bind(this);

    this.state = {
      name: '',
      thisMember: '',
      members: []
    }
  }

  static navigationOptions = {
    title: 'New Group'
  };


  //makes the group given the criteria
  makeGroup() {
    fetch('http://localhost:3000/groups', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      //edit this to choose what data you want in new group (the name and members are both in state)
      body: JSON.stringify({}),
    });
  }

  addFriend() {
    var members = this.state.members;
    members.push(this.state.thisMember);
    this.setState({
      members: members,
      thisMember: '',
    })
  }

  handleName = (text) => {
    this.setState({ name: text })
  };

  handleMember = (text) => {
    this.setState({ thisMember: text})
  };

  render() {

    return (
      <View style={global.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View>
            <TextInput style = {styles.input}
                       underlineColorAndroid = "transparent"
                       placeholder = "Group Name"
                       placeholderTextColor = "#D3D3D3"
                       autoCapitalize = "none"
                       onChangeText = {this.handleName}/>
            <TextInput style = {styles.input}
                       underlineColorAndroid = "transparent"
                       placeholder = "New Friend"
                       placeholderTextColor = "#D3D3D3"
                       autoCapitalize = "none"
                       onChangeText = {this.handleMember}
                       value={this.state.thisMember}/>
            <Button title={'Add Friend'} onPress={() => this.addFriend()}></Button>
            <Button title={'Add'} onPress={() => this.makeGroup()}></Button>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
