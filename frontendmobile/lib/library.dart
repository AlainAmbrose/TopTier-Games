import 'package:flutter/material.dart';
import 'appbar.dart';
import 'gameFunctions.dart';

class LibraryPage extends StatelessWidget {
  Map<String, dynamic> jsonResponse;
  LibraryPage({Key? key, required this.jsonResponse}) : super(key: key);

  PreferredSizeWidget _buildBottomText(Map<String, dynamic> jsonResponse) {
    return PreferredSize(
      preferredSize: const Size.fromHeight(24.0),
      child: Container(
        alignment: Alignment.center,
        padding: const EdgeInsets.only(bottom: 8.0),
        child: Text(
          jsonResponse['firstname'],
          style: const TextStyle(
            fontSize: 16.0,
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
        initialIndex: 1,
        length: 3,
      child: Scaffold(
      extendBodyBehindAppBar: true,
      appBar: TopTierAppBar.returnAppBar(context, jsonResponse),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.black, Color.fromARGB(255, 141, 141, 141)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: ListView(
          children: <Widget>[
            Container(
              margin: const EdgeInsets.all(10.0),
              child: const Text('Your Library:',
                style: TextStyle(
                    color: Colors.white,
                    fontFamily: 'Inter-Bold',
                    fontStyle: FontStyle.italic,
                    fontSize: 30),
              ),
            ),
            Container(
                height: 30,
                margin: const EdgeInsets.all(10.0),
                decoration: BoxDecoration(
                  color: Colors.white54,
                  borderRadius: BorderRadius.circular(50),
                ),
                child: TabBar(
                  unselectedLabelStyle: const TextStyle(
                      fontFamily: 'Inter-Regular',
                      fontStyle: FontStyle.italic,
                      fontSize: 17),

                  unselectedLabelColor: const Color.fromARGB(255, 229, 229, 229),
                  labelColor: const Color.fromARGB(255, 229, 229, 229),
                  indicatorPadding: const EdgeInsets.all(2.0),
                  labelStyle: const TextStyle(
                      fontFamily: 'Inter-Regular',
                      fontStyle: FontStyle.italic,
                      fontSize: 18),

                  indicator: BoxDecoration(
                      color: const Color.fromARGB(255, 59, 59, 59),
                      borderRadius: BorderRadius.circular(50)), //Change background color from here
                  tabs: const <Widget>[
                    Tab(
                      text: "All",
                    ),
                    Tab(
                      text: "Played",
                    ),
                    Tab(
                      text: "Want to Play",
                    ),
                  ],
                )
            ),
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color.fromARGB(255, 105, 105, 105), Colors.black],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),

            ),
          ],
        ),
      ),
      ),
    );
  }


}