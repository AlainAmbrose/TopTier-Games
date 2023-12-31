import 'dart:convert';
import 'package:frontendmobile/main.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:zxcvbn/zxcvbn.dart';

class TopTierAppBar {
  static bool showAccountSettings = false;

  static void _handleLogout(BuildContext context, Map<String, dynamic> userInfo) async {
    final String refreshToken = userInfo['refreshToken'];

    final headers = <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Cookie': 'jwt_refresh=$refreshToken'
    };

    final response = await http.get(
      Uri.parse('https://www.toptier.games/Users/api/logout'),
      headers: headers,
    );

    if (response.statusCode == 200) {
      Fluttertoast.showToast(
        msg: "Logged out.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );

      Navigator.pushReplacement(context,
          MaterialPageRoute(builder: (context) => LoginSignupScreen()));
    }
    else {
      Fluttertoast.showToast(
        msg: "Error in logout: ${response.statusCode}",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
  }

  static AppBar returnAppBar(BuildContext context, Map<String, dynamic> userInfo) {
    return AppBar(
        automaticallyImplyLeading: false,
        title: const Text(
          'TopTier',
          style: TextStyle(
              fontFamily: 'Inter-Bold',
              fontWeight: FontWeight.w800,
              fontStyle: FontStyle.italic,
              fontSize: 25),
        ),
        backgroundColor: Colors.black,
        actions: [
          Padding(
              padding: const EdgeInsets.fromLTRB(16.0, 16.0, 16.0, 8.0),
              child: PopupMenuButton<String>(
                onSelected: (value) {
                  if(value == 'account_settings') {
                    showAccountSettings = true;
                    showDialog(
                      context: context,
                      builder: (BuildContext context) {
                        return AccountSettingsPopUp(userInfo: userInfo);
                      }
                    );
                  } else if (value == 'logout') {
                    _handleLogout(context, userInfo);
                  }
                },
                color: Colors.grey[800]!.withOpacity(0.95),
                itemBuilder: (BuildContext context) {
                  return [
                    const PopupMenuItem<String>(
                      value: 'account_settings',
                      child: Text('Account Settings',
                          style: TextStyle(color: Colors.white)),
                    ),
                    const PopupMenuItem<String>(
                      value: 'logout',
                      child: Text('Logout',
                          style: TextStyle(color: Colors.white)),
                    ),
                  ];
                },
                child: Text("${userInfo["firstname"]} ${userInfo["lastname"]}",
                    style: const TextStyle(fontSize: 18)),
              ),
          ),
        ]
    );
  }
}

class AccountSettingsPopUp extends StatelessWidget {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController passwordConfirmController = TextEditingController();
  final Map<String, dynamic> userInfo;
  final zxcvbn = Zxcvbn();

  // final Function(Map<String, dynamic> updatedUserInfo) updateUserInfoCallback;

  AccountSettingsPopUp({Key? key, required this.userInfo,})
      : super(key: key);

  void _handleAccountUpdate() async {
    Map<String, dynamic> data = {};

    if (usernameController.text.isNotEmpty) {
      data['login'] = usernameController.text;
    }
    if (firstNameController.text.isNotEmpty) {
      data['firstname'] = firstNameController.text;
    }
    if (lastNameController.text.isNotEmpty) {
      data['lastname'] = lastNameController.text;
    }
    if (emailController.text.isNotEmpty) {
      data['email'] = emailController.text;
    }
    if (passwordController.text.isNotEmpty) {
      data['password'] = passwordController.text;
    }

    data['userId'] = userInfo['id'];

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
        msg: "Account changes saved.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green, // You can customize the background color
        textColor: Colors.white,
        fontSize: 16.0,
      );

      // userInfo['firstname'] = data['firstname'];
      // userInfo['lastname'] = data['lastname'];
      // updateUserInfoCallback(userInfo);
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

  static void _handleDeleteAccount(BuildContext context, Map<String, dynamic> userInfo) async {
    final data = {
      'userId': userInfo['id'],
    };

    final jsonData = jsonEncode(data);
    final headers = <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
      'Cookie': 'jwt_access=${userInfo['accessToken']}',
    };

    final response = await http.post(
      Uri.parse('https://www.toptier.games/Users/api/deleteUser'),
      headers: headers,
      body: jsonData,
    );

    if (response.statusCode == 200) {
      Fluttertoast.showToast(
        msg: "Account successfully deleted.",
        toastLength: Toast.LENGTH_SHORT,
        gravity: ToastGravity.TOP,
        backgroundColor: Colors.green,
        textColor: Colors.white,
        fontSize: 16.0,
      );
    }
    else {
      Fluttertoast.showToast(
        msg: "Error in deleting account: ${response.statusCode}",
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
    return AlertDialog(
      backgroundColor: Colors.grey[800]!.withOpacity(0.95),
      title: const Text('Account Settings', style: TextStyle(color: Colors.white)),
      content: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          TextButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    backgroundColor: Colors.grey[800]!.withOpacity(0.95),
                    title: const Text('Change Username', style: TextStyle(color: Colors.white)),
                    content: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        TextField(
                          controller: usernameController,
                          decoration: const InputDecoration(
                            labelText: 'New Username',
                            labelStyle: TextStyle(color: Colors.white),
                            enabledBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                            focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          style: const TextStyle(color: Colors.white),
                        ),
                      ],
                    ),
                    actions: [
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                        child: const Text('Close'),
                      ),
                      TextButton(
                        onPressed: () {
                          _handleAccountUpdate();
                          Navigator.of(context).pop();
                        },
                        child: const Text('Save Changes'),
                      ),
                    ],
                  );
                },
              );
            },
            child: const Text('Change Username'),
          ),
          TextButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    backgroundColor: Colors.grey[800]!.withOpacity(0.95),
                    title: const Text('Change Name', style: TextStyle(color: Colors.white)),
                    content: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        TextField(
                          controller: firstNameController,
                          decoration: const InputDecoration(
                            labelText: 'New First Name',
                            labelStyle: TextStyle(color: Colors.white),
                            enabledBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                            focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          style: const TextStyle(color: Colors.white),
                        ),
                        TextField(
                          controller: lastNameController,
                          decoration: const InputDecoration(
                            labelText: 'New Last Name',
                            labelStyle: TextStyle(color: Colors.white),
                            enabledBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                            focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          style: const TextStyle(color: Colors.white),
                        ),
                      ],
                    ),
                    actions: [
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                        child: const Text('Close'),
                      ),
                      TextButton(
                        onPressed: () {
                          _handleAccountUpdate();
                          Navigator.of(context).pop();
                        },
                        child: const Text('Save Changes'),
                      ),
                    ],
                  );
                },
              );
            },
            child: const Text('Change Name'),
          ),
          TextButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    backgroundColor: Colors.grey[800]!.withOpacity(0.95),
                    title: const Text('Change Email', style: TextStyle(color: Colors.white)),
                    content: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        TextField(
                          controller: emailController,
                          decoration: const InputDecoration(
                            labelText: 'New Email',
                            labelStyle: TextStyle(color: Colors.white),
                            enabledBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                            focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          style: const TextStyle(color: Colors.white),
                        ),
                      ],
                    ),
                    actions: [
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                        child: const Text('Close'),
                      ),
                      TextButton(
                        onPressed: () {
                          _handleAccountUpdate();
                          Navigator.of(context).pop();
                        },
                        child: const Text('Save Changes'),
                      ),
                    ],
                  );
                },
              );
            },
            child: const Text('Change Email'),
          ),
          TextButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    backgroundColor: Colors.grey[800]!.withOpacity(0.95),
                    title: const Text('Change Password', style: TextStyle(color: Colors.white)),
                    content: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        TextField(
                          controller: passwordController,
                          decoration: const InputDecoration(
                            labelText: 'New Password',
                            labelStyle: TextStyle(color: Colors.white),
                            enabledBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                            focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          style: const TextStyle(color: Colors.white),
                          obscureText: true,
                        ),
                        TextField(
                          controller: passwordConfirmController,
                          decoration: const InputDecoration(
                            labelText: 'Confirm Password',
                            labelStyle: TextStyle(color: Colors.white),
                            enabledBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                            focusedBorder: UnderlineInputBorder(
                              borderSide: BorderSide(color: Colors.white),
                            ),
                          ),
                          style: const TextStyle(color: Colors.white),
                          obscureText: true,
                        ),
                      ],
                    ),
                    actions: [
                      TextButton(
                        onPressed: () {
                          Navigator.of(context).pop();
                        },
                        child: const Text('Close'),
                      ),
                      TextButton(
                        onPressed: () {
                          if (passwordController.text != passwordConfirmController.text) {
                            Fluttertoast.showToast(
                              msg: "Passwords do not match.",
                              toastLength: Toast.LENGTH_SHORT,
                              gravity: ToastGravity.TOP,
                              backgroundColor: Colors.green, // You can customize the background color
                              textColor: Colors.white,
                              fontSize: 16.0,
                            );
                            return;
                          } else {
                            final result = zxcvbn.evaluate(passwordController.text);
                            if (result.score! < 2) {
                              final feedback = result.feedback.suggestions![0];

                              Fluttertoast.showToast(msg: "Password too weak: $feedback",
                                  toastLength: Toast.LENGTH_SHORT,
                                  gravity: ToastGravity.TOP,
                                  backgroundColor: Colors.green,
                                  textColor: Colors.white,
                                  fontSize: 16.0);
                              return;
                            }

                            _handleAccountUpdate();
                            Navigator.of(context).pop();
                          }
                        },
                        child: const Text('Save Changes'),
                      ),
                    ],
                  );
                },
              );
            },
            child: const Text('Change Password'),
          ),
          const SizedBox(height: 20.0),
          TextButton(
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    backgroundColor: Colors.grey[800]!.withOpacity(0.95),
                    title: const Text('Delete Account', style: TextStyle(color: Colors.white)),
                    content: const Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text('You are about to delete your TopTier account. Are you sure you wish to continue?',
                          style: TextStyle(color: Colors.white),
                          textAlign: TextAlign.center,
                        ),
                      ],
                    ),
                    actions: [
                      TextButton(
                        onPressed: () {
                          _handleDeleteAccount(context, userInfo);
                          Navigator.pushReplacement(context,
                              MaterialPageRoute(builder: (context) => LoginSignupScreen()));
                        },
                        child: const Text('Confirm'),
                      ),
                    ],
                  );
                  },
              );
              },
              child: const Text('Delete Account')
          ),
        ],
      ),
      actions: [
        TextButton(
          onPressed: () {
            Navigator.of(context).pop();
          },
          child: const Text('Close'),
        ),
      ],
    );
  }
}