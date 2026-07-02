import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../config/app_theme.dart';
import '../models/event_model.dart';
import '../services/event_schedule_service.dart';

class EventsScreen extends StatefulWidget {
  const EventsScreen({super.key});

  @override
  State<EventsScreen> createState() => _EventsScreenState();
}

class _EventsScreenState extends State<EventsScreen> {
  String _filter = 'all';

  @override
  Widget build(BuildContext context) {
    return Consumer<EventScheduleService>(
      builder: (context, eventService, _) {
        if (eventService.isLoading && eventService.states.isEmpty) {
          return const Center(child: CircularProgressIndicator());
        }

        if (eventService.errorMessage != null && eventService.states.isEmpty) {
          return _ErrorState(
            message: eventService.errorMessage!,
            onRetry: eventService.refresh,
          );
        }

        final states = _filteredStates(eventService.states);

        return RefreshIndicator(
          onRefresh: eventService.refresh,
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Text(
                'Événements',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 6),
              Text(
                'World bosses et méta-events synchronisés sur l’heure serveur UTC.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(height: 16),
              _Filters(
                activeFilter: _filter,
                onChanged: (value) => setState(() => _filter = value),
              ),
              const SizedBox(height: 16),
              ...states.map((state) => _EventCard(state: state)),
            ],
          ),
        );
      },
    );
  }

  List<EventState> _filteredStates(List<EventState> states) {
    return switch (_filter) {
      'world_boss' =>
        states.where((state) => state.entry.event.isWorldBoss).toList(),
      'upcoming' =>
        states.where((state) => state.status == EventStatus.upcoming).toList(),
      'active' =>
        states.where((state) => state.status == EventStatus.active).toList(),
      _ => states,
    };
  }
}

class _Filters extends StatelessWidget {
  const _Filters({
    required this.activeFilter,
    required this.onChanged,
  });

  final String activeFilter;
  final ValueChanged<String> onChanged;

  @override
  Widget build(BuildContext context) {
    const filters = <String, String>{
      'all': 'Tous',
      'world_boss': 'World Bosses',
      'upcoming': 'Bientôt',
      'active': 'En cours',
    };

    return Wrap(
      spacing: 8,
      runSpacing: 8,
      children: filters.entries.map((entry) {
        final selected = activeFilter == entry.key;
        return ChoiceChip(
          label: Text(entry.value),
          selected: selected,
          onSelected: (_) => onChanged(entry.key),
          selectedColor: AppColors.gold.withValues(alpha: 0.18),
          side: BorderSide(
            color: selected
                ? AppColors.gold.withValues(alpha: 0.55)
                : AppColors.gold.withValues(alpha: 0.18),
          ),
        );
      }).toList(),
    );
  }
}

class _EventCard extends StatelessWidget {
  const _EventCard({required this.state});

  final EventState state;

  @override
  Widget build(BuildContext context) {
    final event = state.entry.event;
    final zone = state.entry.zone;
    final statusColor = _statusColor(state.status);

    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 4,
                height: 64,
                decoration: BoxDecoration(
                  color: _parseColor(zone.color),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            event.name,
                            style: Theme.of(context).textTheme.titleMedium,
                          ),
                        ),
                        _StatusBadge(status: state.status, color: statusColor),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      '${state.entry.group.label} - ${zone.name}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 10),
                    if (state.status == EventStatus.active)
                      LinearProgressIndicator(
                        value: state.progressPercent / 100,
                        color: AppColors.success,
                        backgroundColor: Colors.white.withValues(alpha: 0.08),
                      ),
                    const SizedBox(height: 8),
                    Text(
                      _timeLabel(state),
                      style: TextStyle(color: statusColor),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _timeLabel(EventState state) {
    if (state.status == EventStatus.active) {
      return '${_formatCountdown(state.secondsRemaining)} restants';
    }

    final start = TimeOfDay.fromDateTime(state.nextStartLocal);
    final hour = start.hour.toString().padLeft(2, '0');
    final minute = start.minute.toString().padLeft(2, '0');
    return 'Départ à $hour:$minute - dans ${_formatCountdown(state.secondsUntilStart)}';
  }

  String _formatCountdown(int totalSeconds) {
    if (totalSeconds <= 0) {
      return '0s';
    }
    final minutes = totalSeconds ~/ 60;
    final seconds = totalSeconds % 60;
    if (minutes == 0) {
      return '${seconds}s';
    }
    return '${minutes}m ${seconds.toString().padLeft(2, '0')}s';
  }

  Color _statusColor(EventStatus status) {
    return switch (status) {
      EventStatus.active => AppColors.success,
      EventStatus.upcoming => AppColors.warning,
      EventStatus.idle => AppColors.textSecondary,
    };
  }

  Color _parseColor(String hex) {
    final value = hex.replaceFirst('#', '');
    return Color(int.parse('FF$value', radix: 16));
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge({
    required this.status,
    required this.color,
  });

  final EventStatus status;
  final Color color;

  @override
  Widget build(BuildContext context) {
    final label = switch (status) {
      EventStatus.active => 'EN COURS',
      EventStatus.upcoming => 'BIENTÔT',
      EventStatus.idle => 'À VENIR',
    };

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.12),
        border: Border.all(color: color.withValues(alpha: 0.35)),
        borderRadius: BorderRadius.circular(4),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _ErrorState extends StatelessWidget {
  const _ErrorState({
    required this.message,
    required this.onRetry,
  });

  final String message;
  final Future<void> Function() onRetry;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(message, textAlign: TextAlign.center),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: onRetry,
              child: const Text('Réessayer'),
            ),
          ],
        ),
      ),
    );
  }
}
