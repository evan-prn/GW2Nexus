import 'package:flutter/material.dart';

class AppColors {
  const AppColors._();

  static const gold = Color(0xFFC9A84C);
  static const goldLight = Color(0xFFF0D98A);
  static const bgDeep = Color(0xFF0E0E12);
  static const bgVoid = Color(0xFF0A0A0A);
  static const bgCard = Color(0xFF1C1C24);
  static const textPrimary = Color(0xFFF0E8D8);
  static const textSecondary = Color(0xFFC0A888);
  static const success = Color(0xFF52C48A);
  static const warning = Color(0xFFE0B030);
  static const error = Color(0xFFF06060);
}

class AppTheme {
  const AppTheme._();

  static ThemeData dark() {
    final scheme = ColorScheme.fromSeed(
      seedColor: AppColors.gold,
      brightness: Brightness.dark,
      primary: AppColors.gold,
      surface: AppColors.bgCard,
      error: AppColors.error,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: scheme,
      scaffoldBackgroundColor: AppColors.bgDeep,
      fontFamily: 'serif',
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.bgVoid,
        foregroundColor: AppColors.gold,
        centerTitle: false,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        color: AppColors.bgCard,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
          side: BorderSide(color: AppColors.gold.withValues(alpha: 0.18)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white.withValues(alpha: 0.06),
        labelStyle: const TextStyle(color: AppColors.textSecondary),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: BorderSide(color: AppColors.gold.withValues(alpha: 0.18)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: AppColors.gold),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: AppColors.error),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(4),
          borderSide: const BorderSide(color: AppColors.error),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.gold,
          foregroundColor: AppColors.bgDeep,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      textTheme: const TextTheme(
        headlineMedium: TextStyle(
          color: AppColors.gold,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.6,
        ),
        headlineSmall: TextStyle(
          color: AppColors.gold,
          fontWeight: FontWeight.w700,
        ),
        titleMedium: TextStyle(
          color: AppColors.textPrimary,
          fontWeight: FontWeight.w700,
        ),
        bodyMedium: TextStyle(color: AppColors.textPrimary),
        bodySmall: TextStyle(color: AppColors.textSecondary),
      ),
    );
  }
}
