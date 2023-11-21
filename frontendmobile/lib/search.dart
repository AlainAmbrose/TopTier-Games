import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SearchPage extends StatelessWidget {
  Map<String, dynamic> jsonResponse;
  final TextEditingController _searchController = TextEditingController();

  SearchPage({Key? key, required this.jsonResponse}) : super(key: key);

  String _validateTextField(String value) {
    if (value.isEmpty) {
      return 'ERROR';
    }
    return '';
  }

  void _handleSearch(BuildContext context) async {
    String search = _searchController.text;
    String searchError = _validateTextField(search);

    if (searchError != '') {

      Fluttertoast.showToast(msg: "Please enter a game to search.",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          backgroundColor: Colors.white,
          textColor: Colors.black,
          fontSize: 16.0);

      return;
    }

    final data = {
      'search': search,
    };

    final jsonData = jsonEncode(data);

    final headers = <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'credentials': 'include',
    };

    final response = await http.post(Uri.parse('https://poosd-large-project-group-8-1502fa002270.herokuapp.com/Games/api/searchgame'),
      headers: headers,
      body: jsonData
    );

    if (response.statusCode == 200) {
      Fluttertoast.showToast(
        msg: "We found some games! :)",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green, // You can customize the background color
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } else {
      //print(response.statusCode);
      //print(loginResult);
      Fluttertoast.showToast(
        msg: response.statusCode.toString(),
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green, // You can customize the background color
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

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
          actions: [
            Padding(
                padding: const EdgeInsets.fromLTRB(16.0, 16.0, 16.0, 8.0),
                child: Text(
                  "${jsonResponse["firstname"]} ${jsonResponse["lastname"]}",
                  style: const TextStyle(fontSize: 18),
                )
            )
          ]
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
              controller: _searchController,
              decoration: InputDecoration(
                labelText: 'Search',
                labelStyle: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.bold,
                ),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(20),
                borderSide: const BorderSide(width: 3, color: Colors.black)),
                filled: true,
                fillColor: Colors.grey,
                prefixIcon: const Icon(Icons.search, color: Colors.white, size: 30),
                contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10)

              ),
              style: const TextStyle(color: Colors.white),
            ),
            const SizedBox(height: 32.0),
            ElevatedButton(
            onPressed: () {
            _handleSearch(context);
            },
            style: ElevatedButton.styleFrom(
            backgroundColor: Colors.white,
            foregroundColor: Colors.black,
            padding: const EdgeInsets.symmetric(horizontal: 100),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            ),
            child: const Text('Search'),
            )]))
        ]
      )
    );
  }
}