import React from 'react';
import ContactList from './components/ContactList'
import TouchScreen from './components/TouchScreen'
import LocationScreen from './components/LocationScreen'
import CameraScreen from './components/CameraScreen'
//import Bluetooth from './components/BluetoothScreen'
import test from './components/test'
import Tests from './components/Tests'
import { TabNavigator } from 'react-navigation';

const RootStack = TabNavigator(
  {
    ContactList: {
      screen: ContactList,
    },
    Location: {
      screen: LocationScreen,
    },
    Camera: {
      screen: CameraScreen,
    },
    Bluetooth: {
      screen: test,
    },
    Tests: {
      screen: Tests,
    },
  },
  {
    initialRouteName: 'Tests',
    tabBarOptions: {
      labelStyle: {
        fontSize: 10,
      }
    }

  }
);

export default class App extends React.Component {
  constructor(){
    super()
    console.log("App constructor")
  }
  componentDidMount(){
    console.log("App didmount")
    console.timeEnd('Startup')
  }
  render() {
    return (
      <RootStack />
    );
  }
}