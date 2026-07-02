class UserModel {
  const UserModel({
    required this.id,
    required this.nom,
    required this.email,
    required this.role,
    required this.hasApiKey,
    required this.emailVerified,
    this.pseudoGw2,
    this.avatar,
    this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as int,
      nom: json['nom'] as String? ?? '',
      email: json['email'] as String? ?? '',
      role: json['role'] as String? ?? 'user',
      pseudoGw2: json['pseudo_gw2'] as String?,
      avatar: json['avatar'] as String?,
      hasApiKey: json['has_api_key'] as bool? ?? false,
      emailVerified: json['email_verified'] as bool? ?? false,
      createdAt: json['created_at'] as String?,
    );
  }

  final int id;
  final String nom;
  final String email;
  final String role;
  final String? pseudoGw2;
  final String? avatar;
  final bool hasApiKey;
  final bool emailVerified;
  final String? createdAt;
}
