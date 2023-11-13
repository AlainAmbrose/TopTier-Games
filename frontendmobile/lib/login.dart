import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import 'homePage.dart';
import 'dart:convert';

class LoginScreen extends StatelessWidget {
    final TextEditingController _loginController = TextEditingController();
    final TextEditingController _passwordController = TextEditingController();
    bool loginResult = false;

  LoginScreen({super.key});

    void _handleLogin(BuildContext context) async {
        String login = _loginController.text;
        String password = _passwordController.text;
        final data = {
            'login': login,
            'password': password,
        };

        final jsonData = jsonEncode(data);
        final headers = <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        };

        final response = await http.post(Uri.parse('https://poosd-large-project-group-8-1502fa002270.herokuapp.com/Users/api/login'),
            headers: headers,
            body: jsonData,
        );

        if (response.statusCode == 200) {
            loginResult = true;
            _navigateToNextScreen(context);
            Fluttertoast.showToast(
              msg: "Login successful",
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.TOP,
              backgroundColor: Colors.green, // You can customize the background color
              textColor: Colors.white,
              fontSize: 16.0,
            );
        } else {
            //print(response.statusCode);
            //print(loginResult);
            loginResult = false;
            Fluttertoast.showToast(
              msg: response.statusCode.toString(),
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.TOP,
              backgroundColor: Colors.green, // You can customize the background color
              textColor: Colors.white,
              fontSize: 16.0,
            );
        }
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
        body: Stack(
            children: [
            Center(
          child: Stack(
          alignment: Alignment.center,
          children: [
          Container(
          decoration: const BoxDecoration(
          image: DecorationImage(
              image: AssetImage('assets/LandingPageBG.jpg'),
            fit: BoxFit.cover,
          ),
          ),
        ),
        Container(
        color: Colors.black.withOpacity(0.5),
        ),
          Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            RichText(
                text: const TextSpan(
                    text: 'TopTier',
                    style: TextStyle(
                        fontStyle: FontStyle.italic,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontSize: 72.0)
                )
            ),
            const SizedBox(height: 24.0),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8.0),
                color: Colors.black.withOpacity(0.5),
              ),
              child: TextField(
                controller: _loginController,
                decoration: const InputDecoration(
                  labelText: 'Username',
                  labelStyle: TextStyle(color: Colors.white, fontWeight: FontWeight.bold,
                  ),
                  enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.green)),
                  focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.green)), // Remove the default border
                ),
                style: const TextStyle(color: Colors.white),
              ),
            ),
            const SizedBox(height: 10.0),
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8.0),
                color: Colors.black.withOpacity(0.5),
              ),
              child: TextField(
                controller: _passwordController,
                decoration: const InputDecoration(
                  labelText: 'Password',
                  labelStyle: TextStyle(color: Colors.white, fontWeight: FontWeight.bold,
                  ),
                  enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.green)),
                  focusedBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.green)), // Remove the default border
                ),
                obscureText: true,
                style: const TextStyle(color: Colors.white),
              ),
            ),
                const SizedBox(height: 16.0),
                ElevatedButton(
                onPressed: () {
                  _handleLogin(context);
                },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(horizontal: 100),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                  ),
                child: const Text('Login'),
                ),
                ] 
            )
            ]),
            ),
              Positioned(
                top: 30,
                left: 10,
                child: IconButton(
                  icon: const Icon(Icons.arrow_back, color: Colors.white, size: 30),
                  onPressed: () {
                    // Navigate back to the previous screen
                    Navigator.pop(context);
                  },
                ),
              ),
            ]
        )
        );
    }

    Future _navigateToNextScreen(BuildContext context) async{

        Navigator.push(context,MaterialPageRoute(builder: (context) =>const HomePage()));

    }

}