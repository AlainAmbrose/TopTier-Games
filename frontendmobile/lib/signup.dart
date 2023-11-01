import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SignupScreen extends StatelessWidget {
    final TextEditingController _loginController = TextEditingController();
    final TextEditingController _passwordController = TextEditingController();
    final TextEditingController _emailController = TextEditingController();
    final TextEditingController _firstnameController = TextEditingController();
    final TextEditingController _lastnameController = TextEditingController();

  SignupScreen({super.key});

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
        
        final response = await http.post(Uri.parse('https://poosd-large-project-group-8-1502fa002270.herokuapp.com/Users/api/signup'),
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
            title: const Text('Sign Up'),
        ),
        body: Padding(
            padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            TextField(
              controller: _emailController,
              decoration: const InputDecoration(
                labelText: 'Email',
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
            TextField(
              controller: _loginController,
              decoration: const InputDecoration(
                labelText: 'Login',
              ),
            ),
            const SizedBox(height: 16.0),
            TextField(
              controller: _firstnameController,
              decoration: const InputDecoration(
                labelText: 'First Name',
              ),
            ),
            const SizedBox(height: 16.0),
            TextField(
              controller: _lastnameController,
              decoration: const InputDecoration(
                labelText: 'Last Name',
              ),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton(
                onPressed: _handleSignup,
                child: const Text('Sign Up'),
            ),
            ] 
            ) 
            ),
        );
    }
}