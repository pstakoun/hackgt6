import React from 'react';
import {Text,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Icon } from 'react-native-elements';
import global from '../style/global'

export default class ListItem extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={[styles.itemWrapper, global.backColor]}>
        <View>
          <Text style={[styles.item, global.fontColor]}>{this.props.title}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemWrapper: {
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#707070',
  },

  item: {
    fontSize: 20,
  },
});

