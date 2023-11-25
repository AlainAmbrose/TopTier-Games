import 'package:flutter/material.dart';
import 'appbar.dart';
import 'package:http/http.dart' as http;

class DiscoverPage extends StatelessWidget {
  Map<String, dynamic> jsonResponse;
  DiscoverPage({Key? key, required this.jsonResponse}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
                child: const Text('Discover New Games:',
                  style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Inter-Bold',
                      fontStyle: FontStyle.italic,
                      fontSize: 30),
                      ),
              ),
              Container(

              ),
           ],
        ),
      ),
    );
  }
}