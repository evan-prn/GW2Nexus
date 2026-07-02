import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import '../config/api_config.dart';
import 'secure_storage_service.dart';

class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode, this.errors});

  final String message;
  final int? statusCode;
  final Map<String, dynamic>? errors;

  @override
  String toString() => message;
}

class ApiService {
  ApiService({
    http.Client? client,
    SecureStorageService? secureStorage,
  })  : _client = client ?? http.Client(),
        _secureStorage = secureStorage ?? const SecureStorageService();

  final http.Client _client;
  final SecureStorageService _secureStorage;

  Future<Map<String, dynamic>> get(String path, {bool authenticated = true}) {
    return _send('GET', path, authenticated: authenticated);
  }

  Future<Map<String, dynamic>> post(
    String path, {
    Map<String, dynamic>? body,
    bool authenticated = true,
  }) {
    return _send('POST', path, body: body, authenticated: authenticated);
  }

  Future<Map<String, dynamic>> _send(
    String method,
    String path, {
    Map<String, dynamic>? body,
    bool authenticated = true,
  }) async {
    try {
      final request = http.Request(method, ApiConfig.uri(path));
      request.headers.addAll({
        HttpHeaders.acceptHeader: 'application/json',
        HttpHeaders.contentTypeHeader: 'application/json',
      });

      if (authenticated) {
        final token = await _secureStorage.readToken();
        if (token != null && token.isNotEmpty) {
          request.headers[HttpHeaders.authorizationHeader] = 'Bearer $token';
        }
      }

      if (body != null) {
        request.body = jsonEncode(body);
      }

      final streamedResponse = await _client.send(request).timeout(
            const Duration(seconds: 20),
          );
      final response = await http.Response.fromStream(streamedResponse);
      final decoded = _decodeResponse(response);

      if (response.statusCode >= 200 && response.statusCode < 300) {
        return decoded;
      }

      if (response.statusCode == 401) {
        await _secureStorage.deleteToken();
      }

      throw ApiException(
        _messageFor(response.statusCode, decoded),
        statusCode: response.statusCode,
        errors: decoded['errors'] as Map<String, dynamic>?,
      );
    } on SocketException {
      throw const ApiException(
        'Impossible de joindre le serveur. Vérifiez votre connexion.',
      );
    } on TimeoutException {
      throw const ApiException(
          'Le serveur ne répond pas. Réessayez plus tard.');
    } on FormatException {
      throw const ApiException('Réponse API invalide.');
    }
  }

  Map<String, dynamic> _decodeResponse(http.Response response) {
    if (response.body.isEmpty) {
      return <String, dynamic>{};
    }

    final decoded = jsonDecode(response.body);
    if (decoded is Map<String, dynamic>) {
      return decoded;
    }

    throw const FormatException('Expected a JSON object.');
  }

  String _messageFor(int statusCode, Map<String, dynamic> body) {
    if (statusCode == 422) {
      return _firstValidationError(body) ??
          (body['message'] as String? ??
              'Les données envoyées sont invalides.');
    }

    final apiMessage = body['message'] as String?;
    if (apiMessage != null && apiMessage.isNotEmpty) {
      return apiMessage;
    }

    return switch (statusCode) {
      401 => 'Identifiants incorrects ou session expirée.',
      500 => 'Erreur serveur. Réessayez plus tard.',
      _ => 'Une erreur est survenue. Code HTTP $statusCode.',
    };
  }

  String? _firstValidationError(Map<String, dynamic> body) {
    final errors = body['errors'];
    if (errors is! Map<String, dynamic> || errors.isEmpty) {
      return null;
    }

    final first = errors.values.first;
    if (first is List && first.isNotEmpty) {
      return first.first.toString();
    }

    return first.toString();
  }
}
