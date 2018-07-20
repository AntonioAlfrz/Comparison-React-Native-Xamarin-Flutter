import 'package:flutter/material.dart';
import 'dart:async';
import 'list.dart';
import 'geolocation.dart';
import 'BLEWidget.dart';
import 'CameraWidget.dart';
import 'package:camera/camera.dart';
import 'Tests.dart';

List<CameraDescription> cameras;
Stopwatch counter;

Future<Null> main() async {
  counter = Stopwatch();
  counter.start();
  // Fetch the available cameras before initializing the app.
  try {
    cameras = await availableCameras();
  } on CameraException catch (e) {
    logError(e.code, e.description);
  }
  runApp(MyApp());
  counter.stop();
  int time = counter.elapsedMicroseconds;
  print(time);
}

class MyApp extends StatelessWidget {

  final List<Tab> myTabs = <Tab>[
    Tab(text: "List"),
    Tab(text: "Geolocation"),
    Tab(text: "Bluetooth"),
    Tab(text: "Camera"),
    Tab(text: "Tests"),
  ];

  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      home: new DefaultTabController(
        length: myTabs.length,
        child: new Scaffold(
          appBar: new AppBar(
            bottom: new TabBar(
              tabs: myTabs,
            ),
            title: Text('Flutter Demo'),
          ),
          body: TabBarView(
            children: [
              ListWidget(),
              GeolocWidget(),
              BLEWidget(),
              CameraExampleHome(cameras: cameras),
              TestWidget(),
            ],
          ),
        ),
      ),
    );
  }
}
