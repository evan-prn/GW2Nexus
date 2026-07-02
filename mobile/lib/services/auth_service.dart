import 'package:flutter/foundation.dart';

import '../config/api_config.dart';
import '../models/user_model.dart';
import 'api_service.dart';
import 'secure_storage_service.dart';

class AuthService extends ChangeNotifier {
  AuthService({
    ApiService? apiService,
    SecureStorageService? secureStorage,
  })  : _apiService = apiService ?? ApiService(),
        _secureStorage = secureStorage ?? const SecureStorageService();

  final ApiService _apiService;
  final SecureStorageService _secureStorage;

  UserModel? _user;
  bool _isInitializing = true;
  bool _isLoading = false;
  String? _errorMessage;

  UserModel? get user => _user;
  bool get isInitializing => _isInitializing;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _user != null;
  String? get errorMessage => _errorMessage;

  Future<void> initialize() async {
    final token = await _secureStorage.readToken();
    if (token == null || token.isEmpty) {
      _isInitializing = false;
      notifyListeners();
      return;
    }

    try {
      await fetchCurrentUser();
    } catch (_) {
      await _secureStorage.deleteToken();
      _user = null;
    } finally {
      _isInitializing = false;
      notifyListeners();
    }
  }

  Future<bool> login({
    required String email,
    required String password,
    required bool rememberMe,
  }) async {
    _setLoading(true);
    _errorMessage = null;

    try {
      final response = await _apiService.post(
        '${ApiConfig.apiVersion}/auth/login',
        body: {
          'email': email.trim(),
          'password': password,
        },
        authenticated: false,
      );

      final token = response['token'] as String?;
      final userJson = response['user'] as Map<String, dynamic>?;
      if (token == null || token.isEmpty || userJson == null) {
        throw const ApiException('La réponse de connexion est incomplète.');
      }

      await _secureStorage.saveToken(token, persist: rememberMe);
      _user = UserModel.fromJson(userJson);
      return true;
    } on ApiException catch (error) {
      _errorMessage = error.message;
      return false;
    } finally {
      _setLoading(false);
    }
  }

  Future<void> fetchCurrentUser() async {
    final response = await _apiService.get('${ApiConfig.apiVersion}/auth/me');
    final userJson = response['user'] as Map<String, dynamic>?;
    if (userJson == null) {
      throw const ApiException('Utilisateur introuvable dans la réponse API.');
    }
    _user = UserModel.fromJson(userJson);
    notifyListeners();
  }

  Future<void> logout() async {
    _setLoading(true);
    try {
      await _apiService.post('${ApiConfig.apiVersion}/auth/logout');
    } on ApiException {
      // La suppression locale du token reste prioritaire si l'appel API échoue.
    } finally {
      await _secureStorage.deleteToken();
      _user = null;
      _setLoading(false);
    }
  }

  void clearError() {
    _errorMessage = null;
    notifyListeners();
  }

  void _setLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
