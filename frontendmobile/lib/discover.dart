import 'dart:math';
import 'package:lazy_load_scrollview/lazy_load_scrollview.dart';
import 'package:flutter/material.dart';
import 'appbar.dart';
import 'package:http/http.dart' as http;
import 'genres.dart';
import 'dart:convert';

class DiscoverPage extends StatefulWidget {
  Map<String, dynamic> jsonResponse;
  DiscoverPage({Key? key, required this.jsonResponse}) : super(key: key);

  @override
  State<DiscoverPage> createState() => _DiscoverPageState();
}

class _DiscoverPageState extends State<DiscoverPage> {
  Map<int, List<Map<String, dynamic>>> genreResults = {};
  late Map<String, dynamic> data = <String,dynamic>{};
  late ScrollController controller;
  List<Map<String, dynamic>> results = [];
  List<List<int>> cardData = [];
  List<int> genreData = [];
  int genreLength = 0;

  static const int increment = 10;
  static const int genreIncrement = 7;
  bool isLoading = false;
  bool _mounted = true;


  @override
  void initState() {
    _loadMoreGenres();
    super.initState();
    controller = ScrollController();
    controller.addListener(_scrollListener);
  }

  @override
  void dispose() {
    _mounted = false;
    controller.removeListener(_scrollListener);
    controller.dispose();
    super.dispose();
  }

  void _scrollListener() {
    if ((controller.position.pixels == controller.position.maxScrollExtent) && genreLength <= 21) {
      _loadMoreGenres();
    }
    else {
      controller.position.didEndScroll();
    }

  }

  Future _loadMoreCards(int genre) async {
    Map<String, dynamic> jsonSendData = <String,dynamic>{};

    if (genre == 0) {
      jsonSendData = {
        'topGamesFlag': true,
        'size': 6,
        'limit': 10,
      };
    }
    else
    {
      jsonSendData = {
        'size': 6,
        'limit': 10,
        'genre': genres[genre - 1].id,
      };
    }
    final jsonData = jsonEncode(jsonSendData);

    final headers = <String, String>{
      'Content-Type': 'application/json',
      'authorization': '${widget.jsonResponse['accessToken']}',
      'Cookie': 'jwt_access=${widget.jsonResponse['accessToken']}',
    };

    var response = await http.post(
      Uri.parse('https://www.toptier.games/Games/api/populatehomepage'),
      headers: headers,
      body: jsonData,
    );

    if (response.statusCode == 200) {
      data = Map<String, Object>.from(json.decode(response.body));
      // Use the genre as a key to store results in the map
      genreResults[genre] = List<Map<String, dynamic>>.from((data['result'] as Iterable?) ?? []);
    } else {
      print("error");
      print(response.statusCode);
    }

    setState(() {
      if (cardData.length <= genre || cardData[genre] == null) {
        cardData.add([]);
      }
      // Clear the existing cards for the genre
      cardData[genre].clear();

      // Add more cards to the specific genre
      cardData[genre].addAll(List.generate(
        // Use the minimum of increment and the number of items received
        // from the API to avoid the range error
        min(increment, genreResults[genre]?.length ?? 0),
            (index) => cardData[genre].length + index,
      ));
      isLoading = false;
    });
  }


  Future _loadMoreGenres() async {
    setState(() {
      isLoading = true;
    });

    if (genreLength <= 20){
      for (var i = genreLength; i < genreLength + genreIncrement && i < 21; i++) {
        genreData.add(i);
        cardData.add([]);
        await _loadMoreCards(i);
      }

    }

    setState(() {
      isLoading = false;
      genreLength = genreData.length;
    });

  }

  Widget _buildCardsList(int item) {
    if (item >= genreData.length) {
      return const SizedBox.shrink();
    }

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
              item == 0 ? 'Top Games' : genres[item - 1].title,
              style: const TextStyle(
                color: Colors.white,
                fontFamily: 'Inter-Regular',
                fontStyle: FontStyle.italic,
                fontWeight: FontWeight.w400,
                fontSize: 30,
              ),
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
                      Colors.purple,
                    ],
                    stops: [0.0, 0.1, 0.9, 1.0],
                  ).createShader(rect);
                },
                blendMode: BlendMode.dstOut,
                child: LazyLoadScrollView(
                  isLoading: isLoading,
                  scrollDirection: Axis.horizontal,
                  onEndOfPage: () => _loadMoreCards(item),
                  child: ListView.builder(
                    itemCount: cardData[item].length,
                    scrollDirection: Axis.horizontal,
                    itemBuilder: (BuildContext context, int index) {
                      return _buildGameCard(item, cardData[item][index]);
                    },
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGameCard(int genre, int index) {
    // Retrieve the result for the specific genre
    var game = genreResults[genre]?[index];
    if (game == null) {
      return Container(); // Return an empty container if game is null
    }

    var imageUrl = game['url'] ?? '';

    return GestureDetector(
      onTap: () => {print("tapped card")},
      child: Card(
        elevation: 0.0,
        margin: const EdgeInsets.all(10.0),
        color: Colors.transparent,
        child: SizedBox(
          width: 115.0,
          height: 200.0,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.max,
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(4.0),
                child: Image.network(
                  'https:$imageUrl',
                  height: 150.0,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              Container(
                padding: const EdgeInsets.all(6.0),
                alignment: Alignment.bottomLeft,
                child: Text(
                  game['name'] ?? 'N/A',
                  overflow: TextOverflow.fade,
                  softWrap: false,
                  style: const TextStyle(
                    color: Colors.white,
                    fontFamily: 'Inter-Light',
                    fontWeight: FontWeight.w300,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }


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
        child: SingleChildScrollView(
          controller: controller,
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
                itemCount: 21,
                shrinkWrap: true,
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.all(10.0),
                itemBuilder: (BuildContext context, int index) {
                  if (index == genreData.length)  {
                    _loadMoreGenres();
                    return const SizedBox.shrink();
                  }
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
