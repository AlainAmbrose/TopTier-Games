import 'package:lazy_load_scrollview/lazy_load_scrollview.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class DiscoverPage extends StatelessWidget {
  Map<String, dynamic> jsonResponse;
  DiscoverPage({Key? key, required this.jsonResponse}) : super(key: key);

  @override
  State<DiscoverPage> createState() => _DiscoverPageState();
}

class _DiscoverPageState extends State<DiscoverPage> {
  List<List<int>> cardData = [];
  List<int> genreData = [];
  int genreLength = 0;

  final int increment = 10;
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
    final data = {'topGamesFlag ': 1, 'size': 6, 'limit': 10};

    final jsonData = jsonEncode(data);
    final headers = <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'authorization': 'include'
    };

    final response = await http.post(
      Uri.parse(
          'https://poosd-large-project-group-8-1502fa002270.herokuapp.com/Games/api/populatehomepage'),
      headers: headers,
      body: jsonData,
    );

    if (response.statusCode == 200) {
      var jsonData = jsonDecode(response.body);
      return jsonData;
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
            height: 190.0,
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
                      return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.start,
                        children: <Widget>[
                          Card(
                            elevation: 2,
                            margin: const EdgeInsets.all(10.0),
                            child: SizedBox(
                              height: 140.0,
                              width: 110.0,
                              child: Text(
                                  'Dummy Card Text ${cardData[item][index]}'),
                            ),
                          ),
                          Text('Dummy Card Text ${cardData[item][index]}',
                            overflow: TextOverflow.clip,
                          )
                        ],
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
                  "${jsonResponse["firstname"]} ${jsonResponse["lastname"]}",
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
