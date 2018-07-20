import React from 'react';
import { StyleSheet, Text, TextInput, View, FlatList, ActivityIndicator, Image, Button, Keyboard } from 'react-native';
import Contact from './Contact'

const url = 'https://randomuser.me/api/?results='

export default class ContactList extends React.Component {
  constructor() {
    super()
    this.state = {
      data: null,
      ready: false,
      text: ''
    }
    this.renderItem = this.renderItem.bind(this)
    this.getData = this.getData.bind(this)
  }
  static navigationOptions = {
    title: 'List',
  };

  componentDidMount() {
    //this.getData()
    console.log("Contacts didmount")
  }

  onPressItem(id) {
    console.log("ContactList callback", id)
  };

  renderItem({ item }) {
    return (
      <Contact
        email={item.email}
        //onPressItem={this.onPressItem}
        picture={item.picture.large}
      />
    )
  }

  async getData() {
    Keyboard.dismiss
    const { text } = this.state
    let data
    myUrl = url + text
    try {
      let response = await fetch(myUrl)
      data = await response.json()
    } catch (e) {
      console.log("Error retrieving data: ", e)
      return
    }
    this.setState({ data: data.results, ready: true })
  }
  render() {
    const { data } = this.state
    return (
      <View style={styles.container}>
        <TextInput
          style={{ borderColor: 'gray', borderWidth: 1 }}
          keyboardType='numeric'
          onChangeText={(text) => this.setState({ text })}
          value={this.state.text}
          clearTextOnFocus={true}
          onSubmitEditing={this.getData}
        />
        <Button
          onPress={this.getData}
          title="Update"
        />
        {data &&
          <View style={{ backgroundColor: '#F0FFFF' }}>
            <FlatList
              data={data}
              keyExtractor={item => item.email}
              renderItem={this.renderItem} />
          </View>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  }
});