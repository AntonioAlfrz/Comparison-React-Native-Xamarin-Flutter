import React from 'react';
import { Text, View, FlatList, StyleSheet, Button } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const myservice = "b9e875c0-1cfa-11e6-b797-0002a5d5c51b"
const DEVICE_NAME = "XDK_BLE_SEND"
const CHAR_W_UUID = "0c68d100-266f-11e6-b388-0002a5d5c51b";
const CHAR_N_UUID = "1ed9e2c0-266f-11e6-850b-0002a5d5c51b";

export default class Bluetooth extends React.Component {
    constructor() {
        super()
        this.manager = new BleManager();
        this.manager.setLogLevel("verbose")
        this.state = {
            text: 'Init',
            devices: [],
            mydevice: null
        }
        this.renderItem = this.renderItem.bind(this)
        this.scanAndConnect = this.scanAndConnect.bind(this)
    }
    static navigationOptions = {
        title: 'Bluetooth',
      };

    componentDidMount() {
        // const subscription = this.manager.onStateChange((state) => {
        //     this.setState({ text: state })
        //     if (state === 'PoweredOn') {
        //         this.scanAndConnect();
        //         subscription.remove();
        //     }
        // }, true);
    }
    async scanAndConnect() {
        const { devices, mydevice } = this.state
        if (mydevice) {
            console.log("Cancel connection")
            await mydevice.cancelConnection();
        }

        this.manager.startDeviceScan(null, null, (error, device) => {
            //console.log('Device', device.name)
            if (error) {
                // Handle error (scanning will be stopped automatically)
                this.setState({ text: error })
                return
            }
            if (device.name === DEVICE_NAME) {
                const newDevices = [...devices, DEVICE_NAME+devices.length]
                this.setState({ devices: newDevices, mydevice: device })
                this.manager.stopDeviceScan();
                console.log("Connecting")
                device.connect()
                    .then((device) => {
                        return device.discoverAllServicesAndCharacteristics()
                    })
                    .then((device) => {
                        console.log("All available services have been discovered!")
                        return this.setupNotifications(device)
                    })
                    .then(() => {
                        this.setState({ text: "Listening..." })
                    }, (error) => {
                        this.error(error.message)
                    })
                    .catch((error) => {
                        // Handle errors
                    });
            }
        });
    }

    async setupNotifications(device) {
        let mychar
        const chars = await device.characteristicsForService(myservice)
        chars.forEach(element => {
            if(element.uuid===CHAR_N_UUID){
                mychar = element
            }
        });
        //console.log(mychar)
        const characteristic = await device.writeCharacteristicWithoutResponseForService(
            myservice, CHAR_W_UUID, btoa("start"))
        //console.log(mychar)
        // if(mychar.isNotifiable){
        //     device.monitorCharacteristicForService(myservice, CHAR_N_UUID, (error, characteristic) => {
        //         if (error) {
        //             console.log(error, error.reason, error.errorCode)
        //             return
        //         }
        //         this.setState({ text: characteristic.value })
        //     })
        // }
        
    }
    renderItem({ item }) {
        //console.log("Render", item)
        return (
            <Text>{item}</Text>
        )
    }

    render() {
        const { text, devices } = this.state
        //console.log(this.state)
        return (
            <View>
                <Text>{text}</Text>
                <FlatList
                    data={devices}
                    keyExtractor={item => item}
                    renderItem={this.renderItem} />
                <Button
                    onPress={this.scanAndConnect}
                    title="Scan"
                    color="#841584"
                    accessibilityLabel="Learn more about this purple button"
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'flex-start',
        justifyContent: 'center',
    }
});