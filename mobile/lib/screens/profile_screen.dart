import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../config/app_theme.dart';
import '../models/user_model.dart';
import '../services/auth_service.dart';
import '../services/event_schedule_service.dart';
import '../widgets/loading_button.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  Future<void> _logout(BuildContext context) async {
    await context.read<AuthService>().logout();
    if (context.mounted) {
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (_) => false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Consumer2<AuthService, EventScheduleService>(
      builder: (context, authService, eventService, _) {
        final user = authService.user;

        return RefreshIndicator(
          onRefresh: authService.fetchCurrentUser,
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              Text(
                'Profil',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 6),
              Text(
                'Informations du compte connecté via l’API Laravel.',
                style: Theme.of(context).textTheme.bodySmall,
              ),
              const SizedBox(height: 20),
              if (user == null)
                const _EmptyProfile()
              else ...[
                _ProfileHeader(user: user),
                const SizedBox(height: 16),
                _ProfileDetails(user: user),
                const SizedBox(height: 16),
                _AccountStatus(user: user),
              ],
              const SizedBox(height: 16),
              _NotificationSettings(eventService: eventService),
              const SizedBox(height: 24),
              LoadingButton(
                label: 'Se déconnecter',
                isLoading: authService.isLoading,
                onPressed: () => _logout(context),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _ProfileHeader extends StatelessWidget {
  const _ProfileHeader({required this.user});

  final UserModel user;

  @override
  Widget build(BuildContext context) {
    final initial = user.nom.isNotEmpty ? user.nom.characters.first : '?';

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          children: [
            CircleAvatar(
              radius: 30,
              backgroundColor: AppColors.gold.withValues(alpha: 0.16),
              foregroundColor: AppColors.gold,
              child: Text(
                initial.toUpperCase(),
                style: const TextStyle(
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    user.nom,
                    style: Theme.of(context).textTheme.titleMedium,
                  ),
                  const SizedBox(height: 4),
                  Text(user.email,
                      style: Theme.of(context).textTheme.bodySmall),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfileDetails extends StatelessWidget {
  const _ProfileDetails({required this.user});

  final UserModel user;

  @override
  Widget build(BuildContext context) {
    final rows = <String, String>{
      'Rôle': user.role,
      'Pseudo GW2': user.pseudoGw2 ?? 'Non renseigné',
      'Clé API GW2': user.hasApiKey ? 'Configurée' : 'Non configurée',
      'Email': user.emailVerified ? 'Vérifié' : 'Non vérifié',
      'Créé le': user.createdAt ?? 'Non disponible',
    };

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: rows.entries
              .map(
                (entry) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 112,
                        child: Text(
                          entry.key,
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        ),
                      ),
                      Expanded(child: Text(entry.value)),
                    ],
                  ),
                ),
              )
              .toList(),
        ),
      ),
    );
  }
}

class _AccountStatus extends StatelessWidget {
  const _AccountStatus({required this.user});

  final UserModel user;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Icon(
              user.hasApiKey ? Icons.check_circle : Icons.info_outline,
              color: user.hasApiKey ? AppColors.success : AppColors.warning,
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                user.hasApiKey
                    ? 'Votre compte GW2 est lié.'
                    : 'Ajoutez une clé API GW2 depuis le web pour enrichir le profil.',
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NotificationSettings extends StatefulWidget {
  const _NotificationSettings({required this.eventService});

  final EventScheduleService eventService;

  @override
  State<_NotificationSettings> createState() => _NotificationSettingsState();
}

class _NotificationSettingsState extends State<_NotificationSettings> {
  bool _isRequesting = false;
  bool _isTesting = false;

  Future<void> _requestPermission() async {
    setState(() => _isRequesting = true);
    final granted = await widget.eventService.requestNotificationPermission();
    if (!mounted) {
      return;
    }
    setState(() => _isRequesting = false);
    _showSnackBar(
      granted
          ? 'Notifications autorisées.'
          : 'Notifications refusées ou indisponibles.',
    );
  }

  Future<void> _sendTest() async {
    setState(() => _isTesting = true);
    final sent = await widget.eventService.sendTestNotification();
    if (!mounted) {
      return;
    }
    setState(() => _isTesting = false);
    _showSnackBar(
      sent
          ? 'Notification de test envoyée.'
          : 'Impossible d’envoyer la notification de test.',
    );
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    final supported = widget.eventService.notificationsSupported;
    final enabled = widget.eventService.notificationsEnabled;
    final statusColor = enabled ? AppColors.success : AppColors.warning;

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              children: [
                Icon(
                  enabled
                      ? Icons.notifications_active
                      : Icons.notifications_off_outlined,
                  color: supported ? statusColor : AppColors.error,
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Notifications',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _statusLabel(supported: supported, enabled: enabled),
                        style: Theme.of(context).textTheme.bodySmall,
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            FilledButton(
              onPressed: !supported || enabled || _isRequesting
                  ? null
                  : _requestPermission,
              child: Text(
                _isRequesting
                    ? 'Demande en cours...'
                    : enabled
                        ? 'Notifications autorisées'
                        : 'Autoriser les notifications',
              ),
            ),
            const SizedBox(height: 8),
            OutlinedButton(
              onPressed: !enabled || _isTesting ? null : _sendTest,
              child: Text(
                _isTesting
                    ? 'Envoi en cours...'
                    : 'Envoyer une notification de test',
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _statusLabel({required bool supported, required bool enabled}) {
    if (!supported) {
      return 'Les notifications locales ne sont pas supportées sur cette plateforme.';
    }

    if (enabled) {
      return 'Vous recevrez une seule alerte pour le prochain event, 5 minutes avant son départ.';
    }

    return 'Autorisez les notifications pour recevoir les alertes d’events.';
  }
}

class _EmptyProfile extends StatelessWidget {
  const _EmptyProfile();

  @override
  Widget build(BuildContext context) {
    return const Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Text('Aucune information utilisateur disponible.'),
      ),
    );
  }
}
