import React from 'react';
import { StyleSheet, Platform, View, Text, PermissionsAndroid, Button } from 'react-native';

export default class LocationScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      location: null,
      text: "Permission not granted",
      granted: false,
      error: null
    }
    watchId = null

    this.watchPosition = this.watchPosition.bind(this)
  }
  static navigationOptions = {
    title: 'Location'
  };

  componentDidMount() {
    const { granted } = this.state
    if (!granted) {
      if (Platform.OS === 'android') {
        this.requestLocationPermission()
      } else {
        navigator.geolocation.requestAuthorization()
      }
    }
    //this.getLocationAsync();
    //this.watchPosition();
    console.log("Location didmount")
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  async requestLocationPermission() {
    let granted = true
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Geolocation Permission',
          'message': 'Geolocation Permission.'
        }
      )
      this.setState({
        granted: result === PermissionsAndroid.RESULTS.GRANTED,
        text: "Permission granted, waiting for location"
      })
    } catch (err) {
      console.warn(err)
    }
  }

  getLocationAsync() {
    console.log("Getting location")
    navigator.geolocation.getCurrentPosition(position => {
      console.log(position)
      const { coords } = position
      this.setState({
        location: position,
        text: `Position acquired: lat: ${coords.latitude} - long: ${coords.longitude}`
      });
    },
      error => {
        this.setState({ error: error.message })
        console.log(error)
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  };

  watchPosition() {
    this.watchId = navigator.geolocation.watchPosition(
      position => {
        console.log(position)
        let date = new Date(position.timestamp)
        const {coords} = position
        this.setState({
          location: position,
          text: `Date: ${date}. Position acquired: lat: ${coords.latitude} - long: ${coords.longitude}`
        })
      },
      error => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0, distanceFilter: 0 },
    )
  }

  render() {
    const { text, error } = this.state
    return (
      <View style={styles.container}>
        <Button
          onPress={this.getLocationAsync}
          title="Update location"
        />
        {error ? (
          <Text>Error: {error}</Text>
        ) : (
            <Text>{text}</Text>
          )
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});