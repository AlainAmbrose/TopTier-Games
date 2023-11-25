import 'package:flutter/material.dart';

class TopTierAppBar {
  static AppBar returnAppBar(BuildContext context, Map<String, dynamic> userInfo) {
    return AppBar(
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
              child: PopupMenuButton<String>(
                onSelected: (value) {
                  if (value == 'logout') {
                    Navigator.of(context).pop();
                    Navigator.of(context).pop();
                  }
                },
                itemBuilder: (BuildContext context) {
                  return [
                    const PopupMenuItem<String>(
                      value: 'logout',
                      child: Text('Logout'),
                    )
                  ];
                },
                child: Text("${userInfo["firstname"]} ${userInfo["lastname"]}",
                    style: const TextStyle(fontSize: 18)),
              )
          )]
    );
  }
}