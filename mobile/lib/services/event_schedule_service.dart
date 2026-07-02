import 'dart:async';

import 'package:flutter/foundation.dart';

import '../config/api_config.dart';
import '../models/event_model.dart';
import 'api_service.dart';
import 'notification_service.dart';

class EventScheduleService extends ChangeNotifier {
  EventScheduleService({
    ApiService? apiService,
    NotificationService? notificationService,
  })  : _apiService = apiService ?? ApiService(),
        _notificationService = notificationService ?? NotificationService();

  static const _upcomingThresholdSeconds = 15 * 60;
  static const _notificationLeadSeconds = 5 * 60;
  static const _notificationWindowSeconds = 3;
  static const _secondsInDay = 86400;
  static const _secondsInTwoHours = 7200;

  final ApiService _apiService;
  final NotificationService _notificationService;
  final Set<String> _notifiedOccurrences = <String>{};

  Timer? _timer;
  List<EventGroup> _groups = const [];
  List<EventState> _states = const [];
  bool _isLoading = false;
  String? _errorMessage;

  List<EventGroup> get groups => _groups;
  List<EventState> get states => _states;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get notificationsSupported => _notificationService.isSupported;
  bool get notificationsEnabled => _notificationService.permissionGranted;

  List<EventState> get worldBossStates =>
      _states.where((state) => state.entry.event.isWorldBoss).toList();

  Future<void> initialize() async {
    await _notificationService.initialize();
    await refresh();
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) => _recompute());
  }

  Future<bool> requestNotificationPermission() async {
    final granted = await _notificationService.requestPermission();
    notifyListeners();
    return granted;
  }

  Future<bool> sendTestNotification() {
    return _notificationService.showTestNotification();
  }

  Future<void> refresh() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final response = await _apiService.get(
        '${ApiConfig.apiVersion}/events/schedule',
        authenticated: false,
      );
      final data = response['data'];
      if (data is! List<dynamic>) {
        throw const ApiException('Planning des events indisponible.');
      }

      _groups = data
          .map((group) => EventGroup.fromJson(group as Map<String, dynamic>))
          .toList();
      _recompute(shouldNotify: false);
    } on ApiException catch (error) {
      _errorMessage = error.message;
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void _recompute({bool shouldNotify = true}) {
    final entries = _groups.expand(
      (group) => group.zones.expand(
        (zone) => zone.events.map(
          (event) => EventEntry(event: event, group: group, zone: zone),
        ),
      ),
    );

    _states =
        entries.map((entry) => _computeState(entry, DateTime.now())).toList()
          ..sort((a, b) {
            final statusCompare = _statusOrder(a.status).compareTo(
              _statusOrder(b.status),
            );
            if (statusCompare != 0) {
              return statusCompare;
            }
            return a.secondsUntilStart.compareTo(b.secondsUntilStart);
          });

    if (shouldNotify) {
      _notifyUpcomingEvents();
    }

    notifyListeners();
  }

  EventState _computeState(EventEntry entry, DateTime now) {
    final nowSeconds =
        now.toUtc().hour * 3600 + now.toUtc().minute * 60 + now.toUtc().second;

    var bestSecondsUntil = _secondsInDay + 1;
    var bestDuration = 0;
    var isActive = false;
    var progressPercent = 0.0;
    var secondsRemaining = 0;

    for (final slot in entry.event.slots) {
      final slotStart = slot.startMinutes * 60;
      final slotDuration = slot.durationMinutes * 60;
      final slotEnd = slotStart + slotDuration;

      if (nowSeconds >= slotStart && nowSeconds < slotEnd) {
        final elapsed = nowSeconds - slotStart;
        isActive = true;
        progressPercent =
            (elapsed / slotDuration * 100).clamp(0, 100).toDouble();
        secondsRemaining = slotEnd - nowSeconds;
        bestSecondsUntil = 0;
        bestDuration = slotDuration;
        break;
      }

      var secondsUntil = slotStart - nowSeconds;
      if (secondsUntil < 0) {
        if (entry.event.isTwoHourCycle) {
          final positionInCycle = nowSeconds % _secondsInTwoHours;
          final slotInCycle = slotStart % _secondsInTwoHours;
          secondsUntil = slotInCycle - positionInCycle;
          if (secondsUntil <= 0) {
            secondsUntil += _secondsInTwoHours;
          }
        } else {
          secondsUntil += _secondsInDay;
        }
      }

      if (secondsUntil < bestSecondsUntil) {
        bestSecondsUntil = secondsUntil;
        bestDuration = slotDuration;
      }
    }

    final status = isActive
        ? EventStatus.active
        : bestSecondsUntil <= _upcomingThresholdSeconds
            ? EventStatus.upcoming
            : EventStatus.idle;

    return EventState(
      entry: entry,
      status: status,
      nextStartLocal: now.add(Duration(seconds: bestSecondsUntil)),
      secondsUntilStart: bestSecondsUntil,
      progressPercent: progressPercent,
      secondsRemaining: isActive ? secondsRemaining : bestDuration,
    );
  }

  void _notifyUpcomingEvents() {
    final candidates = _states.where((state) {
      final delta = (state.secondsUntilStart - _notificationLeadSeconds).abs();
      return state.status == EventStatus.upcoming &&
          state.secondsUntilStart > 0 &&
          delta <= _notificationWindowSeconds;
    }).toList();

    if (candidates.isEmpty) {
      return;
    }

    final state = candidates.first;
    final occurrenceKey =
        '${state.entry.event.id}-${state.nextStartLocal.toIso8601String()}';
    if (_notifiedOccurrences.contains(occurrenceKey)) {
      return;
    }

    _notifiedOccurrences.add(occurrenceKey);
    unawaited(
      _notificationService.showEventStartingSoon(
        eventName: state.entry.event.name,
        zoneName: state.entry.zone.name,
        minutesUntilStart: _notificationLeadSeconds ~/ 60,
      ),
    );
  }

  int _statusOrder(EventStatus status) {
    return switch (status) {
      EventStatus.active => 0,
      EventStatus.upcoming => 1,
      EventStatus.idle => 2,
    };
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }
}
