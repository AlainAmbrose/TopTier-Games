import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import 'gradient.dart';
import 'dart:convert';

class ForgotPassScreen extends StatelessWidget {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _authorizationController = TextEditingController();

  ForgotPassScreen({super.key});

  void _handleForgotPassEmail(BuildContext context) async {
    String email = _emailController.text;

    if (email.isEmpty) {
      Fluttertoast.showToast(msg: "Please enter an email.",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          backgroundColor: Colors.white,
          textColor: Colors.black,
          fontSize: 16.0
      );
      return;
    }

      final data = {
        'email': email,
        'passwordResetFlag': true
      };

      final jsonData = jsonEncode(data);
      final headers = <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
      };

      final response = await http.post(
        Uri.parse('https://www.toptier.games/Users/api/sendAuthEmail'),
        headers: headers,
        body: jsonData,
      );

      if (response.statusCode == 200) {
        Fluttertoast.showToast(
          msg: "Code sent",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.TOP,
          backgroundColor: Colors.green,
          textColor: Colors.white,
          fontSize: 16.0,
        );
      }
      else if (response.statusCode == 400) {
        Fluttertoast.showToast(
          msg: "No account with that email address found.",
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

  void _handleForgotPassAuth(BuildContext context) async {
    String authorization = _authorizationController.text;
    String email = _emailController.text;

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

      Navigator.push(context,MaterialPageRoute(builder: (context) => ResetPassScreen(email: email)));
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
                                controller: _emailController,
                                decoration: InputDecoration(
                                  labelText: 'Email',
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
                                      borderRadius: BorderRadius.circular(20.0)), //
                                ),
                                style: const TextStyle(color: Colors.white, fontFamily: 'Inter-Regular'),
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
                                _handleForgotPassEmail(context);
                              },
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: Colors.black,
                                padding: const EdgeInsets.symmetric(horizontal: 85),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                              ),
                              child: const Text('Send Code', style: TextStyle(
                                  fontFamily: 'Inter-Bold'
                              )),
                            ),
                            const SizedBox(height: 16.0),
                            ElevatedButton(
                              onPressed: () {
                                _handleForgotPassAuth(context);
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
}

class ResetPassScreen extends StatelessWidget {
  final TextEditingController _newPasswordController = TextEditingController();
  final TextEditingController _confirmPasswordController = TextEditingController();

  final String email;
  ResetPassScreen({Key? key, required this.email}) : super(key: key);

  void _handleResetPass(BuildContext context) async {
    if (_newPasswordController.text.isEmpty) {
      Fluttertoast.showToast(
        msg: "Please enter a password.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    } else if (_newPasswordController.text != _confirmPasswordController.text) {
      Fluttertoast.showToast(
        msg: "Passwords do not match.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }

    final data = {
      'password': _newPasswordController.text,
      'emailFlag': true,
      'verifyEmail': email
    };

    final jsonData = jsonEncode(data);
    final headers = <String, String>{
      'Content-Type': 'application/json',
    };

    final response = await http.post(
      Uri.parse('https://www.toptier.games/Users/api/updateuser'),
      headers: headers,
      body: jsonData,
    );

    if (response.statusCode == 200) {
      Fluttertoast.showToast(
        msg: "Password changed.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );

      Navigator.pop(context);
      Navigator.pop(context);
    } else {
      Fluttertoast.showToast(
        msg: "Error: ${response.statusCode}",
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
                              'Please enter the new Password',
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
                                controller: _newPasswordController,
                                decoration: InputDecoration(
                                  labelText: 'New Password',
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
                                      borderRadius: BorderRadius.circular(20.0)), //
                                ),
                                obscureText: true,
                                style: const TextStyle(color: Colors.white, fontFamily: 'Inter-Regular'),
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
                                controller: _confirmPasswordController,
                                decoration: InputDecoration(
                                  labelText: 'Confirm Password',
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
                                      borderRadius: BorderRadius.circular(20.0)), //
                                ),
                                obscureText: true,
                                style: const TextStyle(color: Colors.white, fontFamily: 'Inter-Regular'),
                              ),
                            ),
                            const SizedBox(height: 16.0),
                            ElevatedButton(
                              onPressed: () {
                                _handleResetPass(context);
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
}