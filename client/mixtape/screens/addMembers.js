// Main.js
import React, {Fragment} from 'react'
import {   SafeAreaView,
  StyleSheet,
  StatusBar,
  Text,
  View ,
  Button,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  FlatList} from 'react-native'
import global from '../style/global'
import {Icon} from "react-native-elements";
import ListItem from '../components/listItem'

export default class addMembers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      groupID: '',
      thisMember: '',
      members: []
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title:'Invite',
      headerRight: () => (
        <View style={{marginRight: 20}}>
          <TouchableOpacity onPress={navigation.getParam('sendInvite')}>
            <Icon name='paper-plane' type={'font-awesome'} size={23} color={"#007bff"}/>
          </TouchableOpacity>
        </View>
      ),
    };
  };

  componentDidMount() {
    let _id = JSON.stringify(this.props.navigation.getParam('id', 'NO-ID'));
    this.setState({groupID: _id});
    console.log(_id);
    this.props.navigation.setParams({ sendInvite: this._sendInvite });
  }

  _sendInvite = () => {
    let url = `http://mixtape.fratstar.org/invite`;
    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      //edit this to choose what data you want in new group (the name and members are both in state)
      body: JSON.stringify({
        invites: this.state.members,
        group: this.state.groupID
      }),
    })
    .then((response) => response.json())
    .then(() => this.props.navigation.navigate('CurGroup', {id: this.state.groupID, first: false}))
    .catch(error => console.log(error.message))
  };

  addMember() {
    let members = this.state.members;
    members.push(this.state.thisMember);
    this.setState({
      members: members,
      thisMember: '',
    })
  }

  handleMember = (text) => {
    this.setState({ thisMember: text})
  };

  render() {

    return (
      <View style={global.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.container}>
            <View style={[styles.rowContainer, {marginTop: 20}]}>
              <TextInput style = {[styles.input, global.fontColor]}
                         underlineColorAndroid = "transparent"
                         placeholder = "New Member"
                         placeholderTextColor = "#727272"
                         autoCapitalize = "none"
                         onChangeText = {this.handleMember}
                         value={this.state.thisMember}/>
              <TouchableOpacity style={styles.addIcon} onPress={() => this.addMember()}>
                <Icon name='plus' type={'evilicon'} size={30} color={"#007bff"}/>
              </TouchableOpacity>
            </View>
            <FlatList
              data={this.state.members}
              renderItem={({item}) =>
                (
                  <ListItem title={item}/>
                )
              }
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const MARGIN = 15;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: MARGIN
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  input: {
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: 'white',
    flex: 1,
    marginBottom: 20
  },
  addIcon: {
    marginLeft: 10
  }
});
