import 'package:geolocation/geolocation.dart';
import 'package:flutter/material.dart';
import 'dart:async';

Future<bool> isLocation() async {
  final GeolocationResult permission =
  await Geolocation.requestLocationPermission(const LocationPermission(
    android: LocationPermissionAndroid.fine,
    ios: LocationPermissionIOS.always,
  ));
  if (permission.isSuccessful) {
    final GeolocationResult result =
    await Geolocation.isLocationOperational();
    if (result.isSuccessful) {
      return result.isSuccessful;
    } else {
      print(result.error.message);
      return false;
    }
  } else {
    print(permission.error.message);
    return false;
  }
}

class GeolocWidget extends StatelessWidget {

  @override
  Widget build(BuildContext context) {
    return new FutureBuilder<bool>(
      future: isLocation(),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return Text(
              'Error on getting location permissions: ${snapshot.error}');
        }
        if (snapshot.hasData) {
          return StreamBuilder<LocationResult>(
            stream:
                Geolocation.locationUpdates(accuracy: LocationAccuracy.best),
            builder:
                (BuildContext context, AsyncSnapshot<LocationResult> snapshot) {
              if (snapshot.hasError || (snapshot.hasData && !snapshot.data.isSuccessful))
                return new Text('Error on getting location: ${snapshot.error ?? snapshot.data.error.toString()}');
              LocationResult loc = snapshot.data;
              switch (snapshot.connectionState) {
                case ConnectionState.none:
                  return new Text('Init');
                case ConnectionState.waiting:
                  return Center(
                    child: Text('Waiting for location...'),
                  );
                case ConnectionState.active:
                  return Center(
                    child: Text('${loc.location}'),
                  );
                case ConnectionState.done:
                  return Center(
                    child: Text('${loc.location}'),
                  );
              }
            },
          );
        } else {
          return CircularProgressIndicator();
        }
      },
    );
  }
}
