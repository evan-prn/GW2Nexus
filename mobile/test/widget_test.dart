import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';

import 'package:gw2nexus_mobile/screens/login_screen.dart';
import 'package:gw2nexus_mobile/services/auth_service.dart';

void main() {
  testWidgets('login screen shows remember me option', (tester) async {
    await tester.pumpWidget(
      ChangeNotifierProvider(
        create: (_) => AuthService(),
        child: const MaterialApp(home: LoginScreen()),
      ),
    );

    expect(find.text('Connexion'), findsOneWidget);
    expect(find.text('Se souvenir de moi'), findsOneWidget);
  });
}
