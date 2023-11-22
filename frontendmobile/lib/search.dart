import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SearchPage extends StatefulWidget {
  final Map<String, dynamic> jsonResponse;
  const SearchPage({Key? key, required this.jsonResponse}) : super(key: key);

  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  final TextEditingController _searchController = TextEditingController();
  List<dynamic>? searchResults;

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
      'Content-Type': 'application/json',
      'Cookie': 'jwt_access=${widget.jsonResponse['accessToken']}'
    };

    final response = await http.post(
        Uri.parse('https://www.toptier.games/Games/api/searchgame'),
        headers: headers,
        body: jsonData,
    );

    if (response.statusCode == 200) {
      setState(() {
        searchResults = jsonDecode(response.body)['games'];
      });

    } else {
      Fluttertoast.showToast(
        msg: "Search failed: ${response.statusCode.toString()} error",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.white, // You can customize the background color
        textColor: Colors.black,
        fontSize: 16.0,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: false,
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
                  "${widget.jsonResponse["firstname"]} ${widget.jsonResponse["lastname"]}",
                  style: const TextStyle(fontSize: 18),
                )
            )]
          ),
          body: Stack(
            alignment: Alignment.topCenter,
            children: [
            Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.black, Color.fromARGB(255, 105, 105, 105)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            )),
            Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
            TextField(
              controller: _searchController,
              decoration: InputDecoration(
                labelText: 'Search',
                labelStyle: const TextStyle(
                  color: Colors.white, fontWeight: FontWeight.bold,
                ),
                suffixIcon: InkWell(
                  onTap: () {
                    _handleSearch(context);
                  },
                  child: Icon(Icons.circle, color: Colors.white, size: 30,)),
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(20),
                borderSide: const BorderSide(width: 3, color: Colors.black)),
                filled: true,
                fillColor: Colors.grey,
                prefixIcon: const Icon(Icons.search, color: Colors.white, size: 30),
                contentPadding: const EdgeInsets.symmetric(vertical: 10, horizontal: 10),
              ),
              style: const TextStyle(color: Colors.white),
            ),
              const SizedBox(height: 64.0),
              Expanded(
                child: searchResults == null
                    ? Container() // Show a loading indicator while waiting for results
                    : ListView.builder(
                  itemCount: searchResults!.length,
                  itemBuilder: (context, index) {
                    final game = searchResults![index];
                    return GestureDetector(
                      onTap: () {},
                      child: ListTile(
                        title: Text(game['Name']),
                      ),
                    );
                  },
                ),
              ),
            ]
      )]
    ));
  }
}