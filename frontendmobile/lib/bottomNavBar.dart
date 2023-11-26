
import 'package:flutter/material.dart';
import 'library.dart';
import 'search.dart';
import 'discover.dart';

class HomePage extends StatefulWidget {
  final Map<String, dynamic> jsonResponse;
  const HomePage({Key? key, required this.jsonResponse}) : super(key: key);

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: bottomNavBarItems(_selectedIndex, widget.jsonResponse),
      extendBody: true,
      bottomNavigationBar: BottomNavigationBar(
        elevation: 0,
        backgroundColor: const Color(0x00000000).withOpacity(0.5),

        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Library',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.search),
            label: 'Search',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.emoji_objects_outlined),
            label: 'Discover',
          ),
        ],
        selectedIconTheme: const IconThemeData(
            color: Colors.white,
            ),
        selectedItemColor: Colors.white,
        unselectedItemColor: Colors.grey,
        unselectedIconTheme: const IconThemeData(
            color: Colors.grey,
            fill: 0.60,
            size: 20),
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }

  bottomNavBarItems(int selectedIndex, Map<String, dynamic> jsonResponse) {
    if (selectedIndex==0) {
      return LibraryPage(jsonResponse: jsonResponse);
    } else if (selectedIndex==1) {
      return SearchPage(jsonResponse: jsonResponse);
    } else if (selectedIndex==2) {
      return DiscoverPage(jsonResponse: jsonResponse);
    }
  }

}