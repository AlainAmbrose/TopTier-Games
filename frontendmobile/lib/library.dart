import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LibraryPage extends StatefulWidget {
  Map<String, dynamic> jsonResponse;

  LibraryPage({Key? key, required this.jsonResponse}) : super(key: key);

  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage> {
  late List<Map<String, dynamic>> userGamesList = [];
  Iterable<Map<String, dynamic>> filteredGames = [];

  @override
  void initState() {
    super.initState();
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
      Uri.parse(' https://www.toptier.games/Games/api/getcover'),
      headers: headers,
      body: jsonData,
    );

    return 'https:${json.decode(response.body)['url']}';
  }

  Future<List<Map<String, dynamic>>> _loadUserList(int tabNumber) async {
    // ... existing code
    Map<String, dynamic> jsonSendData = <String, dynamic>{};

    jsonSendData = {
      'id': widget.jsonResponse['id'],
    };

    final jsonData = jsonEncode(jsonSendData);

    final headers = <String, String>{
      'Content-Type': 'application/json',
      'authorization': '${widget.jsonResponse['accessToken']}',
      'Cookie': 'jwt_access=${widget.jsonResponse['accessToken']}',
    };

    var response = await http.post(
      Uri.parse('https://www.toptier.games/Progress/api/getusergame'),
      headers: headers,
      body: jsonData,
    );

    if (response.statusCode == 200) {
      var data = Map<String, Object>.from(json.decode(response.body));
      userGamesList = List<Map<String, dynamic>>.from(
          ((data['result']) as Iterable?) ?? []);
      filteredGames = userGamesList
          .where((userGame) => userGame['result']['status'] == tabNumber);
      return filteredGames.toList();
    } else {
      throw Exception("Unable to Load Games :(");
    }
  }

  Widget _buildTabContent(int tabNumber) {
    return FutureBuilder<List<Map<String, dynamic>>>(
      future: _loadUserList(tabNumber),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircularProgressIndicator(); // Add loading indicator
        } else if (snapshot.hasError) {
          return Text("Error: ${snapshot.error}");
        } else {
          // Ensure filteredGames is initialized before calling toList()
          List<Map<String, dynamic>> userGamesList = snapshot.data ?? [];
          filteredGames = userGamesList
              .where((userGame) => userGame['result']['status'] == tabNumber);
          if (filteredGames.isEmpty) {
            return ListView(
              children: const [
                SizedBox(
                  height: 180,
                  child: Card(
                    color: Colors.transparent,
                    child: ListTile(
                      title: Center(
                        child:  Text(
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
          }
          return SizedBox(
            height: 180,
            child: ListView.builder(
              itemCount: userGamesList.length,
              itemBuilder: (BuildContext context, int index) {
                var game = userGamesList[index];
                return ListTile(
                  key: ValueKey<String>(game['GameId']),
                  leading: ClipRRect(
                    borderRadius: BorderRadius.circular(4.0),
                    child: Image.network(
                      getCoverInfo(game['GameId']) as String,
                      height: 150.0,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                );
              },
            ),
          );
        }
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      initialIndex: 1,
      length: 3,
      child: Scaffold(
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
                  ))
            ]),
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
                        text: "All",
                      ),
                      Tab(
                        text: "Played",
                      ),
                      Tab(
                        text: "Want to Play",
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
