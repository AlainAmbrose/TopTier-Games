import 'package:lazy_load_scrollview/lazy_load_scrollview.dart';
import 'package:flutter/material.dart';
//import 'package:http/http.dart' as http;

class DiscoverPage extends StatefulWidget {
  const DiscoverPage({super.key});
  @override
  State<DiscoverPage> createState() => _DiscoverPageState();
}

class _DiscoverPageState extends State<DiscoverPage> {
  List<List<int>> cardData = [];
  List<int> genreData = [];
  int cardLength = 0;
  int genreLength = 0;

  final int increment = 10;
  bool isLoading = false;

  @override
  void initState() {
    _loadMoreGenres();
    super.initState();
  }

  Future _loadMoreCards(int genre) async {
    setState(() {
      isLoading = true;
    });

    // dummy delay
    await Future.delayed(const Duration(seconds: 4));
    for (var i = cardLength; i <= cardLength + increment; i++) {
      cardData[genre].add(i);
    }
    setState(() {
      isLoading = false;
      cardLength = cardData[genre].length;
    });
  }

  Future _loadMoreGenres() async {
    setState(() {
      isLoading = true;
    });

    // dummy delay
    await Future.delayed(const Duration(seconds: 2));
    for (var i = genreLength; i <= genreLength + increment; i++) {
      genreData.add(i);
      cardData.add([]);
    }
    setState(() {
      isLoading = false;
      genreLength = genreData.length;
    });
  }

  Widget _buildCardsList(int item) {
    return Column(
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
              //begin: Alignment.center,
              end: Alignment.centerRight,
              colors: [Colors.transparent, Colors.transparent, Colors.transparent, Colors.purple],
              stops: [0.0, 0.1, 0.9, 1.0], // 10% purple, 80% transparent, 10% purple
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
                  itemBuilder: (BuildContext context, int index) =>  Card(
                    elevation: 2,
                    margin:  const EdgeInsets.all(10.0),
                    child: SizedBox(
                    width: 125.0,
                    child: Text(
                    'Dummy Card Text $index'
                    )
                  ),
                  ),
            ),
          ),
        ),
        ),
        ),
      ],
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
              LazyLoadScrollView(
                  isLoading: isLoading,
                  onEndOfPage: () => _loadMoreGenres(),
                  child: ListView.builder(
                    itemCount: genreData.length,
                    shrinkWrap: true,
                    physics: const ClampingScrollPhysics(),
                    padding: const EdgeInsets.all(10.0),
                    itemBuilder: (BuildContext context, int index) {
                      return _buildCardsList(index);
                    },
                  ))
            ],
          ),
        ),
      ),
    );
  }
}
