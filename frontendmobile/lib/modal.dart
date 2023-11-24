import 'package:flutter/material.dart';

class Modal {
  static String generatePlatformString(List platforms) {
    String platformStr = (platforms.length == 1) ? "Platform: " : "Platforms: ";

    for (int i = 0; i < platforms.length; i++) {
        platformStr += (i < platforms.length-1) ? platforms[i] + ', ' : platforms[i];
    }

    return platformStr;
  }

  static String formatDate(String releaseDate) {
    DateTime dt = DateTime.parse(releaseDate);

    return "${dt.month}/${dt.day}/${dt.year}";
  }

  static Dialog returnModal(BuildContext context, dynamic game) {
    return Dialog(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16.0),
        ),
        backgroundColor: Colors.transparent,
        child: SingleChildScrollView(
          child: Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(16.0),
                color: const Color(0xD0263A52),
              ),
              padding: const EdgeInsets.all(16.0),
              width: MediaQuery.of(context).size.width * 0.9,
              child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.end,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(game['Name'],
                        style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 18.0
                        )
                    ),
                    Text(generatePlatformString(game['Platforms']),
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 15.0
                        )
                    ),
                    Text("Release date: ${formatDate(game['ReleaseDate'])}",
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 15.0
                        )
                    ),
                    Text("Description: ${game['Summary']}",
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 15.0
                        )
                    ),
                  ]
              )
          )
      )
    );
  }
}