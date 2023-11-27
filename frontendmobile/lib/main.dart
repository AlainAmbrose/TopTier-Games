import 'package:flutter/material.dart';
import 'login.dart';
import 'signup.dart';
import 'gradient.dart';


void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: LoginSignupScreen(),
    );
  }
}

class LoginSignupScreen extends StatefulWidget {
  const LoginSignupScreen({super.key});

  @override
  _LoginSignupScreenState createState() => _LoginSignupScreenState();
}

class _LoginSignupScreenState extends State<LoginSignupScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
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
            const SizedBox(height: 96.0),
            ElevatedButton(
              onPressed: () {
                // Navigate to the Login screen
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => LoginScreen(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(horizontal: 100),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: const Text('Sign In'),
            ),
            const SizedBox(height: 16.0),
            ElevatedButton(
              onPressed: () {
                // Navigate to the Login screen
                Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (context) => SignupScreen(),
                  ),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: Colors.black,
                padding: const EdgeInsets.symmetric(horizontal: 100),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              ),
              child: const Text('Sign Up'),
            ),
            const SizedBox(height: 16.0),
          ],
        ),
        ],
      ),
    ),
    );
  }
}
