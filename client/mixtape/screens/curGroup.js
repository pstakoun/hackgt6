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
      mood: 'Mood',
      isLiked: false,
      isDisliked: false,
      song: 'Faded',
      artist: 'Alan Walker',
      artURL: 'https://i.scdn.co/image/ab67616d0000b273c4d00cac55ae1b4598c9bc90'
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
        <Button
          onPress={navigation.getParam('invite')}
          title="Invite"
          color="#007bff"
        />
      ),
    };
  };

  componentDidMount() {
    const _id = JSON.stringify(this.props.navigation.getParam('id', 'NO-ID'));
    const first = (JSON.stringify(this.props.navigation.getParam('first', false)) == 'true');
    this.setState({groupID: _id});
    if (first == true) {
      this.props.navigation.navigate('AddMembers', {id: _id})
    }
    this.props.navigation.setParams({ invite: this._invite });
    fetch('http://localhost:3000/users/me/current')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch(error => console.log(error.message));

    this.getTrack();
  }

  getTrack() {
    this.timeout(300000, fetch('http://localhost:3000/users/me/current'))
      .then((response) => response.json())
      .then((data) => {
        console.log(data)

      })
      .catch(error => {
        console.log(error.message)
      });
  }

  timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
      setTimeout(function() {
        reject(new Error("timeout"))
      }, ms);
      promise.then(resolve, reject)
    })
  }

  _invite = () => {
    this.props.navigation.navigate('AddMembers', {id: this.state.groupID})
  };

  addSong() {
    //adds song to library for the given user
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
      })
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
              source={{uri: 'https://i.scdn.co/image/ab67616d0000b273c4d00cac55ae1b4598c9bc90'}}
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
