import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import 'bottomNavBar.dart';
import 'gradient.dart';
import 'dart:convert';

class LoginScreen extends StatelessWidget {
    final TextEditingController _loginController = TextEditingController();
    final TextEditingController _passwordController = TextEditingController();

    LoginScreen({super.key});

    String _validateTextField(String value) {
      if (value.isEmpty) {
        return 'ERROR';
      }
      return '';
    }

    void _handleLogin(BuildContext context) async {
        String login = _loginController.text;
        String password = _passwordController.text;

        String passwordError = _validateTextField(password);
        String loginError = _validateTextField(login);

        if (loginError != '' ||
            passwordError != '') {

          Fluttertoast.showToast(msg: "Please fill in all fields.",
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.TOP,
              backgroundColor: Colors.white,
              textColor: Colors.black,
              fontSize: 16.0);

          return;
        }

        final data = {
            'login': login,
            'password': password,
        };

        final jsonData = jsonEncode(data);
        final headers = <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        };

        final response = await http.post(
          Uri.parse('https://www.toptier.games/Users/api/login'),
            headers: headers,
            body: jsonData,
        );

        if (response.statusCode == 200) {
            Map<String, dynamic> jsonResponse = jsonDecode(response.body);
            _navigateToNextScreen(context, jsonResponse);
            Fluttertoast.showToast(
              msg: "Login successful",
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.TOP,
              backgroundColor: Colors.green, // You can customize the background color
              textColor: Colors.white,
              fontSize: 16.0,
            );
        }
        else if (response.statusCode == 403) {
          Fluttertoast.showToast(
            msg: "No user exists with that username.",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.TOP,
            backgroundColor: Colors.green, // You can customize the background color
            textColor: Colors.white,
            fontSize: 16.0,
          );
        }
        else if (response.statusCode == 401) {
          Fluttertoast.showToast(
            msg: "Incorrect password.",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.TOP,
            backgroundColor: Colors.green, // You can customize the background color
            textColor: Colors.white,
            fontSize: 16.0,
          );
        }
        else {
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
            ClipPath(
              clipper: GradientClipper(),
              child: Container(
                decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.white, Colors.transparent],
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                    )
                ),
              ),
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
              width: 400,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20.0),
                color: Colors.black.withOpacity(0.5),
              ),
              child: TextField(
                controller: _loginController,
                decoration: InputDecoration(
                  labelText: 'Username',
                  labelStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold,
                  ),
                  enabledBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: Colors.green),
                      borderRadius: BorderRadius.circular(20.0)),
                  focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: Colors.green),
                      borderRadius: BorderRadius.circular(20.0)), //
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
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: 'Password',
                  labelStyle: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold,
                  ),
                  enabledBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: Colors.green),
                      borderRadius: BorderRadius.circular(20.0)),
                  focusedBorder: OutlineInputBorder(
                      borderSide: const BorderSide(color: Colors.green),
                      borderRadius: BorderRadius.circular(20.0)), // Remove the default border
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

    Future _navigateToNextScreen(BuildContext context, Map<String, dynamic> jsonResponse) async{

        Navigator.push(context,MaterialPageRoute(builder: (context) => HomePage(jsonResponse: jsonResponse)));

    }

}