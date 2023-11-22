import 'package:lazy_load_scrollview/lazy_load_scrollview.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DiscoverPage extends StatefulWidget {
  Map<String, dynamic> jsonResponse;
  DiscoverPage({Key? key, required this.jsonResponse}) : super(key: key);

  @override
  State<DiscoverPage> createState() => _DiscoverPageState();
}

class _DiscoverPageState extends State<DiscoverPage> {
  late Map<String, dynamic> data = <String,dynamic>{};
  List<List<int>> cardData = [];
  List<int> genreData = [];
  int genreLength = 0;

  static const int increment = 10;
  bool isLoading = false;
  bool _mounted = true;


  @override
  void initState() {
    _loadMoreGenres();
    super.initState();
  }

  @override
  void dispose() {
    _mounted = false;
    super.dispose();
  }

  Future populateHomePage() async {}

  Future _loadMoreCards(int genre) async {
    var data = {
      'topGamesFlag': true,
      'size': 6,
      'limit': 10
    };

    final jsonData = jsonEncode(data);

    final headers = <String, String> {
      'Content-Type': 'application/json',
      'authorization' : '${widget.jsonResponse['accessToken']}',
      'Cookie' : 'jwt_access=${widget.jsonResponse['accessToken']}'
    };


    var response = await http.post(
      Uri.parse('https://www.toptier.games/Games/api/populatehomepage'),
      headers: headers,
      body: jsonData,
    );


    if (response.statusCode == 200) {
      data = json.decode(response.body);
      print("yay");
      //print(response.statusCode);
      print(data['result']);
      //print(response.body);
    } else {
      print("error");
      print(response.statusCode);
    }


    setState(() {
      // Add more cards to the specific genre
      cardData[genre].addAll(List.generate(
          increment + 1, (index) => cardData[genre].length + index));
      isLoading = false;
    });
  }

  Future _loadMoreGenres() async {
    setState(() {
      isLoading = true;
    });

    // dummy delay
    await Future.delayed(const Duration(seconds: 2));

    // Load more genres
    for (var i = genreLength; i <= genreLength + increment; i++) {
      genreData.add(i);
      cardData.add([]);
    }

    setState(() {
      isLoading = false;
      genreLength = genreData.length;
    });

    // Load more cards for each genre
    for (var genre in genreData) {
      await _loadMoreCards(genre);
    }
  }

  Widget _buildCardsList(int item) {
    return LazyLoadScrollView(
      isLoading: isLoading,
      scrollDirection: Axis.horizontal,
      onEndOfPage: () => _loadMoreCards(item),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Container(
            alignment: Alignment.topLeft,
            child: Text(
              '$item',
              style: const TextStyle(
                  color: Colors.white,
                  fontFamily: 'Inter-Regular',
                  fontStyle: FontStyle.italic,
                  fontWeight: FontWeight.w400,
                  fontSize: 30),
            ),
          ),
          SizedBox(
            height: 200.0,
            child: Container(
              color: Colors.transparent,
              child: ShaderMask(
                shaderCallback: (Rect rect) {
                  return const LinearGradient(
                    end: Alignment.centerRight,
                    colors: [
                      Colors.transparent,
                      Colors.transparent,
                      Colors.transparent,
                      Colors.purple
                    ],
                    stops: [0.0, 0.1, 0.9, 1.0],
                  ).createShader(rect);
                },
                blendMode: BlendMode.dstOut,
                child: ListView.builder(
                    itemCount: cardData[item].length,
                    scrollDirection: Axis.horizontal,
                    itemBuilder: (BuildContext context, int index) {
                      return
                          Card(
                            elevation: 3,
                            margin: const EdgeInsets.all(10.0),
                            child: Column(
                                crossAxisAlignment: CrossAxisAlignment.center,
                                mainAxisSize: MainAxisSize.max,
                                mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                  SizedBox(
                                  height: 130.0,
                                  width: 100.0,
                                  child: Text(
                                      'Dummy Card Text ${cardData[item][index]}'),
                                ),
                                Container(
                                  padding: const EdgeInsets.all(6.0),
                                  alignment: Alignment.bottomLeft,
                                  //child: Text('Dummy Card Text ${data['result'][index]}'),
                                ),
                              ]
                            ),
                          );
                    }),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
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
            )
          ]
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.black, Color.fromARGB(255, 141, 141, 141)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Container(
                alignment: Alignment.topLeft,
                child: const Text(
                  'Discover New Games:',
                  style: TextStyle(
                      color: Colors.white,
                      fontFamily: 'Inter-Bold',
                      fontStyle: FontStyle.italic,
                      fontWeight: FontWeight.w700,
                      fontSize: 30),
                ),
              ),
              ListView.builder(
                itemCount: genreData.length,
                shrinkWrap: true,
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.all(10.0),
                itemBuilder: (BuildContext context, int index) {
                  return _buildCardsList(index);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
