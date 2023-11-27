import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import 'bottomNavBar.dart';
import 'gradient.dart';
import 'dart:convert';
import 'emailverify.dart';

class SignupScreen extends StatelessWidget {
    final TextEditingController _loginController = TextEditingController();
    final TextEditingController _passwordController = TextEditingController();
    final TextEditingController _emailController = TextEditingController();
    final TextEditingController _firstnameController = TextEditingController();
    final TextEditingController _lastnameController = TextEditingController();

    SignupScreen({super.key});

    void _handleEmailVerify(BuildContext context) async {
      String email = _emailController.text;

      final data = {
        'email': email,
        'passwordResetFlag': false,
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
                    controller: _loginController,
                    decoration: InputDecoration(
                      labelText: 'Username',
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
                    style: const TextStyle(color: Colors.white),
                    obscureText: true,
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
                    controller: _firstnameController,
                    decoration: InputDecoration(
                      labelText: 'First Name',
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
                    controller: _lastnameController,
                    decoration: InputDecoration(
                      labelText: 'Last Name',
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
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              const SizedBox(height: 10.0),
              ElevatedButton(
                onPressed: () {
                  if (_emailController.text.isEmpty ||
                      _loginController.text.isEmpty ||
                      _firstnameController.text.isEmpty ||
                      _lastnameController.text.isEmpty ||
                      _passwordController.text.isEmpty) {
                    Fluttertoast.showToast(msg: "Please fill in all fields.",
                        toastLength: Toast.LENGTH_SHORT,
                        gravity: ToastGravity.TOP,
                        backgroundColor: Colors.white,
                        textColor: Colors.black,
                        fontSize: 16.0);
                    }
                  _handleEmailVerify(context);
                  Navigator.push(context,MaterialPageRoute(builder: (context) => EmailVerifyScreen(
                      email: _emailController.text,
                      password: _passwordController.text,
                      login: _loginController.text,
                      firstname: _firstnameController.text,
                      lastname: _lastnameController.text)
                    )
                  );
                  //_handleSignup(context);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.black,
                  padding: const EdgeInsets.symmetric(horizontal: 100),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                ),
                child: const Text('Sign Up', style: TextStyle(fontFamily: 'Inter-Bold')),
              ),
            ]
            )
            ]
            ) 
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