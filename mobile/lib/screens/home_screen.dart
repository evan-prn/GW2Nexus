import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../config/app_theme.dart';
import '../models/event_model.dart';
import '../services/auth_service.dart';
import '../services/event_schedule_service.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer2<AuthService, EventScheduleService>(
      builder: (context, authService, eventService, _) {
        final user = authService.user;
        final nextStates = eventService.states.take(3).toList();

        return ListView(
          padding: const EdgeInsets.all(24),
          children: [
            Text(
              'Tableau de bord',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 6),
            Text(
              user == null
                  ? 'Bienvenue sur GW2 Nexus mobile.'
                  : 'Bienvenue, ${user.nom}.',
              style: Theme.of(context).textTheme.bodySmall,
            ),
            const SizedBox(height: 20),
            _EventSummary(eventService: eventService),
            const SizedBox(height: 16),
            Text(
              'Prochains départs',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 10),
            if (eventService.isLoading && eventService.states.isEmpty)
              const Center(child: CircularProgressIndicator())
            else if (eventService.errorMessage != null &&
                eventService.states.isEmpty)
              _InfoCard(text: eventService.errorMessage!)
            else
              ...nextStates.map((state) => _NextEventTile(state: state)),
            const SizedBox(height: 16),
            const _InfoCard(
              text:
                  'Une seule notification locale est envoyée pour le prochain event, 5 minutes avant son départ.',
            ),
          ],
        );
      },
    );
  }
}

class _EventSummary extends StatelessWidget {
  const _EventSummary({required this.eventService});

  final EventScheduleService eventService;

  @override
  Widget build(BuildContext context) {
    final active = eventService.states
        .where((state) => state.status == EventStatus.active)
        .length;
    final upcoming = eventService.states
        .where((state) => state.status == EventStatus.upcoming)
        .length;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Expanded(
              child: _Metric(
                label: 'En cours',
                value: '$active',
                color: AppColors.success,
              ),
            ),
            Expanded(
              child: _Metric(
                label: 'Dans 15 min',
                value: '$upcoming',
                color: AppColors.warning,
              ),
            ),
            Expanded(
              child: _Metric(
                label: 'Events',
                value: '${eventService.states.length}',
                color: AppColors.gold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NextEventTile extends StatelessWidget {
  const _NextEventTile({required this.state});

  final EventState state;

  @override
  Widget build(BuildContext context) {
    final color = switch (state.status) {
      EventStatus.active => AppColors.success,
      EventStatus.upcoming => AppColors.warning,
      EventStatus.idle => AppColors.textSecondary,
    };

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Card(
        child: ListTile(
          title: Text(state.entry.event.name),
          subtitle:
              Text('${state.entry.group.label} - ${state.entry.zone.name}'),
          trailing: Text(
            _label(),
            style: TextStyle(color: color, fontWeight: FontWeight.w700),
          ),
        ),
      ),
    );
  }

  String _label() {
    if (state.status == EventStatus.active) {
      return 'Actif';
    }
    final minutes = (state.secondsUntilStart / 60).ceil();
    return '$minutes min';
  }
}

class _Metric extends StatelessWidget {
  const _Metric({
    required this.label,
    required this.value,
    required this.color,
  });

  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style:
              Theme.of(context).textTheme.headlineSmall?.copyWith(color: color),
        ),
        Text(label, style: Theme.of(context).textTheme.bodySmall),
      ],
    );
  }
}

class _InfoCard extends StatelessWidget {
  const _InfoCard({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Text(text),
      ),
    );
  }
}
