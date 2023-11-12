import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LibraryPage extends StatelessWidget {
  const LibraryPage ({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
        initialIndex: 1,
        length: 3,
      child: Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: const Text(
            'TopTier',
            style: TextStyle(
                fontFamily: 'Inter-Bold',
                fontWeight: FontWeight.w800,
                fontStyle: FontStyle.italic,
                fontSize: 25),
        ),
        backgroundColor: Colors.black,
      ),

      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color.fromARGB(255, 141, 141, 141), Colors.black],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: ListView(
          children: <Widget>[
            Container(
                height: 30,
                margin: const EdgeInsets.all(10.0),
                decoration: BoxDecoration(
                  color: Colors.white70,
                  borderRadius: BorderRadius.circular(50),
                ),
                child: TabBar(
                  unselectedLabelStyle: const TextStyle(
                      fontFamily: 'Inter-Regular',
                      fontStyle: FontStyle.italic,
                      fontSize: 20),

                  unselectedLabelColor:Colors.black26,
                  labelColor: const Color.fromARGB(255, 229, 229, 229),
                  indicatorPadding: const EdgeInsets.all(2.0),
                  labelStyle: const TextStyle(
                      fontFamily: 'Inter-Regular',
                      fontStyle: FontStyle.italic,
                      fontSize: 20),

                  indicator: BoxDecoration(
                      color: const Color.fromARGB(255, 59, 59, 59),
                      borderRadius: BorderRadius.circular(50)), //Change background color from here
                  tabs: const <Widget>[
                    Tab(
                      text: "Rating",
                    ),
                    Tab(
                      text: "Title",
                    ),
                    Tab(
                      text: "Recent",
                    ),
                  ],
                )
            ),
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color.fromARGB(255, 141, 141, 141), Colors.black],
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