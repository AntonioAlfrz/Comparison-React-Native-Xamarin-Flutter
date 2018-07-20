import { AppRegistry } from 'react-native';
import App from './App';

console.time('Startup')
console.log("Index")

AppRegistry.registerComponent('temp', () => App);
