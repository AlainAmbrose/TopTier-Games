import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class LoginScreen extends StatelessWidget {
    TextEditingController _loginController = TextEditingController();
    TextEditingController _passwordController = TextEditingController();

    void _handleLogin() async {
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

        final response = await http.post(Uri.parse('http://localhost:5001/Users/api/login'),
            headers: headers,
            body: jsonData,
        );

        if (response.statusCode == 200) {
            print('Login successful');
        } else {
            print(response.statusCode);
        }
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
        appBar: AppBar(
            title: Text('Login'),
        ),
        body: Padding(
            padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
                SizedBox(height: 16.0),
                TextField(
                controller: _loginController,
                decoration: InputDecoration(
                    labelText: 'Login',
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
                ElevatedButton(
                onPressed: _handleLogin,
                child: Text('Login'),
                ),
                ] 
            ) 
            ),
        );
    }
}