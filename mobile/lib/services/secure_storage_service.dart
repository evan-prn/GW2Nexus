import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class SecureStorageService {
  const SecureStorageService({FlutterSecureStorage? storage})
      : _storage = storage ?? const FlutterSecureStorage();

  static const _tokenKey = 'auth_token';
  static String? _sessionToken;

  final FlutterSecureStorage _storage;

  Future<void> saveToken(String token, {required bool persist}) async {
    _sessionToken = token;

    if (persist) {
      await _storage.write(key: _tokenKey, value: token);
      return;
    }

    await _storage.delete(key: _tokenKey);
  }

  Future<String?> readToken() async {
    return _sessionToken ?? _storage.read(key: _tokenKey);
  }

  Future<void> deleteToken() async {
    _sessionToken = null;
    await _storage.delete(key: _tokenKey);
  }
}
