import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Image, TouchableHighlight } from 'react-native';

export default class Contact extends React.PureComponent {

  render() {
    const {email, picture} = this.props
    return (
      <TouchableHighlight onPress={this.onPress}>
        <View style={styles.cell}>
          <Image
            style={{ width: 50, height: 50 }}
            source={{ uri: picture }}
          />
          <Text>{email}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row'
  }
});