import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  NotificationService();

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();

  bool _isInitialized = false;
  bool _isSupported = false;
  bool _permissionGranted = false;

  bool get isSupported => _isSupported;
  bool get isInitialized => _isInitialized;
  bool get permissionGranted => _permissionGranted;

  Future<void> initialize() async {
    _isSupported = _supportsLocalNotifications();
    if (!_isSupported) {
      return;
    }

    try {
      const android = AndroidInitializationSettings('@mipmap/ic_launcher');
      const darwin = DarwinInitializationSettings(
        requestAlertPermission: false,
        requestBadgePermission: false,
        requestSoundPermission: false,
      );

      await _plugin.initialize(
        const InitializationSettings(
          android: android,
          iOS: darwin,
          macOS: darwin,
        ),
      );

      _permissionGranted = await _readPermissionState();
      _isInitialized = true;
    } catch (_) {
      _isInitialized = false;
      _isSupported = false;
      _permissionGranted = false;
    }
  }

  Future<bool> requestPermission() async {
    if (!_isSupported || !_isInitialized) {
      return false;
    }

    try {
      final androidResult = await _plugin
          .resolvePlatformSpecificImplementation<
              AndroidFlutterLocalNotificationsPlugin>()
          ?.requestNotificationsPermission();

      if (androidResult != null) {
        _permissionGranted = androidResult;
        return _permissionGranted;
      }

      final iosResult = await _plugin
          .resolvePlatformSpecificImplementation<
              IOSFlutterLocalNotificationsPlugin>()
          ?.requestPermissions(alert: true, badge: true, sound: true);

      if (iosResult != null) {
        _permissionGranted = iosResult;
        return _permissionGranted;
      }

      _permissionGranted = defaultTargetPlatform == TargetPlatform.linux;
      return _permissionGranted;
    } catch (_) {
      _permissionGranted = false;
      return false;
    }
  }

  Future<bool> showEventStartingSoon({
    required String eventName,
    required String zoneName,
    required int minutesUntilStart,
  }) async {
    if (!_isSupported || !_isInitialized || !_permissionGranted) {
      return false;
    }

    return _show(
      id: eventName.hashCode & 0x7fffffff,
      title: 'Event dans 5 minutes',
      body: '$eventName commence dans $minutesUntilStart min - $zoneName',
    );
  }

  Future<bool> showTestNotification() async {
    if (!_isSupported || !_isInitialized || !_permissionGranted) {
      return false;
    }

    return _show(
      id: 42,
      title: 'GW2 Nexus',
      body: 'Notification de test : les alertes events sont prêtes.',
    );
  }

  Future<bool> _show({
    required int id,
    required String title,
    required String body,
  }) async {
    try {
      const androidDetails = AndroidNotificationDetails(
        'gw2_events',
        'Events GW2',
        channelDescription: 'Alertes avant le debut des events Guild Wars 2',
        importance: Importance.high,
        priority: Priority.high,
      );

      const darwinDetails = DarwinNotificationDetails();

      await _plugin.show(
        id,
        title,
        body,
        const NotificationDetails(android: androidDetails, iOS: darwinDetails),
      );
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> _readPermissionState() async {
    if (defaultTargetPlatform == TargetPlatform.linux) {
      return true;
    }

    final androidPlugin = _plugin.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();
    final androidEnabled = await androidPlugin?.areNotificationsEnabled();
    if (androidEnabled != null) {
      return androidEnabled;
    }

    return false;
  }

  bool _supportsLocalNotifications() {
    if (kIsWeb) {
      return false;
    }

    return switch (defaultTargetPlatform) {
      TargetPlatform.android ||
      TargetPlatform.iOS ||
      TargetPlatform.macOS ||
      TargetPlatform.linux =>
        true,
      TargetPlatform.fuchsia || TargetPlatform.windows => false,
    };
  }
}
