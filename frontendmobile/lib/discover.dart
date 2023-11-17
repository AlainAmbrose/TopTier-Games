import 'package:flutter/material.dart';
//import 'package:http/http.dart' as http;

class DiscoverPage extends StatefulWidget {
  const DiscoverPage({super.key});
  @override
  _DiscoverPageState createState() => _DiscoverPageState();
}

class _DiscoverPageState extends State<DiscoverPage> {
  late ScrollController controller;
  List<String> items = List.generate(10, (index) => 'Hello $index');

  @override

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
              child: ListView.builder(
              //physics: const ClampingScrollPhysics(),
              shrinkWrap: true,
              scrollDirection: Axis.horizontal,
              itemCount: 8 ,
              itemBuilder: (BuildContext context, int index) => const Card(
                elevation: 2,
                margin:  EdgeInsets.all(10.0),
                child: SizedBox(
                    width: 125.0,
                    child: Text(
                        'Dummy Card Text'
                    )
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
              ListView.builder(
                itemCount: 7,
                shrinkWrap: true,
                physics: const ClampingScrollPhysics(),
                padding: const EdgeInsets.all(10.0),
                itemBuilder: (BuildContext context, int index) {
                  return _buildCardsList(index);
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
