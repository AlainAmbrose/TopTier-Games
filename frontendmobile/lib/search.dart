import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class SearchPage extends StatelessWidget {
  const SearchPage({super.key});

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
      body: Stack(
        children: [
          Center(
          child: Stack(
          alignment: Alignment.center,
          children: [
          Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.black, Color.fromARGB(255, 105, 105, 105)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
          ),
        )),
            TextField(
              decoration: InputDecoration(
                labelText: 'Search',
                labelStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold,
                ),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(20),
                borderSide: const BorderSide(width: 3, color: Colors.black)),
                filled: true,
                fillColor: Colors.grey,
                prefixIcon: const Icon(Icons.search, color: Colors.white, size: 30),
                contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10)

              ),
              style: const TextStyle(color: Colors.white),
            )
      ]
      )
          )
        ]
      )
    );
  }
}