'use strict';
import React from 'react';
import {
  Dimensions, StyleSheet, Button, Text,
  TouchableOpacity, PermissionsAndroid, View, Image
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import 'react-native-console-time-polyfill';

const permissions = [
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.CAMERA
]

export default class CameraExample extends React.Component {

  constructor() {
    super()
    this.state = {
      text: "Init",
      photo: null,
      // Photo / OCR
      phase: null,
      result: null
    }
    this.Display = this.Display.bind(this)
    this.ocr = this.ocr.bind(this)
  }

  static navigationOptions = {
    title: 'Camera',
  };

  componentDidMount() {
    console.log("Camera didmount")
  }

  recognize(path) {
    this.setState({ text: "Waiting for result" })
    console.time("test")
    RNTesseractOcr.recognize(path, "LANG_ENGLISH", {})
      .then((result) => {
        console.timeEnd("test")

        console.log("OCR Result: ", result);
        this.setState({ text: result })
        return result
      })
      .catch((err) => {
        console.log("OCR Error: ", err);
      })
      .done();
  }
  async requestCameraPermission() {
    let granted = true
    try {
      const result = await PermissionsAndroid.requestMultiple(permissions)
      Object.entries(result).forEach(
        ([key, value]) => granted = granted && value === PermissionsAndroid.RESULTS.GRANTED
      );
      if (granted) {
        this.setState({ text: "Camera permission granted" })
        console.log("You can use the camera")
      } else {
        this.setState({ text: "Camera permission not granted" })
        console.log("Camera permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  ocr() {
    const temp = "/storage/emulated/0/Android/data/mydata/testocr.png"
    this.setState({ phase: "OCR", text: "Waiting for OCR result" })
    this.recognize(temp)
  }

  async takePicture() {
    this.requestCameraPermission()
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      const data = await this.camera.takePictureAsync(options)
      this.setState({ photo: data.uri })
      console.log(data.uri)
      this.recognize(data.uri.replace('file://', ''))
    }
  };

  Display() {
    const { phase, result, photo } = this.state
    switch (phase) {
      case null:
        return (
          <View>
            <Text> Select an option </Text>
            <Button onPress={this.ocr} title="OCR" />
            <Button onPress={() => this.setState({ phase: "Photo" })} title="Take photo" />
          </View>
        )
        break
      case "OCR":
        return <Text>{result}</Text>
        break
      case "Photo":
        if (photo) {
          return <Image
            style={{ width: 66, height: 58 }}
            source={{ uri: photo }}
          />
        } else {
          return <View style={styles.container}>
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.off}
              permissionDialogTitle={'Permission to use camera'}
              permissionDialogMessage={'We need your permission to use your camera phone'}
            />
            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center', }}>
              <TouchableOpacity
                onPress={this.takePicture.bind(this)}
                style={styles.capture}
              >
                <Text style={{ fontSize: 14 }}> Photo </Text>
              </TouchableOpacity>
            </View>
          </View>
          break
        }
    }
  }

  render() {
    const { granted, photos, text } = this.state
    return (
      <View>
        <this.Display />
        <Text>{text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20
  }
});