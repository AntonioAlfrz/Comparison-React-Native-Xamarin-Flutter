import 'dart:async';

// Imports the Flutter Driver API
import 'package:flutter_driver/flutter_driver.dart';
import 'package:test/test.dart';

void main() {
  group('scrolling performance test', () {
    FlutterDriver driver;

    setUpAll(() async {
      // Connects to the app
      driver = await FlutterDriver.connect();
    });

    tearDownAll(() async {
      if (driver != null) {
        // Closes the connection
        driver.close();
      }
    });

    test('measure', () async {
      for (int i = 0; i < 3; i++) {
        Timeline timeline = await driver.traceAction(() async {
          // Find the scrollable user list
          SerializableFinder userList = find.byValueKey('mylist');
          //SerializableFinder edittext = find.byValueKey()

          // Scroll down 3 times
          for (int i = 0; i < 3; i++) {
            // Scroll 600 pixels down, for 300 millis
            await driver.scroll(
                userList, 0.0, -600.0, const Duration(milliseconds: 300));

            // Emulate a user's finger taking its time to go back to the original
            // position before the next scroll
            await new Future.delayed(const Duration(milliseconds: 300));
          }

          // Scroll up 3 times
          for (int i = 0; i < 3; i++) {
            await driver.scroll(
                userList, 0.0, 600.0, const Duration(milliseconds: 300));
            await new Future.delayed(const Duration(milliseconds: 300));
          }
        });

        // The `timeline` object contains all the performance data recorded during
        // the scrolling session. It can be digested into a handful of useful
        // aggregate numbers, such as "average frame build time".
        TimelineSummary summary = new TimelineSummary.summarize(timeline);

        int totalFrames = summary.countFrames();
        int missed = summary.computeMissedFrameBuildBudgetCount();
        int gpumisssed = summary.computeMissedFrameRasterizerBudgetCount();
        print(totalFrames);
        print(missed);
        print(gpumisssed);
        double div = gpumisssed / totalFrames * 100;
        print(div);

        // The following line saves the timeline summary to a JSON file.
        //summary.writeSummaryToFile('scrolling_performance', destinationDirectory: '.', pretty: true);

        // The following line saves the raw timeline data as JSON.
        //summary.writeTimelineToFile('scrolling_performance', pretty: true, destinationDirectory: '.');
      }
    });
  });
}
