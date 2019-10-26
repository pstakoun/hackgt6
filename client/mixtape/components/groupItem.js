import React from 'react'

import {
  View,
  Text,
  Image,
  Button,
  StyleSheet
} from 'react-native';

import { TouchableOpacity } from 'react-native-gesture-handler';


class GroupItem extends React.Component {

  constructor(props) {
    super(props);
  }

  onPress() {
    this.props.navigation.navigate('DetailScreen')
  }

  render() {
    return (
      <TouchableOpacity onPress={this.onPress.bind(this)} style={[styles.card, GlobalStyle.shadow]}>
        <View style={styles.labels}>
          <Text style={[styles.title, GlobalStyle.fontStyles]}>Harvest</Text>
          <Text style={[styles.subtitle, GlobalStyle.fontStyles]}>Learn how to harvest your plant</Text>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 30,
    height: 30,
    margin: 10,
  },
  card: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center'
  },
  labels: {
    flexDirection: 'column',
    margin: 5,
  },
  title: {
    fontSize: 15,
  },
  subtitle: {
    fontSize: 10,
  },
  arrow: {

  }
})

export default GroupItem
