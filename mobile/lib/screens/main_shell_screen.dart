import 'package:flutter/material.dart';

import 'events_screen.dart';
import 'home_screen.dart';
import 'profile_screen.dart';

class MainShellScreen extends StatefulWidget {
  const MainShellScreen({super.key});

  @override
  State<MainShellScreen> createState() => _MainShellScreenState();
}

class _MainShellScreenState extends State<MainShellScreen> {
  int _currentIndex = 0;

  static const _tabs = <_MainTab>[
    _MainTab(
      title: 'Accueil',
      icon: Icons.dashboard_outlined,
      selectedIcon: Icons.dashboard,
      child: HomeScreen(),
    ),
    _MainTab(
      title: 'Events',
      icon: Icons.schedule_outlined,
      selectedIcon: Icons.schedule,
      child: EventsScreen(),
    ),
    _MainTab(
      title: 'Profil',
      icon: Icons.person_outline,
      selectedIcon: Icons.person,
      child: ProfileScreen(),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final currentTab = _tabs[_currentIndex];

    return Scaffold(
      appBar: AppBar(title: Text(currentTab.title)),
      body: SafeArea(
        child: IndexedStack(
          index: _currentIndex,
          children: _tabs.map((tab) => tab.child).toList(),
        ),
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() => _currentIndex = index);
        },
        destinations: _tabs
            .map(
              (tab) => NavigationDestination(
                icon: Icon(tab.icon),
                selectedIcon: Icon(tab.selectedIcon),
                label: tab.title,
              ),
            )
            .toList(),
      ),
    );
  }
}

class _MainTab {
  const _MainTab({
    required this.title,
    required this.icon,
    required this.selectedIcon,
    required this.child,
  });

  final String title;
  final IconData icon;
  final IconData selectedIcon;
  final Widget child;
}
