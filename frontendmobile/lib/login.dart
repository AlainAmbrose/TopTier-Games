import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:fluttertoast/fluttertoast.dart';
import 'dart:convert';

class LoginScreen extends StatelessWidget {
    final TextEditingController _loginController = TextEditingController();
    final TextEditingController _passwordController = TextEditingController();

  LoginScreen({super.key});

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

        final response = await http.post(Uri.parse('https://poosd-large-project-group-8-1502fa002270.herokuapp.com/Users/api/login'),
            headers: headers,
            body: jsonData,
        );

        if (response.statusCode == 200) {
            Fluttertoast.showToast(
              msg: "Login successful",
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.BOTTOM,
              backgroundColor: Colors.green, // You can customize the background color
              textColor: Colors.white,
              fontSize: 16.0,
            );
        } else {
            Fluttertoast.showToast(
              msg: response.statusCode.toString(),
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.BOTTOM,
              backgroundColor: Colors.green, // You can customize the background color
              textColor: Colors.white,
              fontSize: 16.0,
            );
        }
    }

    @override
    Widget build(BuildContext context) {
        return Scaffold(
        appBar: AppBar(
            title: const Text('Login'),
        ),
        body: Padding(
            padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
                const SizedBox(height: 16.0),
                TextField(
                controller: _loginController,
                decoration: const InputDecoration(
                    labelText: 'Login',
                ),
                ),
                const SizedBox(height: 16.0),
                TextField(
                controller: _passwordController,
                decoration: const InputDecoration(
                    labelText: 'Password',
                ),
                obscureText: true,
                ),
                const SizedBox(height: 16.0),
                ElevatedButton(
                onPressed: _handleLogin,
                child: const Text('Login'),
                ),
                ] 
            ) 
            ),
        );
    }
}