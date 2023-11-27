import 'dart:convert';
import 'bottomNavBar.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class Modal {
  Icon _setRatingStars(int index, String ratingStr) {
    IconData iconSymbol;
    double rating = double.parse(ratingStr);

    if (index < rating.floor() || (index == rating.floor() && rating % 1.0 > 0.7)) {
      iconSymbol = Icons.star;
    }
    else if (index == rating.floor() && rating % 1.0 > 0.4 && rating % 1.0 < 0.7) {
      iconSymbol = Icons.star_half_outlined;
    }
    else {
      iconSymbol = Icons.star_border;
    }
    return Icon(
        iconSymbol,
        color: Colors.amber,
    );
  }

  String _generatePlatformString(List platforms) {
    String platformStr = (platforms.length == 1) ? "Platform: " : "Platforms: ";

    if (platforms.isEmpty) {
      return "${platformStr}N/A\n";
    }

    for (int i = 0; i < platforms.length; i++) {
        platformStr += (i < platforms.length-1)
            ? '${platforms[i]}, '
            : '${platforms[i]}\n';
    }

    return platformStr;
  }

  String _generateGenreString(List genres) {
    String genreStr = (genres.length == 1) ? "Genre: " : "Genres: ";

    Map<int, String> genreMap = {
      2: 'Point-and-click',
      4: 'Fighting',
      5: 'Shooter',
      7: 'Music',
      8: 'Platform',
      9: 'Puzzle',
      10: 'Racing',
      11: 'Real Time Strategy (RTS)',
      12: 'Role-playing (RPG)',
      13: 'Simulator',
      14: 'Sport',
      15: 'Strategy',
      16: 'Turn-based strategy (TBS)',
      24: 'Tactical',
      25: 'Hack and slash/Beat \'em up',
      26: 'Quiz/Trivia',
      30: 'Pinball',
      31: 'Adventure',
      32: 'Indie',
      33: 'Arcade',
      34: 'Visual Novel',
      35: 'Card & Board Game',
      36: 'MOBA',
    };

    if (genres.isEmpty) {
      return "${genres}N/A\n";
    }

    for (int i = 0; i < genres.length; i++) {
      genreStr += ((i < genres.length-1)
          ? '${genreMap[genres[i]]!}, '
          : '${genreMap[genres[i]]}\n')!;
    }

    return genreStr;
  }

  String _formatDate(String releaseDate) {
    DateTime dt = DateTime.parse(releaseDate);

    return "${dt.month}/${dt.day}/${dt.year}\n";
  }

  String _setESRBRating(dynamic ageRating) {
    if (ageRating.runtimeType != List ||
        ageRating.length == 0 ||
        !ageRating[0].containsKey('rating')) {
      return "ESRB: N/A";
    }

    Map<int, String> esrbRating = {
      6: 'RP',
      7: 'EC',
      8: 'E',
      9: 'E10',
      10: 'T',
      11: 'M',
      12: 'AO',
    };

    return "ESRB: ${esrbRating[ageRating[0]['rating']]!}";
  }

  void _addToLibrary(BuildContext context,
                    Map<String, dynamic> game,
                    Map<String, dynamic> userInfo) async {
    String userId = userInfo['id'];
    String gameId = game['_id'];

    final addData = {
      'userId': userId,
      'gameId': gameId
    };

    final checkData = {
      'userId': userId
    };

    final jsonAddData = jsonEncode(addData);
    final jsonCheckData = jsonEncode(checkData);
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Cookie': 'jwt_access=${userInfo['accessToken']}'
    };

    final checkResponse = await http.post(
      Uri.parse('https://www.toptier.games/Progress/api/getusergame'),
      headers: headers,
      body: jsonCheckData,
    );

    if (checkResponse.statusCode == 200) {
      Map<String, dynamic> jsonResponse = jsonDecode(checkResponse.body);

      for (int i = 0; i < jsonResponse['games'].length; i++) {
        if (jsonResponse['games'][i]['GameId'] == gameId) {
          Fluttertoast.showToast(
            msg: "Game already in library!",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.TOP,
            backgroundColor: Colors.green,
            textColor: Colors.white,
            fontSize: 16.0,
          );
          return;
        }
      }

      final response = await http.post(
        Uri.parse('https://www.toptier.games/Progress/api/addusergame'),
        headers: headers,
        body: jsonAddData,
      );

      if (response.statusCode == 200) {
        Fluttertoast.showToast(
          msg: "Game added to library!",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0,
        );
      }
      else {
        Fluttertoast.showToast(
          msg: response.statusCode.toString(),
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0,
        );
      }
    }
    else {
      Fluttertoast.showToast(
        msg: checkResponse.statusCode.toString(),
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  Dialog returnModal(BuildContext context,
                    Map<String, dynamic> game,
                    String coverUrl,
                    Map<String, dynamic> userInfo) {
    return Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
        ),
        backgroundColor: Colors.transparent,
        child: SingleChildScrollView(
          child: Stack(
            children: [
              Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20.0),
                  color: Colors.grey[900]!.withOpacity(0.85),
                ),
                alignment: Alignment.center,
                padding: const EdgeInsets.all(20.0),
                width: MediaQuery.of(context).size.width,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.start,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Align(
                      alignment: Alignment.center,
                      child:
                        Text(game['name'],
                          style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontStyle: FontStyle.italic,
                              fontSize: 24.0
                          ),
                          textAlign: TextAlign.center,
                        ),
                    ),
                    Container(
                        margin: const EdgeInsets.symmetric(vertical: 8.0),
                        decoration: BoxDecoration(
                            color: Colors.grey,
                            borderRadius: BorderRadius.circular(15.0),
                            border: Border.all(width: 2.0, color: Colors.white),
                            image: DecorationImage(
                                image: NetworkImage("https:$coverUrl"),
                                fit: BoxFit.fill
                            )
                        ),
                      constraints: BoxConstraints.expand(
                        height: MediaQuery.of(context).size.width,
                      ),
                    ),
                    Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: List.generate(
                              5,
                                (index) => _setRatingStars(index, game['gameranking']['\$numberDecimal']),
                            ),
                          ),
                          const SizedBox(width: 10.0),
                          Text(
                            "${double.parse(game['gameranking']['\$numberDecimal']).toStringAsFixed(2)}   ${game['reviewcount']} Reviews",
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 15.0
                            ),
                          )
                        ]
                    ),
                    Text(_generatePlatformString(game['platforms']),
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 15.0
                          ),
                        textAlign: TextAlign.left,
                    ),
                    Text(_generateGenreString(game['genres']),
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 15.0
                          ),
                        textAlign: TextAlign.left,
                    ),
                    Text("Release Date: ${_formatDate(game['releasedate'])}",
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 15.0
                            ),
                          textAlign: TextAlign.left,
                    ),
                    Text(_setESRBRating(game['ageratings']),
                      style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15.0
                      ),
                      textAlign: TextAlign.left,
                    ),
                    const Text("\nDescription:",
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontStyle: FontStyle.italic,
                            fontSize: 18.0
                        ),
                        textAlign: TextAlign.left,
                    ),
                    Text((game['storyline'] != null)
                        ? "${game['storyline']}"
                        : "None",
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 15.0
                          ),
                        textAlign: TextAlign.left,
                    ),
                      Align(
                        alignment: Alignment.center,
                        child: ElevatedButton(
                            onPressed: () {
                              _addToLibrary(context, game, userInfo);
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.green,
                              foregroundColor: Colors.black,
                              padding: const EdgeInsets.symmetric(horizontal: 75),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                            ),
                            child: const Text('Add to Library', style: TextStyle(
                                color: Colors.white)
                            )
                        )
                      ),
                  ]
              )
          ),
          ])
        )
    );
  }
}

class DeleteModal{

  Future _deleteGame(Map<String, dynamic> game, Map<String, dynamic> userInfo, context) async{
    Map<String, dynamic> jsonSendData = <String, dynamic>{};

    jsonSendData = {
      'userId': '${game['UserId']}',
      'gameId' : game['GameId'],
    };

    final jsonData = jsonEncode(jsonSendData);

    final headers = <String, String>{
      'Content-Type': 'application/json',
      'authorization': '${userInfo['accessToken']}',
      'Cookie': 'jwt_access=${userInfo['accessToken']}',
    };

    var response = await http.post(
      Uri.parse('https://www.toptier.games/Progress/api/deleteusergame'),
      headers: headers,
      body: jsonData,
    );

    if (response.statusCode == 200){
      Navigator.push(context,MaterialPageRoute(builder: (context) => HomePage(jsonResponse: userInfo)));
      Fluttertoast.showToast(
        msg: "Game Removed from Library",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green, // You can customize the background color
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
    else {
      Fluttertoast.showToast(
        msg: "Error ${response.statusCode}",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green, // You can customize the background color
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }

  }
  Dialog returnModal(BuildContext context,
      Map<String, dynamic> game, Map<String, dynamic> userInfo) {
    return Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
        ),
        backgroundColor: Colors.transparent,
        child: Container(
          padding:const EdgeInsets.all(20.0),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20.0),
            color: Colors.grey[900]!.withOpacity(0.85),
          ),
          height: 400,
          child: Column(
            children: [
              const Padding(
                padding: EdgeInsets.all(8.0),
                child: Text('Are you sure you want to delete:',
                  textAlign: TextAlign.center,
                  style:  TextStyle(
                      color: Colors.white,
                      fontFamily: 'Inter-Light',
                      fontWeight: FontWeight.w300,
                      fontStyle: FontStyle.italic,
                      fontSize: 25
                  ),
                ),
              ),
              Text('${game['name']}',
                  textAlign: TextAlign.center,
                  overflow: TextOverflow.fade,
                  style:  const TextStyle(
                      color: Colors.white,
                      fontFamily: 'Inter-Bold',
                      fontWeight: FontWeight.w700,
                      fontStyle: FontStyle.italic,
                      fontSize: 16
                ),
              ),
              Align(
                alignment: Alignment.center,
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(5.0),
                  child: Image.network(
                    'https:${game['url']}',
                    height: 160.0,
                    width: 115,
                    fit: BoxFit.fill,
                  ),
                ),
              ),
              const Text('from your library?',
                style:  TextStyle(
                  color: Colors.white,
                  fontFamily: 'Inter-Light',
                  fontWeight: FontWeight.w300,
                  fontStyle: FontStyle.italic,
                  fontSize: 25
                ),
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Expanded(
                      //padding: const EdgeInsets.all(10.0),
                      child:Padding(
                        padding: const EdgeInsets.only(right: 6.0, top: 7.0),
                  child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pop();
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey,
                        foregroundColor: Colors.black,
                        padding: const EdgeInsets.all(5.0),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                      ),
                      child: const Text('No', style: TextStyle(
                        color: Colors.white,
                        fontFamily: 'Inter-Light',
                        fontWeight: FontWeight.w300,
                        fontStyle: FontStyle.italic,
                      )
                      )
                  )),
              ),
                 Expanded(
                   child: Padding(
                     padding: const EdgeInsets.only(left: 6.0, top: 7.0),
                     child:ElevatedButton(
                         onPressed: () async {
                           await _deleteGame(game, userInfo, context);
                         },
                         style: ElevatedButton.styleFrom(
                           backgroundColor: Colors.green,
                           foregroundColor: Colors.black,
                           padding: const EdgeInsets.all(5.0),
                           shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                         ),
                         child: const Text('Yes', style: TextStyle(
                           color: Colors.white,
                           fontFamily: 'Inter-Light',
                           fontWeight: FontWeight.w300,
                           fontStyle: FontStyle.italic,
                         )
                         )
                     ),
                   )

                 )
                ],
              )
            ],
          ),
        )
    );
  }
}

class LibraryModal {
  String _findComments(Map<String, dynamic> game) {
    if (game.runtimeType != List ||
        game.isEmpty ||
        !game.containsKey('Review')) {
      return "-";
    }

    return game['Review'];
  }

  String _findRating(Map<String, dynamic> game) {
    if (game.runtimeType != List ||
        game.isEmpty ||
        !game.containsKey('Ranking')) {
      return "-";
    }

    return game['Ranking'].toString();
  }
 String _getStatus(Map<String, dynamic> game){
   String status = '';

   switch (game['Status']) {
     case 0:
       status = 'Have Not Started';
       break;
     case 1:
       status = 'Currently Playing';
       break;
     case 2:
       status = 'Completed';
       break;
     default:
       status = '-';
   }

   return status;
  }

  Dialog returnModal(BuildContext context,
      Map<String, dynamic> game,
      String coverUrl,
      Map<String, dynamic> userInfo) {
    String status = _getStatus(game);
    String review = _findComments(game);
    String ranking = _findRating(game);
    return Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
        ),
        backgroundColor: Colors.transparent,
        child: SingleChildScrollView(
            child: Stack(
                children: [
                  Container(
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(20.0),
                        color: Colors.grey[900]!.withOpacity(0.85),
                      ),
                      alignment: Alignment.center,
                      padding: const EdgeInsets.all(20.0),
                      width: MediaQuery.of(context).size.width,
                      child: Column(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.start,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Align(
                              alignment: Alignment.center,
                              child:
                              Text(game['name'],
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontStyle: FontStyle.italic,
                                    fontSize: 24.0
                                ),
                                textAlign: TextAlign.center,
                              ),
                            ),
                            Container(
                              margin: const EdgeInsets.symmetric(vertical: 8.0),
                              decoration: BoxDecoration(
                                  color: Colors.grey,
                                  borderRadius: BorderRadius.circular(15.0),
                                  border: Border.all(width: 2.0, color: Colors.white),
                                  image: DecorationImage(
                                      image: NetworkImage("https:$coverUrl"),
                                      fit: BoxFit.fill
                                  )
                              ),
                              constraints: BoxConstraints.expand(
                                height: MediaQuery.of(context).size.width,
                              ),
                            ),
                            Text("Status: $status",
                                style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontStyle: FontStyle.italic,
                                    fontSize: 24.0
                                ),
                                textAlign: TextAlign.left),
                             Text("Your Rating: $ranking",
                                 style: const TextStyle(
                                     color: Colors.white,
                                     fontWeight: FontWeight.bold,
                                     fontStyle: FontStyle.italic,
                                     fontSize: 24.0
                                 ),
                              textAlign: TextAlign.left),

                            const Text("Your Comments: ",
                              style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontStyle: FontStyle.italic,
                                  fontSize: 24.0
                              ),
                            ),
                            Text(review,
                              style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontStyle: FontStyle.italic,
                                  fontSize: 15.0
                              ),),
                            const SizedBox(height:15.0),

                          ]
                      )
                  ),
                ])
        )
    );
  }
}

class EditModal {
  List<String> statusList = ['Not Started', 'Playing', 'Completed'];
  final TextEditingController _ratingController = TextEditingController();
  final TextEditingController _statusController = TextEditingController();
  final TextEditingController _reviewController = TextEditingController();


  Future _handleUpdate(String review, double rating, int status, Map<String, dynamic> game, Map<String, dynamic> userInfo, context) async {
     Map<String, dynamic> jsonSendDataRanking = <String, dynamic>{};
     Map<String, dynamic> jsonSendDataReview = <String, dynamic>{};
     Map<String, dynamic> jsonSendDataStatus = <String, dynamic>{};
     Map<String, dynamic> jsonSendDataHours = <String, dynamic>{};

      jsonSendDataRanking = {
        'userId': '${game['UserId']}',
        'gameId' : '${game['GameId']}',
        'ranking' : rating,
      };

     jsonSendDataReview = {
       'userId': '${game['UserId']}',
       'gameId' : '${game['GameId']}',
       'review' : review,
     };

     jsonSendDataStatus = {
       'userId': '${game['UserId']}',
       'gameId' : '${game['GameId']}',
       'status' : status,
     };



     final jsonDataRanking = jsonEncode(jsonSendDataRanking);
     final jsonDataReview = jsonEncode(jsonSendDataReview);
     final jsonDataStatus = jsonEncode(jsonSendDataStatus);
     final jsonDataHours = jsonEncode(jsonSendDataHours);


      final headers = <String, String>{
        'Content-Type': 'application/json',
        'authorization': '${userInfo['accessToken']}',
        'Cookie': 'jwt_access=${userInfo['accessToken']}',
      };

      var rankingResponse = await http.post(
        Uri.parse('https://www.toptier.games/Ranking/api/setranking'),
        headers: headers,
        body: jsonDataRanking,
      );

     var reviewResponse = await http.post(
       Uri.parse('https://www.toptier.games/Ranking/api/setreview'),
       headers: headers,
       body: jsonDataReview,
     );

     var statusResponse = await http.post(
       Uri.parse('https://www.toptier.games/Progress/api/setstatus'),
       headers: headers,
       body: jsonDataStatus,
     );
     if (rankingResponse.statusCode == 200 && reviewResponse.statusCode == 200 && statusResponse.statusCode == 200){
        Navigator.push(context,MaterialPageRoute(builder: (context) => HomePage(jsonResponse: userInfo)));
        Fluttertoast.showToast(
          msg: "Updated Game Info",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          backgroundColor: Colors.green, // You can customize the background color
          textColor: Colors.white,
          fontSize: 16.0,
        );
      }
      else {
        print(rankingResponse.statusCode);
        print(reviewResponse.statusCode);
        print(statusResponse.statusCode);

        Fluttertoast.showToast(
          msg: "Error",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          backgroundColor: Colors.green, // You can customize the background color
          textColor: Colors.white,
          fontSize: 16.0,
        );
      }
  }
  Dialog returnModal(BuildContext context,
      Map<String, dynamic> game,
      String coverUrl,
      Map<String, dynamic> userInfo) {
      String dropdownValue = statusList[game['Status']];
    return Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
        ),
        backgroundColor: Colors.transparent,
        child: Stack(
            children: [
              SingleChildScrollView(
                  child:
                    Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(20.0),
                          color: Colors.grey[900]!.withOpacity(0.85),
                        ),
                        alignment: Alignment.center,
                        padding: const EdgeInsets.all(20.0),
                        width: MediaQuery
                            .of(context)
                            .size
                            .width,
                        child: Column(
                            mainAxisSize: MainAxisSize.min,
                            mainAxisAlignment: MainAxisAlignment.start,
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Align(
                                alignment: Alignment.topLeft,
                                child:
                                Text(game['name'],
                                  style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontStyle: FontStyle.italic,
                                      fontSize: 24.0
                                  ),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                              Container(
                                height: 175.0,
                                width: 130,
                                alignment: Alignment.center,
                                margin: const EdgeInsets.symmetric(vertical: 8.0),
                                decoration: BoxDecoration(
                                  color: Colors.grey,
                                  borderRadius: BorderRadius.circular(15.0),
                                  border: Border.all(width: 2.0, color: Colors.white),
                                  image: DecorationImage(
                                    image: NetworkImage("https:$coverUrl"),
                                    fit: BoxFit.fill,
                                    alignment: Alignment.center, // Align the image to the center
                                  ),
                                ),
                              ),
                              const SizedBox(height: 10.0),
                              Container(
                                width: 400,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(20.0),
                                  color: Colors.black.withOpacity(0.5),
                                ),
                                child: TextField(
                                  controller: _statusController,
                                  decoration: InputDecoration(
                                    contentPadding: const EdgeInsets.all(16.0),
                                    labelText: 'Status',
                                    labelStyle: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontFamily: 'Inter-Bold'
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                        borderSide: const BorderSide(color: Colors.green),
                                        borderRadius: BorderRadius.circular(20.0)),
                                    focusedBorder: OutlineInputBorder(
                                        borderSide: const BorderSide(color: Colors.green),
                                        borderRadius: BorderRadius.circular(20.0)), // Remove the default border
                                  ),
                                  style: const TextStyle(color: Colors.white),
                                ),
                              ),
                              const Text(
                                '0: Havent Played; 1: Currently Playing; 2: Completed',
                                  style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontStyle: FontStyle.italic,
                                  fontSize: 13.0
                              ),
                              ),
                              const SizedBox(height: 10.0),
                              Container(
                                width: 400,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(20.0),
                                  color: Colors.black.withOpacity(0.5),
                                ),
                                child: TextField(
                                  controller: _ratingController,
                                  decoration: InputDecoration(
                                    contentPadding: const EdgeInsets.all(16.0),
                                    labelText: 'Rating',
                                    labelStyle: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontFamily: 'Inter-Bold'
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                        borderSide: const BorderSide(color: Colors.green),
                                        borderRadius: BorderRadius.circular(20.0)),
                                    focusedBorder: OutlineInputBorder(
                                        borderSide: const BorderSide(color: Colors.green),
                                        borderRadius: BorderRadius.circular(20.0)), // Remove the default border
                                  ),
                                  style: const TextStyle(color: Colors.white),
                                ),
                              ),
                              const SizedBox(height: 10.0),
                              Container(
                                width: 400,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(20.0),
                                  color: Colors.black.withOpacity(0.5),
                                ),
                                child: TextField(
                                  controller: _reviewController,
                                  decoration: InputDecoration(
                                    contentPadding: const EdgeInsets.all(16.0),
                                    labelText: 'Review',
                                    labelStyle: const TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                        fontFamily: 'Inter-Bold'
                                    ),
                                    enabledBorder: OutlineInputBorder(
                                        borderSide: const BorderSide(color: Colors.green),
                                        borderRadius: BorderRadius.circular(20.0)),
                                    focusedBorder: OutlineInputBorder(
                                        borderSide: const BorderSide(color: Colors.green),
                                        borderRadius: BorderRadius.circular(20.0)), // Remove the default border
                                  ),
                                  style: const TextStyle(color: Colors.white),
                                ),
                              ),
                              Align(
                                  alignment: Alignment.center,
                                  child: ElevatedButton(
                                      onPressed: () async {
                                         String reviewString = _reviewController.text;
                                         double? rating = double.tryParse(_ratingController.text);
                                         //int reviewString = _reviewController.text;
                                          await _handleUpdate(reviewString, rating!, 2, game, userInfo, context);
                                         Navigator.push(context,MaterialPageRoute(builder: (context) => HomePage(jsonResponse: userInfo)));
                                      },
                                      style: ElevatedButton.styleFrom(
                                        backgroundColor: Colors.green,
                                        foregroundColor: Colors.black,
                                        padding: const EdgeInsets.symmetric(horizontal: 75),
                                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                      ),
                                      child: const Text('Save changes', style: TextStyle(
                                          color: Colors.white)
                                      )
                                  )
                              ),

                      ]
                        ),
                    ),

                  ),

            ]
        )
    );
  }
}