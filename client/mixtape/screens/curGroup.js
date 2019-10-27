// Main.js

//groups/groupID/invite POST

import React, {Fragment} from 'react'
import {   SafeAreaView,
           StyleSheet,
           StatusBar,
           Text,
           View ,
           Button,
           Image,
           Dimensions,
           TouchableOpacity} from 'react-native'
import global from '../style/global'
import {Icon} from "react-native-elements";

export default class groups extends React.Component {
  constructor(props) {
    super(props);

    this.toggleDown = this.toggleDown.bind(this);
    this.toggleUp = this.toggleUp.bind(this);

    this.state = {
      groupID: '',
      name: 'Name',
      isLiked: false,
      isDisliked: false,
      song: 'Not Playing',
      artist: '',
      artURL: '',
      added: false,
      playlistID: '',
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title:'Groups',
      headerStyle: {
        height: 60,
        backgroundColor: '#2F2F2F',
        borderBottomColor: 'transparent',
      },
      headerRight: () => (
        <View style={{marginTop: 10, marginRight: 15}}>
          <TouchableOpacity onPress={navigation.getParam('invite')}>
            <Icon name='envelope' type={'evilicon'} size={40} color={"#007bff"}/>
          </TouchableOpacity>
        </View>
      ),
    };
  };

  componentDidMount() {
    const _id = JSON.stringify(this.props.navigation.getParam('id', 'NO-ID'));
    this.setState({groupID: _id});
    this.startPlaylist();
    this.props.navigation.setParams({ invite: this._invite });
    this.timer = setInterval(()=> this.getTrack(), 3000);
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  startPlaylist() {
    fetch(`http://localhost:3000/groups/${this.state.groupID}/playlists`)
      .then((response) => response.json())
      .then((data) => this.setState({playlistID: data[0]._id}))
      .catch(error => console.log(error.message));

    fetch(`http://localhost:3000/groups/${this.state.groupID}/playlists/${this.state.playlistID}/play`, {
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
  }

  getTrack() {
    fetch('http://localhost:3000/users/me/current')
      .then((response) => response.json())
      .then((data) => {
        let parseData = JSON.parse(data);
        this.setState({
          song: parseData.item.name,
          artist: parseData.item.artists[0].name,
          artUrl: parseData.item.album.images[0].url,
        });
      })
      .catch(error => {
        //console.log(error.message)
      });
  }

  _invite = () => {
    this.props.navigation.navigate('AddMembers', {id: this.state.groupID})
  };

  addSong() {
    fetch('http://localhost:3000/users/me/current/save', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      //edit this to choose what data you want in new group (the name and members are both in state)
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => this.setState({added: true}))
      .catch(error => console.log(error.message));
  }

  updatePoll() {
    //updates the user's vote on a song when it is changed
  }

  toggleUp() {
    var up = this.state.isLiked;
    if (up) {
      this.setState({isLiked: false})
    } else {
      this.setState({
        isLiked: true,
        isDisliked: false,
      })
    }
    this.updatePoll()
  }

  toggleDown() {
    var down = this.state.isDisliked;
    if (down) {
      this.setState({isDisliked: false})
    } else {
      this.setState({
        isLiked: false,
        isDisliked: true,
      });
      fetch('http://localhost:3000/users/me/skip', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        //edit this to choose what data you want in new group (the name and members are both in state)
        body: JSON.stringify({}),
      })
      .then((response) => response.json())
      .then((data) => this.setState({isDisliked: false, isLiked: false}))
      .catch(error => console.log(error.message));
    }
    this.updatePoll()
  }

  render() {

    return (
      <View style={global.container}>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.container}>
            <Image
              source={{uri: this.state.artUrl}}
              style={styles.albumArt}
              resizeMode={"contain"}
            />
            <Text style={[global.fontColor, styles.song]}>{this.state.song}</Text>
            <Text style={[global.fontColor, styles.artist]}>{this.state.artist}</Text>
            <View style={[styles.rowContainer, {marginTop: 30}]}>
              <View style={styles.arrowWrapper}>
                <TouchableOpacity
                  type="submit"
                  onPress={() => this.toggleDown()}>
                  <Icon name='arrow-down' type={'evilicon'} size={60} color= {this.state.isDisliked ? 'red' : 'white'}/>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                type="submit"
                //disabled={this.state.added}
                onPress={() => this.addSong()}>
                <Text style={styles.plus}>+</Text>
              </TouchableOpacity>
              <View style={styles.arrowWrapper}>
                <TouchableOpacity
                  type="submit"
                  onPress={() => this.toggleUp()}>
                  <Icon name='arrow-up' type={'evilicon'} size={60} color= {this.state.isLiked ? 'green' : 'white'}/>
                </TouchableOpacity>
              </View>
            </View>
            <View style={[styles.rowContainer, {marginTop: 20}]}>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

const MARGIN = 15;

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginHorizontal: MARGIN
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  albumArt: {
    width: Dimensions.get('window').width - MARGIN * 2,
    height: Dimensions.get('window').width - MARGIN * 2,
    backgroundColor: '#242424'
  },
  song: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 20
  },
  artist: {
    fontSize: 20,
    marginTop: 2
  },
  plus: {
    fontSize: 50,
    color: 'white',
    fontWeight: '200',
    marginHorizontal: 70,
  },
  arrowWrapper: {
    marginTop: 10
  }
});
