import 'package:flutter/material.dart';

class Modal {
  String _generatePlatformString(List platforms) {
    String platformStr = (platforms.length == 1) ? "Platform: " : "Platforms: ";

    for (int i = 0; i < platforms.length; i++) {
        platformStr += (i < platforms.length-1) ? platforms[i] + ', ' : platforms[i];
    }

    return platformStr;
  }

  String _formatDate(String releaseDate) {
    DateTime dt = DateTime.parse(releaseDate);

    return "${dt.month}/${dt.day}/${dt.year}";
  }

  void _addToLibrary(BuildContext context) async {

  }

  Dialog returnModal(BuildContext context, Map<String, dynamic> game, Map<String, dynamic> cover) {
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
                  color: const Color(0xD0263238),
                ),
                padding: const EdgeInsets.all(20.0),
                width: MediaQuery.of(context).size.width * 0.9,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(game['Name'],
                          style: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontStyle: FontStyle.italic,
                              fontSize: 24.0
                          ),
                        textAlign: TextAlign.center,
                    ),
                    Container(
                        margin: const EdgeInsets.symmetric(vertical: 8.0),
                        decoration: BoxDecoration(
                            color: Colors.grey,
                            borderRadius: BorderRadius.circular(15.0),
                            border: Border.all(width: 2.0, color: Colors.white),
                            image: DecorationImage(
                                image: NetworkImage("https:${cover!["image"]}"),
                                fit: BoxFit.fill
                            )
                        ),
                      constraints: BoxConstraints.expand(
                        height: MediaQuery.of(context).size.width,
                      ),
                    ),
                    Text(_generatePlatformString(game['Platforms']),
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 15.0
                          ),
                        textAlign: TextAlign.center,
                    ),
                    Text("Release date: ${_formatDate(game['ReleaseDate'])}",
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 15.0
                            ),
                          textAlign: TextAlign.center,
                    ),
                    const Text("\nDescription:",
                        style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontStyle: FontStyle.italic,
                            fontSize: 18.0
                        ),
                        textAlign: TextAlign.center,
                    ),
                    Text((game['Summary'] != null)
                        ? "${game['Summary']}"
                        : "None",
                          style: const TextStyle(
                              color: Colors.white,
                              fontSize: 15.0
                          ),
                        textAlign: TextAlign.center,
                    ),
                      ElevatedButton(
                          onPressed: () {
                            _addToLibrary(context);
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
                  ]
              )
          ),

          ])
        )
    );
  }
}