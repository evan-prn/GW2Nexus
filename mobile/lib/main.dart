import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import 'config/app_theme.dart';
import 'screens/login_screen.dart';
import 'screens/main_shell_screen.dart';
import 'services/auth_service.dart';
import 'services/event_schedule_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthService()..initialize()),
        ChangeNotifierProvider(
          create: (_) => EventScheduleService()..initialize(),
        ),
      ],
      child: const GW2NexusApp(),
    ),
  );
}

class GW2NexusApp extends StatelessWidget {
  const GW2NexusApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GW2Nexus',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.dark(),
      routes: {
        '/login': (_) => const LoginScreen(),
        '/home': (_) => const MainShellScreen(),
      },
      home: const AuthGate(),
    );
  }
}

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthService>(
      builder: (context, authService, _) {
        if (authService.isInitializing) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        return authService.isAuthenticated
            ? const MainShellScreen()
            : const LoginScreen();
      },
    );
  }
}
