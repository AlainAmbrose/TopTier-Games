import 'package:flutter/material.dart';
import 'package:frontendmobile/modal.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'appbar.dart';

class LibraryPage extends StatefulWidget {
  Map<String, dynamic> jsonResponse;

  LibraryPage({Key? key, required this.jsonResponse}) : super(key: key);

  @override
  State<LibraryPage> createState() => _LibraryPageState();
}

class _LibraryPageState extends State<LibraryPage>
    with TickerProviderStateMixin {
  List<Map<String, dynamic>>? userGamesList;
  List<Map<String, dynamic>>? filteredGames;
  late TabController _tabController;
  Map<String, dynamic> ? gameInfo;
  bool _mounted = true;

  @override
  void initState() {
    _loadUserList(0);
    _tabController = TabController(length: 3, initialIndex: 0, vsync: this);
    // Here is the addListener!
    _tabController.addListener(_handleTabSelection);
    super.initState();
  }

  void _handleTabSelection() {
    if (_tabController.indexIsChanging) {
      _loadUserList(_tabController.index);
    }
  }

  @override
  void dispose() {
    //_mounted = false;
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

  Future _getGameInfo(int gameId) async {
    // ... existing code
    var jsonSendData = {
      'gameId': gameId,
      'options': {
        '_id': true,
        'id': true,
        'name': true,
        'coverURL': true,
        'storyline': true,
        'releasedate': true,
        'genres': true,
        'gameranking': true,
        'images': true,
        'links': true,
        'platforms': true,
        'platformlogos': true,
        'videos': true,
        'ageratings': true,
        'similargames': true,
        'reviewcount': true
      }
    };

    final jsonData = jsonEncode(jsonSendData);

    final headers = <String, String>{
      'Content-Type': 'application/json',
      'authorization': '${widget.jsonResponse['accessToken']}',
      'Cookie': 'jwt_access=${widget.jsonResponse['accessToken']}',
    };

    var response = await http.post(
      Uri.parse('https://www.toptier.games/Games/api/getgameinfo'),
      headers: headers,
      body: jsonData,
    );

    if (response.statusCode == 200) {
      setState(() {
        var data = jsonDecode(response.body);
        print("data: $data");
        setState(() {
          gameInfo = data['gameInfo'];
        });
      });

    } else {
      print("Status Code");
      print(response.statusCode);
    }
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
                ?.where((userGamesList) => userGamesList['Status'] == tabNumber)
                .toList();
            print("$tabNumber");
            print("filteredGames: ${filteredGames}");

            //print(filteredGames);
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
                    'No games in this list',
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
            //print('filteredGames length: ${filteredGames?.length}');
            //print('Current index: $index');
            return SizedBox(
              height: 180,
              child: GestureDetector(
                onTap: () async {
                  await _getGameInfo(filteredGames?[index]['id']);
                  showDialog(
                    context: context,
                    builder: (BuildContext context) {
                      print(filteredGames?[index]['id']);
                      return LibraryModal().returnModal(context, gameInfo ?? {}, gameInfo?['url'], widget.jsonResponse);
                    },
                  );
                },
                child: Card(
                  color: Colors.transparent,
                  child: Row(
                    children: <Widget>[
                      Container(
                        padding: const EdgeInsets.only(
                            left: 12.0, bottom: 10.0, top: 10.0),
                        height: 175.0,
                        width: 130,
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4.0),
                          child: Image.network(
                            'https:${filteredGames?[index]['url']}',
                            height: 160.0,
                            width: 115,
                            fit: BoxFit.fill,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.only(
                                  left: 12.0, bottom: 25.0, top: 10.0),
                              alignment: Alignment.topLeft,
                              child: Text(
                                '${filteredGames?[index]['name']}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontFamily: 'Inter-Bold',
                                  fontStyle: FontStyle.italic,
                                  fontWeight: FontWeight.w600,
                                  fontSize: 26,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.only(
                                  left: 12.0, bottom: 10.0),
                              alignment: Alignment.topLeft,
                              child: Text(
                                'Hours Played: ${filteredGames?[index]['HoursPlayed']}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontFamily: 'Inter-Bold',
                                  fontStyle: FontStyle.italic,
                                  fontWeight: FontWeight.w400,
                                  fontSize: 15,
                                ),
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.only(
                                  left: 12.0, bottom: 10.0),
                              alignment: Alignment.topLeft,
                              child: Text(
                                'Your Rating: $index',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontFamily: 'Inter-Bold',
                                  fontStyle: FontStyle.italic,
                                  fontWeight: FontWeight.w400,
                                  fontSize: 15,
                                ),
                              ),
                            )
                          ],
                        ),
                      ),
                      Align(
                          alignment: Alignment.topRight,
                          child: PopupMenuButton<String>(
                            icon: const Icon(Icons.more_vert),
                            onSelected: (value) async {
                              if (value == 'Remove Game') {
                                showDialog(
                                    context: context,
                                    builder: (BuildContext context) {
                                      return DeleteModal().returnModal(
                                          context, filteredGames![index]);
                                    });
                              } else if (value == 'Edit Game') {
                                  await _getGameInfo(filteredGames![index]['id']);
                                  showDialog(
                                    context: context,
                                    builder: (BuildContext context) {
                                      print(filteredGames?[index]['id']);
                                      return LibraryModal().returnModal(context, gameInfo ?? {}, gameInfo?['url'], widget.jsonResponse);
                                    },
                                  );
                              };
                            },
                            color: Colors.grey[800]!.withOpacity(0.95),
                            itemBuilder: (BuildContext context) {
                              return [
                                const PopupMenuItem<String>(
                                  value: 'Edit Game',
                                  child: Text(
                                    'Edit Game',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontFamily: 'Inter-Light',
                                      fontWeight: FontWeight.w300,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                ),
                                const PopupMenuItem<String>(
                                  value: 'Remove Game',
                                  child: Text(
                                    'Remove Game',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontFamily: 'Inter-Light',
                                      fontWeight: FontWeight.w300,
                                      fontStyle: FontStyle.italic,
                                    ),
                                  ),
                                ),
                              ];
                            },
                          ))
                    ],
                  ),
                ),
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
                    controller: _tabController,
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
                        text: "Completed",
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
