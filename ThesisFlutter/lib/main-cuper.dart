import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'list.dart';

void main() => runApp(new MyApp());

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Cupertino Demo', theme: ThemeData.light(), home: MyCupApp());
  }
}

class CupertinoPageExampleOne extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CupertinoPageScaffold(
      child: ListWidget(),
    );
  }
}

class MyCupApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: CupertinoNavigationBar(
        leading: Icon(CupertinoIcons.back),
        middle: Text('Flutter demo'),),
        body: CupertinoTabScaffold(
      tabBar: CupertinoTabBar(
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
              icon: Icon(CupertinoIcons.home), title: Text('List')),
          BottomNavigationBarItem(
              icon: Icon(CupertinoIcons.back), title: Text('Bluetooth')),
          BottomNavigationBarItem(
              icon: Icon(CupertinoIcons.flag), title: Text('Geolocation')),
          BottomNavigationBarItem(
              icon: Icon(CupertinoIcons.check_mark), title: Text('Camera'))
        ],
      ),
      tabBuilder: (BuildContext context, int index) {
        return CupertinoTabView(
          builder: (context) {
            switch (index) {
              case 0:
                return CupertinoPageExampleOne();
                break;
              case 1:
                return CupertinoPageExampleOne();
                break;
              default:
                return Container();
            }
          },
        );
      },
    ));
  }
}
