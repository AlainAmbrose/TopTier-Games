import 'package:flutter/material.dart';
import 'package:frontendmobile/bottomNavBar.dart';
import 'package:frontendmobile/login.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import 'gradient.dart';
import 'dart:convert';

class EmailVerifyScreen extends StatelessWidget {
  final String email, password, login, firstname, lastname;
  final TextEditingController _authorizationController = TextEditingController();

  EmailVerifyScreen({Key? key, required this.email,
          required this.password,
          required this.login,
          required this.firstname,
          required this.lastname }) : super(key: key);

  void _handleAuth(BuildContext context) async {
    String authorization = _authorizationController.text;

    if (email.isEmpty || authorization.isEmpty) {
      Fluttertoast.showToast(
        msg: "Please enter the email or code.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
      return;
    }

    final codeData = {
      'authCode': authorization
    };
    final codeHeaders = <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Cookie': "authCode=$authorization"
    };

    final jsonCodeData = jsonEncode(codeData);

    final codeResponse = await http.post(
      Uri.parse('https://www.toptier.games/Users/api/verifyAuthCode'),
      headers: codeHeaders,
      body: jsonCodeData,
    );

    if (codeResponse.statusCode == 200) {
      Map<String, dynamic> jsonResponse = jsonDecode(codeResponse.body);
      Fluttertoast.showToast(
        msg: jsonResponse['message'],
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );

      _handleSignup(context);
    }
    else if (codeResponse.statusCode == 400) {
      Fluttertoast.showToast(
        msg: "Error: ${codeResponse.statusCode}",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  void _handleSignup(BuildContext context) async {
    final data = {
      'email': email,
      'password': password,
      'login': login,
      'firstname': firstname,
      'lastname': lastname,
    };

    final jsonData = jsonEncode(data);
    final headers = <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    };

    final response = await http.post(
      Uri.parse('https://www.toptier.games/Users/api/signup'),
      headers: headers,
      body: jsonData,
    );

    if (response.statusCode == 200) {
      Map<String, dynamic> jsonResponse = jsonDecode(response.body);
      _navigateToNextScreen(context, jsonResponse);

      Fluttertoast.showToast(
        msg: 'Account created!',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.blueGrey,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } else {
      Fluttertoast.showToast(
        msg: 'Signup Failed',
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.BOTTOM,
        backgroundColor: Colors.blueGrey,
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
                                    text: 'Reset Your Password',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold,
                                        fontFamily: 'Inter-Bold',
                                        color: Colors.white,
                                        fontSize: 32.0
                                    )
                                )
                            ),
                            const SizedBox(height: 24.0),
                            const Text(
                              'Please enter your email and we\'ll send you a verification code',
                              style: TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontFamily: 'Inter-Bold',
                                  color: Colors.white,
                                  fontSize: 20.0
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 32.0),
                            Container(
                              width: 400,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(20.0),
                                color: Colors.black.withOpacity(0.5),
                              ),
                              child: TextField(
                                controller: _authorizationController,
                                decoration: InputDecoration(
                                  labelText: 'Authorization Code',
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
                            const SizedBox(height: 16.0),
                            ElevatedButton(
                              onPressed: () {
                                _handleAuth(context);
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: Colors.black,
                                padding: const EdgeInsets.symmetric(horizontal: 100),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                              ),
                              child: const Text('Submit', style: TextStyle(
                                  fontFamily: 'Inter-Bold'
                              )),
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
    Navigator.push(context,MaterialPageRoute(builder: (context) => LoginScreen()));
  }
}
