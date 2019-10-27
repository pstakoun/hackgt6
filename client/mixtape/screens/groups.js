// Main.js
import React, {Fragment} from 'react'
import {
  SafeAreaView,
  StyleSheet, Platform, StatusBar,
  Switch, Text, View, Button, TouchableOpacity, Alert, FlatList
} from 'react-native'
import GropuItem from '../components/groupItem'
import global from '../style/global'
import GroupItem from "../components/groupItem";
import { StackActions, NavigationActions } from 'react-navigation';

export default class groups extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title:'Groups',
      headerRight: () => (
        <View>
          <TouchableOpacity onPress={navigation.getParam('makeGroup')}>
            <Text style={{color: "#007bff", fontSize: 45, fontWeight: '200', marginRight: 20}}>+</Text>
          </TouchableOpacity>
        </View>
      ),
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ makeGroup: this._makeGroup });
    this.getGroups();
  }

  _makeGroup = () => {
    Alert.prompt(
      'Create Group', null, (text) => {
        if (text.length > 0) {
          fetch('http://mixtape.fratstar.org/users/me')
            .then((response) => response.json())
            .then((d) => {
              console.log(d);
              fetch('http://mixtape.fratstar.org/groups', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                //edit this to choose what data you want in new group (the name and members are both in state)
                body: JSON.stringify({name: text}),
              })
                .then((response) => response.json())
                .then((groupdata) => {
                  fetch('http://mixtape.fratstar.org/groups/' + groupdata._id + '/playlists', {
                    method: 'POST',
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'application/json',
                    },
                  })
                    .then((response) => response.json())
                    .then((data) => {
                      this.makeRoutes(groupdata)
                    })
                    .catch(error => console.log(error.message));
                })
                .catch(error => console.log(error.message));
            })
        }
      }
    );
  };

  getGroups() {
    fetch('http://mixtape.fratstar.org/groups')
      .then((response) => response.json())
      .then((data) => this.setState({groups: data}))
      .catch(error => console.log(error.message));
  }

  makeRoutes(data) {
    const resetAction = StackActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({ routeName: 'Groups' }),
        NavigationActions.navigate({ routeName: 'CurGroup', params:{id: data._id} }),
        NavigationActions.navigate({ routeName: 'AddMembers', params:{id: data._id} }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {

    return (
      <View style={global.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View>
            <FlatList
              data={this.state.groups}
              renderItem={({item}) =>
                (
                  <GroupItem id={item._id} name={item.name} navigation={this.props.navigation}/>
                )
              }
              keyExtractor={item => item._id}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
