import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class LibraryPage extends StatelessWidget {
  const LibraryPage ({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
        ),
      );
  }
}