import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'appbar.dart';

class LibraryPage extends StatefulWidget {
  Map<String, dynamic> jsonResponse;

  LibraryPage({Key? key, required this.jsonResponse}) : super(key: key);

  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  List<Map<String, dynamic>>? userGamesList;
  List<Map<String, dynamic>>? filteredGames;
  bool _mounted = true;

  @override
  void initState() {
    _loadUserList(0);
    super.initState();
  }

  @override
  void dispose() {
    _mounted = false;
    super.dispose();
  }

  Future<String> getCoverInfo(String gameId) async {
    var data = {
      'id': gameId,
    };

    final jsonData = jsonEncode(data);

    final headers = <String, String>{
      'Content-Type': 'application/json',
      'authorization': '${widget.jsonResponse['accessToken']}',
      'Cookie': 'jwt_access=${widget.jsonResponse['accessToken']}',
    };

    var response = await http.post(
      Uri.parse('https://www.toptier.games/Games/api/getcover'),
      headers: headers,
      body: jsonData,
    );

    return 'https:${json.decode(response.body)['url']}';
  }

  void _loadUserList(int tabNumber) async {
    Map<String, dynamic> jsonSendData = <String, dynamic>{};

    jsonSendData = {
      'userId': '${widget.jsonResponse['id']}',
    };

    final jsonData = jsonEncode(jsonSendData);

    final headers = <String, String>{
      'Content-Type': 'application/json',
      'authorization': '${widget.jsonResponse['accessToken']}',
      'Cookie': 'jwt_access=${widget.jsonResponse['accessToken']}',
    };

    try {
      var response = await http.post(
        Uri.parse('https://www.toptier.games/Progress/api/getusergame'),
        headers: headers,
        body: jsonData,
      );

      if (mounted) {
        // Check if the widget is still in the tree before calling setState
        if (response.statusCode == 200) {
          var data = jsonDecode(response.body);
          setState(() {
            userGamesList =
                (data['games'] as List<dynamic>).cast<Map<String, dynamic>>();
            filteredGames = userGamesList
                ?.where((userGame) => userGame['Status'] == tabNumber)
                .toList();
            print("filteredGames: ${filteredGames}");
            print(filteredGames);
          });
        } else {
          print('Error: ${response.statusCode}');
        }
      }
    } catch (e) {
      // Handle exceptions
      print('Error: $e');
    }
  }

  Widget _buildTabContent(int tabNumber) {
    if (userGamesList == null) {
      return const Center(child: CircularProgressIndicator());
    }
    if (filteredGames!.isEmpty || filteredGames == null) {
      return ListView(
        children: const [
          SizedBox(
            height: 180,
            child: Card(
              color: Colors.transparent,
              child: ListTile(
                title: Center(
                  child: Text(
                    'No games in your library',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'Inter-Bold',
                        fontStyle: FontStyle.italic,
                        fontSize: 22),
                  ),
                ),
              ),
            ),
          ),
        ],
      );
    } else {
      return ListView.builder(
          itemCount: filteredGames?.length,
          itemBuilder: (BuildContext context, int index) {
            print('filteredGames length: ${filteredGames?.length}');
            print('Current index: $index');
            return SizedBox(
              height:200,
              child: Row(
                  children: <Widget>[
                    Container(
                      padding: const EdgeInsets.all(13.0),
                      height: 170.0,
                      width: 130,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(4.0),
                        child: Image.network(
                          'https:${filteredGames?[index]['url']}',
                          height: 170.0,
                          width: 115,
                          fit: BoxFit.fill,
                        ),
                      ),
                    ),

                  ],
              ),
            );
          });
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      initialIndex: 0,
      length: 3,
      child: Scaffold(
        extendBodyBehindAppBar: false,
        appBar: TopTierAppBar.returnAppBar(context, widget.jsonResponse),
        body: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Colors.black, Color.fromARGB(255, 141, 141, 141)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Container(
                margin: const EdgeInsets.all(10.0),
                child: const Text(
                  'Your Library:',
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

                    unselectedLabelColor:
                        const Color.fromARGB(255, 229, 229, 229),
                    labelColor: const Color.fromARGB(255, 229, 229, 229),
                    indicatorPadding: const EdgeInsets.all(2.0),
                    labelStyle: const TextStyle(
                        fontFamily: 'Inter-Regular',
                        fontStyle: FontStyle.italic,
                        fontSize: 18),

                    indicator: BoxDecoration(
                        color: const Color.fromARGB(255, 59, 59, 59),
                        borderRadius: BorderRadius.circular(50)),
                    //Change background color from here
                    tabs: const <Widget>[
                      Tab(
                        text: "Not Started",
                      ),
                      Tab(
                        text: "Playing",
                      ),
                      Tab(
                        text: "Complete",
                      ),
                    ],
                  )),
              Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color.fromARGB(255, 105, 105, 105), Colors.black],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
              Flexible(
                child: TabBarView(
                  children: [
                    _buildTabContent(0),
                    _buildTabContent(1),
                    _buildTabContent(2),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
