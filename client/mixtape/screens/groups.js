// Main.js
import React, {Fragment} from 'react'
import {   SafeAreaView,
  StyleSheet, Platform,   StatusBar,
  Switch, Text, View , Button, TextInput} from 'react-native'
import GropuItem from '../components/groupItem'
import global from '../style/global'

export default class groups extends React.Component {
  constructor(props) {
    super(props);

  }

  static navigationOptions = {
    title: 'Groups'
  };

  componentDidMount() {
    fetch('http://localhost:3000/groups')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch(error => console.log(error.message));
  }

  render() {

    return (
      <View style={global.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View>
            <GropuItem title={"Apes"} mood={"Crazy"}/>
            <Button title={'Add Group'} onPress={() => this.props.navigation.navigate("NewGroup")}></Button>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
