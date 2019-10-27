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
      <TouchableOpacity onPress= {() => this.props.navigation.navigate('CurGroup', {id: this.props.id, first: false})}>
        <View style={[styles.itemWrapper, global.backColor]}>
          <Text style={[styles.itemName, global.fontColor]}>{this.props.name}</Text>
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
    paddingRight: 30,
    paddingVertical: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#707070',
    marginLeft:30
  },

  itemName: {
    fontSize: 23,
    fontWeight: 'bold',
  },

  itemNote: {
    fontSize: 13,
  },

  chevronWrapper: {
    right: 30,
    position: 'absolute',
    marginTop: 12,
  },
});

