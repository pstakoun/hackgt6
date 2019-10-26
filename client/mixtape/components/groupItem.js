import React from 'react';
import {Text,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Icon } from 'react-native-elements';
import global from '../style/global'

export default class GroupItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <TouchableOpacity onPress= {() => this.props.navigation.navigate('CurGroup', {id: this.props.id})}>
        <View style={[styles.itemWrapper, global.backColor]}>
          <View>
            <Text style={[styles.itemTitle, global.fontColor]}>{this.props.title}</Text>
            <Text style={[styles.itemNote, global.fontColor]}>{this.props.mood}</Text>
          </View>
          <View style={styles.chevronWrapper}>
            <Icon name='chevron-right' type={'evilicon'} size={40} color={'white'}/>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    paddingHorizontal: 30,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
  },

  itemTitle: {
    fontSize: 23,
    fontWeight: 'bold',
  },

  itemNote: {
    fontSize: 13,
  },

  chevronWrapper: {
    right: 30,
    position: 'absolute',
    marginTop: 20,
  },
});

