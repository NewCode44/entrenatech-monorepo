import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:device_info_plus/device_info_plus.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import '../models/access_models.dart';

class WiFiService {
  static const String _gymSSIDKey = 'gym_ssid';
  static const String _lastAccessModeKey = 'last_access_mode';
  static const String _subscriptionKey = 'user_subscription';

  // Configuración del gym - configurable para diferentes clientes
  static const List<String> _defaultGymSSIDs = [
    'EntrenaTech_Gym',
    'Gym_EntrenaTech',
    'EntrenaTech_Members',
    'EntrenaWiFi',
  ];

  static final WiFiService _instance = WiFiService._internal();
  factory WiFiService() => _instance;
  WiFiService._internal();

  /// Detecta el tipo de red actual
  Future<NetworkType> getCurrentNetworkType() async {
    try {
      final connectivityResult = await Connectivity().checkConnectivity();

      switch (connectivityResult) {
        case ConnectivityResult.wifi:
          return await _checkIfGymWiFi() ? NetworkType.gym : NetworkType.external;
        case ConnectivityResult.mobile:
          return NetworkType.mobile;
        case ConnectivityResult.ethernet:
          return NetworkType.external;
        case ConnectivityResult.bluetooth:
        case ConnectivityResult.none:
        default:
          return NetworkType.external;
      }
    } catch (e) {
      print('Error detectando red: $e');
      return NetworkType.external;
    }
  }

  /// Verifica si está conectado a una red WiFi del gym
  Future<bool> _checkIfGymWiFi() async {
    try {
      // Para demo/testing: simulación basada en configuración local
      final prefs = await SharedPreferences.getInstance();
      final gymSSIDs = prefs.getStringList(_gymSSIDKey) ?? _defaultGymSSIDs;

      // En producción, aquí iría la lógica real de detección de SSID
      // Por ahora, usamos una detección simplificada por IP/gateway

      // Verificar si tenemos conexión a internet (el gym suele tener router específico)
      final response = await http.get(
        Uri.parse('https://api.ipify.org?format=json'),
      ).timeout(const Duration(seconds: 5));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final publicIP = data['ip'] as String;

        // Lógica simple: si tiene internet y no es IP móvil típica,
        // asumimos que podría ser el gym (esto se refinaría en producción)
        return _isLikelyGymNetwork(publicIP);
      }

      return false;
    } catch (e) {
      print('Error verificando WiFi del gym: $e');
      return false;
    }
  }

  /// Lógica simple para determinar si es probablemente una red de gym
  bool _isLikelyGymNetwork(String publicIP) {
    // En producción, esto sería más sofisticado:
    // - Verificar rangos de IP del router del gym
    // - Checar dominios DNS específicos
    // - Detectar portal cautivo

    // Para demo: asumimos que cualquier conexión WiFi es potencialmente el gym
    // si el usuario ha configurado previamente los SSIDs del gym
    return true;
  }

  /// Determina el modo de acceso basado en red y suscripción
  Future<AccessMode> getAccessMode({String? userId}) async {
    try {
      final networkType = await getCurrentNetworkType();

      // Si está en el gym -> acceso gratuito siempre
      if (networkType == NetworkType.gym) {
        await _saveLastAccessMode(AccessMode.free);
        return AccessMode.free;
      }

      // Si está fuera del gym -> verificar suscripción
      final subscription = await getUserSubscription(userId);

      if (subscription == null || subscription.plan == SubscriptionPlan.none) {
        await _saveLastAccessMode(AccessMode.expired);
        return AccessMode.expired;
      }

      if (!subscription.isActive) {
        await _saveLastAccessMode(AccessMode.expired);
        return AccessMode.expired;
      }

      // Verificar si la suscripción ha expirado
      if (subscription.endDate != null && DateTime.now().isAfter(subscription.endDate!)) {
        await _saveLastAccessMode(AccessMode.expired);
        return AccessMode.expired;
      }

      await _saveLastAccessMode(AccessMode.premium);
      return AccessMode.premium;

    } catch (e) {
      print('Error determinando modo de acceso: $e');
      return AccessMode.expired;
    }
  }

  /// Obtiene mensaje descriptivo del modo de acceso actual
  Future<String> getAccessModeMessage({String? userId}) async {
    final accessMode = await getAccessMode(userId: userId);
    final networkType = await getCurrentNetworkType();

    switch (accessMode) {
      case AccessMode.free:
        return '🏋️‍♂️ Conectado al Gym - Acceso GRATIS ilimitado';
      case AccessMode.premium:
        final subscription = await getUserSubscription(userId);
        final planInfo = SubscriptionPlanInfo.getPlanInfo(subscription?.plan ?? SubscriptionPlan.monthly);
        return '💎 Acceso Premium - Plan ${planInfo.name} activo';
      case AccessMode.trial:
        return '🎯 Período de prueba - Disfruta acceso premium';
      case AccessMode.expired:
        if (networkType == NetworkType.mobile) {
          return '📱 Usando datos móviles - Se requiere suscripción';
        } else {
          return '🔒 Suscripción requerida - \$50 MXN/mes para acceso premium';
        }
    }
  }

  /// Obtiene la suscripción del usuario
  Future<UserSubscription?> getUserSubscription(String? userId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final subscriptionJson = prefs.getString(_subscriptionKey);

      if (subscriptionJson == null) return null;

      final subscriptionData = json.decode(subscriptionJson) as Map<String, dynamic>;

      // Si el userId no coincide, buscar en Firestore (en producción)
      if (userId != null && subscriptionData['userId'] != userId) {
        // Aquí iría la lógica para buscar en Firebase Firestore
        // Por ahora, retornamos null
        return null;
      }

      return UserSubscription.fromJson(subscriptionData);
    } catch (e) {
      print('Error obteniendo suscripción: $e');
      return null;
    }
  }

  /// Guarda la suscripción del usuario localmente
  Future<void> saveUserSubscription(UserSubscription subscription) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_subscriptionKey, json.encode(subscription.toJson()));
    } catch (e) {
      print('Error guardando suscripción: $e');
    }
  }

  /// Guarda el último modo de acceso
  Future<void> _saveLastAccessMode(AccessMode mode) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_lastAccessModeKey, mode.toString());
    } catch (e) {
      print('Error guardando modo de acceso: $e');
    }
  }

  /// Obtiene el último modo de acceso conocido
  Future<AccessMode?> getLastAccessMode() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final modeString = prefs.getString(_lastAccessModeKey);

      if (modeString == null) return null;

      return AccessMode.values.firstWhere(
        (mode) => mode.toString() == modeString,
        orElse: () => AccessMode.expired,
      );
    } catch (e) {
      print('Error obteniendo último modo de acceso: $e');
      return null;
    }
  }

  /// Configura los SSIDs del gym para un cliente específico
  Future<void> configureGymSSIDs(List<String> ssids) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setStringList(_gymSSIDKey, ssids);
    } catch (e) {
      print('Error configurando SSIDs del gym: $e');
    }
  }

  /// Obtiene información de la red actual (para debugging)
  Future<Map<String, dynamic>> getNetworkInfo() async {
    try {
      final connectivityResult = await Connectivity().checkConnectivity();
      final deviceInfo = DeviceInfoPlugin();
      final androidInfo = await deviceInfo.androidInfo;

      return {
        'connectivity': connectivityResult.toString(),
        'deviceModel': androidInfo.model,
        'androidVersion': androidInfo.version.release,
        'timestamp': DateTime.now().toIso8601String(),
      };
    } catch (e) {
      return {
        'error': e.toString(),
        'timestamp': DateTime.now().toIso8601String(),
      };
    }
  }

  /// Simula una suscripción para demo/testing
  Future<void> simulateSubscription(SubscriptionPlan plan, String email) async {
    final now = DateTime.now();
    final endDate = switch (plan) {
      SubscriptionPlan.monthly => now.add(const Duration(days: 30)),
      SubscriptionPlan.quarterly => now.add(const Duration(days: 90)),
      SubscriptionPlan.yearly => now.add(const Duration(days: 365)),
      SubscriptionPlan.none => now,
    };

    final subscription = UserSubscription(
      userId: 'demo_user',
      email: email,
      plan: plan,
      startDate: now,
      endDate: endDate,
      isActive: plan != SubscriptionPlan.none,
      autoRenew: true,
    );

    await saveUserSubscription(subscription);
  }

  /// Stream para monitorear cambios de conectividad
  Stream<AccessMode> get accessModeStream {
    return Connectivity().onConnectivityChanged.asyncMap((_) async {
      return await getAccessMode();
    });
  }
}