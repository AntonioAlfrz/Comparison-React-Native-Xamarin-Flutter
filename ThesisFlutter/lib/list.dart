import 'dart:async';
import 'dart:convert';
import 'package:flutter/cupertino.dart';


import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

Future<List<User>> fetchUsers(int number) async {
  final response = await http.get('https://randomuser.me/api/?results=$number');
  final responseJson = json.decode(response.body);
  List<dynamic> myList = responseJson['results'];
  List<User> list = new List<User>();

  myList.forEach((element) {
    User temp = User.fromJson(element);
    list.add(temp);
  });
  return list;
}

class User {
  final String email;
  final String pictureURL;

  User({this.email, this.pictureURL});

  factory User.fromJson(Map<String, dynamic> json) {
    return new User(
      email: json['email'],
      pictureURL: json['picture']['medium'],
    );
  }
}

class ListWidget extends StatefulWidget {
  @override
  ListWidgetState createState() => new ListWidgetState();
}

class ListWidgetState extends State<ListWidget> {
  final _biggerFont = const TextStyle(fontSize: 18.0);
  int number = -1;
  final myController = new TextEditingController();

  @override
  void dispose() {
    // Clean up the controller when the Widget is disposed
    myController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[form(), Flexible(child: myList(),)],

    );
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
          new Padding(
            padding: const EdgeInsets.symmetric(vertical: 16.0),
            child: new RaisedButton(
              onPressed: () {
                // Validate will return true if the form is valid, or false if
                // the form is invalid.
                if (key.currentState.validate()) {
                  setState(() {
                    number = int.parse(myController.text);
                  });
                }
              },
              child: new Text('Update'),
            ),
          ),
        ],
      ),
    );
  }

  Widget myList() {
    if (number==-1) return Container();
    return FutureBuilder<List<User>>(
      future: fetchUsers(number),
      builder: (context, snapshot) {
        if (snapshot.hasData) {
          List<User> list = snapshot.data;
          return ListView.builder(
            key: Key('mylist'),
              padding: const EdgeInsets.all(16.0),
              itemCount: list.length,
              itemBuilder: (context, index) {
                //if (index.isOdd) return new Divider();
                return _buildRow(list[index]);
              });
        }
        return Center(
          child: CircularProgressIndicator(),
        );
      },
    );
  }

  Widget _buildRow(User user) {
    return new ListTile(
        leading: new Image.network(
          user.pictureURL,
        ),
        title: new Text(
          user.email,
          style: _biggerFont,
        ));
  }
}
