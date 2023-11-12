import 'package:flutter/material.dart';
import 'library.dart';
import 'search.dart';
import 'discover.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() =>
      _HomePageState();
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
      body: bottomNavBarItems(_selectedIndex),
      extendBody: true,
      bottomNavigationBar: BottomNavigationBar(
        elevation: 0,
        backgroundColor: const Color(0x00ffffff),

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

  bottomNavBarItems(int selectedIndex) {
    if (selectedIndex==0) {
      return const LibraryPage();
    } else if (selectedIndex==1) {
      return const SearchPage();
    } else if (selectedIndex==2) {
      return const DiscoverPage();
    }
  }

}