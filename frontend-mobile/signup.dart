import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SignupScreen extends StatelessWidget {
    TextEditingController _loginController = TextEditingController();
    TextEditingController _passwordController = TextEditingController();
    TextEditingController _emailController = TextEditingController();
    TextEditingController _firstnameController = TextEditingController();
    TextEditingController _lastnameController = TextEditingController();

    void _handleSignup() async {
        String email = _emailController.text;
        String password = _passwordController.text;
        String login = _loginController.text;
        String firstname = _firstnameController.text;
        String lastname = _lastnameController.text;

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
        
        final response = await http.post(Uri.parse('http://localhost:5001/Users/api/signup'),
        headers: headers,
        body: jsonData,
        );

        if (response.statusCode == 200) {
        print('Signup successful');
        } else {
        print(response.statusCode);
        }
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
        appBar: AppBar(
            title: Text('Sign Up'),
        ),
        body: Padding(
            padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            TextField(
              controller: _emailController,
              decoration: InputDecoration(
                labelText: 'Email',
              ),
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: _passwordController,
              decoration: InputDecoration(
                labelText: 'Password',
              ),
              obscureText: true,
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: _loginController,
              decoration: InputDecoration(
                labelText: 'Login',
              ),
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: _firstnameController,
              decoration: InputDecoration(
                labelText: 'First Name',
              ),
            ),
            SizedBox(height: 16.0),
            TextField(
              controller: _lastnameController,
              decoration: InputDecoration(
                labelText: 'Last Name',
              ),
            ),
            SizedBox(height: 16.0),
            ElevatedButton(
                onPressed: _handleSignup,
                child: Text('Sign Up'),
            ),
            ] 
            ) 
            ),
        );
    }
}