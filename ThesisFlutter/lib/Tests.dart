import 'package:flutter/material.dart';
import 'dart:math';

fibIter(int n){
  if (n <= 1) return n;
  int fib = 1;
  int prevFib = 1;
  for (int i = 2; i < n; i++) {
    int temp = fib;
    fib += prevFib;
    prevFib = temp;
  }
  return fib;
}

fibRec(int n){
  if (n <= 1) return n;
  return fibRec(n - 1) + fibRec(n - 2);
}

matMul(int n){
  var rng = Random();
  var array = List.generate(n, (_) => List.generate(n, (_) => rng.nextDouble()));
  var result = List.from(array);
  for (var a = 0; a < n; a++) {
    var temp = List.from(result);
    for (var i = 0; i < n; i++) {
      for (var j = 0; j < n; j++) {
        double sum = 0.0;
        for (var k = 0; k < n; k++) {
          sum += array[i][k] * temp[k][j];
        }
        result[i][j] = sum;
      }
    }
  }
}

getPrimes(int n){
  List <bool> array = List.generate(n, (_) => true);
  for (var i=2; i<sqrt(n); i++){
    if(array[i]){
      var temp = pow(i, 2);
      for(var j = 1; temp<n;j++){
        array[temp] = false;
        temp = pow(i, 2) + j* i;
      }
    }
  }
  return array;
}

class TestWidget extends StatefulWidget {
  @override
  TestWidgetState createState() => new TestWidgetState();
}

class TestWidgetState extends State<TestWidget> {
  int number = 1;
  String text = '';
  Stopwatch counter = Stopwatch();
  final myController = new TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Center(child: Column(children: <Widget>[form(),Text(text)]));
  }

  Widget form() {
    GlobalKey<FormState> key = GlobalKey<FormState>();
    return Form(
      key: key,
      child: new Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          TextFormField(
            controller: myController,
            validator: (value) {
              if (value.isEmpty) {
                return 'Please enter a number';
              }
            },
            keyboardType: TextInputType.number,
          ),
          Center(
            child: Column(
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: RaisedButton(
                    onPressed: () {
                      // Validate will return true if the form is valid, or false if
                      // the form is invalid.
                      if (key.currentState.validate()) {
                        setState(() {
                          number = int.parse(myController.text);
                          counter.start();
                          int result = fibIter(number);
                          counter.stop();
                          text = "Result: ${result.toString()}\nTime:${counter.elapsedMicroseconds}";
                          counter.reset();
                        });
                      }
                    },
                    child: new Text('Fibonacci Iterative'),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: RaisedButton(
                    onPressed: () {
                      // Validate will return true if the form is valid, or false if
                      // the form is invalid.
                      if (key.currentState.validate()) {
                        setState(() {
                          number = int.parse(myController.text);
                          counter.start();
                          int result = fibRec(number);
                          counter.stop();
                          text = "Result: ${result.toString()}\nTime:${counter.elapsedMicroseconds}";
                          counter.reset();
                        });
                      }
                    },
                    child: new Text('Fibonacci Recursive'),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: RaisedButton(
                    onPressed: () {
                      // Validate will return true if the form is valid, or false if
                      // the form is invalid.
                      if (key.currentState.validate()) {
                        setState(() {
                          number = int.parse(myController.text);
                          counter.start();
                          int result = matMul(number);
                          counter.stop();
                          text = "Result: ${result.toString()}\nTime:${counter.elapsedMicroseconds}";
                          counter.reset();
                        });
                      }
                    },
                    child: new Text('Power Matrix'),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.all(16.0),
                  child: RaisedButton(
                    onPressed: () {
                      // Validate will return true if the form is valid, or false if
                      // the form is invalid.
                      if (key.currentState.validate()) {
                        setState(() {
                          number = int.parse(myController.text);
                          counter.start();
                          List<bool> result = getPrimes(number);
                          counter.stop();
                          StringBuffer str = StringBuffer();
                          for(var i=1;i<result.length;i++){
                            if(result[i]) str.write(i.toString()+" ");
                          }
                          text = "Time:${counter.elapsedMicroseconds}\nResult: ${str}";
                          counter.reset();
                        });
                      }
                    },
                    child: new Text('Get primes'),
                  ),
                )
              ],
            ),
          )
        ],
      ),
    );
  }
}
