import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:flutter_blue/flutter_blue.dart';

class BLEWidget extends StatelessWidget {
  Guid _serviceGUID = Guid("b9e875c0-1cfa-11e6-b797-0002a5d5c51b");
  Guid _CHAR_W_UUID = Guid("0c68d100-266f-11e6-b388-0002a5d5c51b");
  Guid _CHAR_N_UUID = Guid("1ed9e2c0-266f-11e6-850b-0002a5d5c51b");
  var _start_base64 = utf8.encode("start");
  BluetoothDevice device = BluetoothDevice(
      id: DeviceIdentifier("FC:D6:BD:10:14:84"), name: "XDK_BLE_SEND");
  BluetoothCharacteristic notifyChar;

  FlutterBlue _flutterBlue = FlutterBlue.instance;

  Future<Null> write(List<BluetoothService> list) async {
    // device BluetoothService service;
    for (BluetoothService serv in list) {
      BluetoothCharacteristic writeChar;
      if (serv.uuid == _serviceGUID) {
        for (BluetoothCharacteristic char in serv.characteristics) {
          if (char.uuid == _CHAR_W_UUID) writeChar = char;
          if (char.uuid == _CHAR_N_UUID) notifyChar = char;
        }
        await device.writeCharacteristic(writeChar, _start_base64,
            type: CharacteristicWriteType.withResponse);
        bool result = await device.setNotifyValue(notifyChar, true);
        print(result);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<BluetoothState>(
      future: _flutterBlue.state,
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          if (snapshot.data == BluetoothState.off) {
            return Center(child: Text('Bluetooth adapter is off'));
          } else {
            return StreamBuilder<ScanResult>(
              stream: _flutterBlue.scan(
                  withServices: [_serviceGUID], timeout: Duration(seconds: 10)),
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  device = snapshot.data.device;
                  return StreamBuilder<BluetoothDeviceState>(
                    stream: _flutterBlue.connect(device),
                    builder: (context, snapshot) {
                      if (snapshot.hasData) {
                        return FutureBuilder<List<BluetoothService>>(
                            future: device.discoverServices(),
                            builder: (context, snapshot) {
                              if (snapshot.hasData) {
                                return FutureBuilder<Null>(
                                  future: write(snapshot.data),
                                  builder: (context, snapshot) {
                                    if (snapshot.connectionState ==
                                        ConnectionState.done) {
                                      return StreamBuilder<List<int>>(
                                        stream:
                                            device.onValueChanged(notifyChar),
                                        builder: (context, snapshot) {
                                          print(notifyChar.isNotifying);
                                          if (snapshot.hasData) {
                                            return Center(
                                              child: Text(
                                                  snapshot.data.toString()),
                                            );
                                          }
                                          return Center(
                                            child: Text(
                                                "Waiting for acceloremeter data"),
                                          );
                                        },
                                      );
                                    }
                                    return Center(
                                      child: Text('Writing to characteristic'),
                                    );
                                  },
                                );
                              }
                              return Center(
                                child: Text("Discovering services"),
                              );
                            });
                      }
                      return Center(
                        child: Text("Connecting"),
                      );
                    },
                  );
                }
                return Center(
                  child: Text("Scanning"),
                );
              },
            );
          }
        } else {
          return Center(child: Text('Bluetooth adapter is off'));
        }
      },
    );
  }
}
