// This line imports the extension
import 'package:flutter/material.dart';
import 'package:flutter_driver/driver_extension.dart';
import '../lib/main.dart';

void main() {
  // This line enables the extension
  enableFlutterDriverExtension();

  // Call the `main()` of your app or call `runApp` with whatever widget
  // you are interested in testing.

  runApp(MyApp());
}

