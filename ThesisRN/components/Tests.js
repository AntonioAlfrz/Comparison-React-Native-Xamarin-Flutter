import React from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import RNTesseractOcr from 'react-native-tesseract-ocr';
import 'react-native-console-time-polyfill';

function recognize(path) {
    RNTesseractOcr.recognize(path, "LANG_SPANISH", {})
        .then((result) => {
            return result
            return result
        })
        .catch((err) => {
            console.log("OCR Error: ", err);
        })
        .done();
}

function matMul(n) {
    // Create matrix
    let array = new Array(n)
    for (let i = 0; i < array.length; i++) {
        array[i] = new Array(n)
        array[i].forEach(el2 => {
            el2 = Math.random()
        });
    }
    let result = array.slice()
    // Power matrix
    for (let a = 0; a < n - 1; a++) {
        let temp = result.slice()
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length; j++) {
                sum = 0
                for (let k = 0; k < array.length; k++) {
                    sum += array[i][k] * temp[k][j]
                }
                result[i][j] = sum
            }
        }
    }
}

function getPrimes(n) {
    let result = new Array(n)
    result.fill(true)
    for (let i = 2; i < Math.sqrt(n); i++) {
        if (result[i]) {
            let temp = Math.pow(i, 2)
            for (let j = 1; temp < n; j++) {
                result[temp] = false
                temp = Math.pow(i, 2) + j * i
            }
        }
    }
    return result
}

function fibRec(n) {
    if (n <= 1) return n
    return fibRec(n - 1) + fibRec(n - 2)
}

function fibIter(n) {
    if (n <= 1) return n
    let fib = 1
    let prevFib = 1
    for (let i = 2; i < n; i++) {
        let temp = fib
        fib += prevFib
        prevFib = temp
    }
    return fib
}

export default class Tests extends React.Component {
    constructor() {
        super()
        this.state = {
            number: 10,
            text: ''
        }
        this.doIter = this.doIter.bind(this)
        this.doOCr = this.doOCr.bind(this)
        this.doPow = this.doPow.bind(this)
        this.doRec = this.doRec.bind(this)
        this.DoPrime = this.DoPrime.bind(this)
    }

    doOCr() {
        path = "/storage/emulated/0/Android/data/mydata/textSpaCrop.png"
        console.time("ocr")
        result = recognize(path)
        console.timeEnd("ocr")
    }

    doIter() {
        const { number } = this.state
        console.time("iter")
        result = fibIter(number)
        time = console.timeEnd("iter")
        this.setState({ text: result })
    }
    doRec() {
        const { number } = this.state
        console.time("rec")
        result = fibRec(number)
        time = console.timeEnd("rec")
        this.setState({ text: result })
    }
    DoPrime() {
        const { number } = this.state
        console.time("prime")
        result = getPrimes(number)
        time = console.timeEnd("prime")
        this.setState({ text: result })
    }
    doPow() {
        const { number } = this.state
        console.time("pow")
        result = matMul(number)
        time = console.timeEnd("pow")
        //this.setState({text: result})
    }
    render() {
        const { text, number } = this.state
        return (
            <View>
                <TextInput
                    style={{ borderColor: 'gray', borderWidth: 1 }}
                    keyboardType='numeric'
                    onChangeText={(number) => {
                        n = parseInt(number);
                        this.setState({number: n})
                    }}
                    clearTextOnFocus={true}
                />
                <Button
                    onPress={this.doOCr}
                    title="OCR" />
                <Button
                    onPress={this.doIter}
                    title="Fibonacci Iterative" />
                <Button
                    onPress={this.doRec}
                    title="Fibonacci Recursive" />
                <Button
                    onPress={this.doPow}
                    title="Power Matrix" />
                <Button
                    onPress={this.DoPrime}
                    title="Get prime numbers" />
                <Text>{text}</Text>
            </View>
        )
    }

}