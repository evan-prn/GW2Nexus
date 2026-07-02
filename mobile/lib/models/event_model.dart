enum EventStatus { active, upcoming, idle }

class EventSlot {
  const EventSlot({
    required this.startMinutes,
    required this.durationMinutes,
    required this.preEventMinutes,
  });

  factory EventSlot.fromJson(Map<String, dynamic> json) {
    return EventSlot(
      startMinutes: json['startMinutes'] as int,
      durationMinutes: json['durationMinutes'] as int,
      preEventMinutes: json['preEventMinutes'] as int? ?? 0,
    );
  }

  final int startMinutes;
  final int durationMinutes;
  final int preEventMinutes;
}

class Gw2Event {
  const Gw2Event({
    required this.id,
    required this.name,
    required this.zone,
    required this.category,
    required this.isTwoHourCycle,
    required this.slots,
    this.wikiUrl,
    this.gw2ApiId,
  });

  factory Gw2Event.fromJson(Map<String, dynamic> json) {
    return Gw2Event(
      id: json['id'] as String,
      name: json['name'] as String,
      zone: json['zone'] as String,
      category: json['category'] as String,
      isTwoHourCycle: json['isTwoHourCycle'] as bool? ?? false,
      slots: (json['slots'] as List<dynamic>)
          .map((slot) => EventSlot.fromJson(slot as Map<String, dynamic>))
          .toList(),
      wikiUrl: json['wikiUrl'] as String?,
      gw2ApiId: json['gw2ApiId'] as String?,
    );
  }

  final String id;
  final String name;
  final String zone;
  final String category;
  final bool isTwoHourCycle;
  final List<EventSlot> slots;
  final String? wikiUrl;
  final String? gw2ApiId;

  bool get isWorldBoss => category == 'world_boss';
}

class EventZone {
  const EventZone({
    required this.id,
    required this.name,
    required this.color,
    required this.events,
  });

  factory EventZone.fromJson(Map<String, dynamic> json) {
    return EventZone(
      id: json['id'] as String,
      name: json['name'] as String,
      color: json['color'] as String? ?? '#C9A84C',
      events: (json['events'] as List<dynamic>)
          .map((event) => Gw2Event.fromJson(event as Map<String, dynamic>))
          .toList(),
    );
  }

  final String id;
  final String name;
  final String color;
  final List<Gw2Event> events;
}

class EventGroup {
  const EventGroup({
    required this.id,
    required this.label,
    required this.zones,
  });

  factory EventGroup.fromJson(Map<String, dynamic> json) {
    return EventGroup(
      id: json['id'] as String,
      label: json['label'] as String,
      zones: (json['zones'] as List<dynamic>)
          .map((zone) => EventZone.fromJson(zone as Map<String, dynamic>))
          .toList(),
    );
  }

  final String id;
  final String label;
  final List<EventZone> zones;
}

class EventEntry {
  const EventEntry({
    required this.event,
    required this.group,
    required this.zone,
  });

  final Gw2Event event;
  final EventGroup group;
  final EventZone zone;
}

class EventState {
  const EventState({
    required this.entry,
    required this.status,
    required this.nextStartLocal,
    required this.secondsUntilStart,
    required this.progressPercent,
    required this.secondsRemaining,
  });

  final EventEntry entry;
  final EventStatus status;
  final DateTime nextStartLocal;
  final int secondsUntilStart;
  final double progressPercent;
  final int secondsRemaining;
}
