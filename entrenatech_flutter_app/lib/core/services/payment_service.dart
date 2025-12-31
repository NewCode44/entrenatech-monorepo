import 'dart:async';
import 'dart:math';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:vibration/vibration.dart';
import '../models/access_models.dart';

class PaymentService {
  static const String _paymentHistoryKey = 'payment_history';
  static final PaymentService _instance = PaymentService._internal();
  factory PaymentService() => _instance;
  PaymentService._internal();

  /// Simula el proceso de pago para demo/testing
  /// En producción, aquí iría la integración real con Stripe, Apple Pay, Google Pay
  Future<PaymentResult> purchaseSubscription({
    required SubscriptionPlan plan,
    required String email,
    String? userId,
    bool simulatePayment = true,
  }) async {
    try {
      // Haptic feedback
      await Vibration.vibrate(duration: 100);

      // Validar datos
      if (email.isEmpty) {
        return PaymentResult.error('El email es requerido');
      }

      if (plan == SubscriptionPlan.none) {
        return PaymentResult.error('Seleccione un plan válido');
      }

      // Simular procesamiento de pago
      if (simulatePayment) {
        await _simulatePaymentProcessing();
      }

      // Generar ID de transacción
      final transactionId = _generateTransactionId();

      // Calcular fechas de suscripción
      final now = DateTime.now();
      final endDate = _calculateEndDate(plan, now);

      // Crear suscripción
      final subscription = UserSubscription(
        userId: userId ?? 'demo_user_${Random().nextInt(10000)}',
        email: email,
        plan: plan,
        startDate: now,
        endDate: endDate,
        isActive: true,
        autoRenew: true,
      );

      // Guardar suscripción
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_subscription', _subscriptionToJson(subscription));

      // Guardar en historial de pagos
      await _savePaymentTransaction(transactionId, plan, email, subscription);

      // Haptic feedback de éxito
      await Vibration.vibrate(pattern: [0, 100, 50, 100]);

      return PaymentResult.success(
        transactionId: transactionId,
        plan: plan,
      );

    } catch (e) {
      print('Error en proceso de pago: $e');
      return PaymentResult.error('Error procesando el pago: ${e.toString()}');
    }
  }

  /// Simula el procesamiento del pago con delay realista
  Future<void> _simulatePaymentProcessing() async {
    // Simular diferentes etapas del proceso de pago
    final steps = [
      {'message': 'Validando información...', 'delay': 500},
      {'message': 'Conectando con pasarela de pago...', 'delay': 1000},
      {'message': 'Procesando pago...', 'delay': 1500},
      {'message': 'Verificando transacción...', 'delay': 800},
      {'message': 'Confirmando suscripción...', 'delay': 500},
    ];

    for (final step in steps) {
      await Future.delayed(Duration(milliseconds: step['delay'] as int));
      print('Pago: ${step['message']}');
    }
  }

  /// Genera un ID de transacción único
  String _generateTransactionId() {
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final random = Random().nextInt(9999).toString().padLeft(4, '0');
    return 'ENTX${timestamp}$random';
  }

  /// Calcula la fecha de finalización basada en el plan
  DateTime _calculateEndDate(SubscriptionPlan plan, DateTime startDate) {
    if (plan == SubscriptionPlan.monthly) {
      return DateTime(startDate.year, startDate.month + 1, startDate.day);
    } else if (plan == SubscriptionPlan.quarterly) {
      return DateTime(startDate.year, startDate.month + 3, startDate.day);
    } else if (plan == SubscriptionPlan.yearly) {
      return DateTime(startDate.year + 1, startDate.month, startDate.day);
    } else {
      return startDate;
    }
  }

  /// Convierte suscripción a JSON
  String _subscriptionToJson(UserSubscription subscription) {
    return '''
    {
      "userId": "${subscription.userId}",
      "email": "${subscription.email}",
      "plan": "${subscription.plan}",
      "startDate": "${subscription.startDate?.toIso8601String()}",
      "endDate": "${subscription.endDate?.toIso8601String()}",
      "isActive": ${subscription.isActive},
      "autoRenew": ${subscription.autoRenew}
    }
    ''';
  }

  /// Guarda la transacción en el historial
  Future<void> _savePaymentTransaction(
    String transactionId,
    SubscriptionPlan plan,
    String email,
    UserSubscription subscription,
  ) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final historyJson = prefs.getStringList(_paymentHistoryKey) ?? [];

      final transaction = {
        'transactionId': transactionId,
        'plan': plan.toString(),
        'planName': SubscriptionPlanInfo.getPlanInfo(plan).name,
        'amount': SubscriptionPlanInfo.getPlanInfo(plan).price,
        'currency': 'MXN',
        'email': email,
        'timestamp': DateTime.now().toIso8601String(),
        'status': 'completed',
        'subscription': {
          'startDate': subscription.startDate?.toIso8601String(),
          'endDate': subscription.endDate?.toIso8601String(),
          'isActive': subscription.isActive,
        }
      };

      historyJson.add(_transactionToJson(transaction));
      await prefs.setStringList(_paymentHistoryKey, historyJson);

    } catch (e) {
      print('Error guardando transacción: $e');
    }
  }

  String _transactionToJson(Map<String, dynamic> transaction) {
    return '''
    {
      "transactionId": "${transaction['transactionId']}",
      "plan": "${transaction['plan']}",
      "planName": "${transaction['planName']}",
      "amount": ${transaction['amount']},
      "currency": "${transaction['currency']}",
      "email": "${transaction['email']}",
      "timestamp": "${transaction['timestamp']}",
      "status": "${transaction['status']}",
      "subscription": ${transaction['subscription']}
    }
    ''';
  }

  /// Obtiene el historial de pagos
  Future<List<Map<String, dynamic>>> getPaymentHistory() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final historyJson = prefs.getStringList(_paymentHistoryKey) ?? [];

      return historyJson.map((json) {
        // Parseo simple del JSON
        final Map<String, dynamic> data = {};
        final lines = json.split('\n');
        for (final line in lines) {
          if (line.contains(':') && line.contains(',')) {
            final parts = line.split(':').map((p) => p.trim()).toList();
            if (parts.length >= 2) {
              final key = parts[0].replaceAll('"', '').replaceAll(' ', '');
              final value = parts[1].replaceAll(',', '').replaceAll('"', '');
              data[key] = value;
            }
          }
        }
        return data;
      }).toList();

    } catch (e) {
      print('Error obteniendo historial de pagos: $e');
      return [];
    }
  }

  /// Cancela la suscripción actual
  Future<bool> cancelSubscription(String userId) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final subscriptionJson = prefs.getString('user_subscription');

      if (subscriptionJson == null) return false;

      // En producción, aquí iría la llamada al API para cancelar
      await _simulateCancellation();

      // Actualizar suscripción local
      final subscription = UserSubscription.fromJson(
        _parseSubscriptionJson(subscriptionJson)
      );

      final cancelledSubscription = UserSubscription(
        userId: subscription.userId,
        email: subscription.email,
        plan: subscription.plan,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        isActive: false,
        autoRenew: false,
      );

      await prefs.setString('user_subscription', _subscriptionToJson(cancelledSubscription));

      // Haptic feedback
      await Vibration.vibrate(duration: 200);

      return true;

    } catch (e) {
      print('Error cancelando suscripción: $e');
      return false;
    }
  }

  /// Simula el proceso de cancelación
  Future<void> _simulateCancellation() async {
    await Future.delayed(const Duration(seconds: 2));
    print('Cancelando suscripción...');
  }

  /// Parseo simple del JSON de suscripción
  Map<String, dynamic> _parseSubscriptionJson(String json) {
    final Map<String, dynamic> data = {};
    final lines = json.split('\n');
    for (final line in lines) {
      if (line.contains(':') && line.contains(',')) {
        final parts = line.split(':').map((p) => p.trim()).toList();
        if (parts.length >= 2) {
          final key = parts[0].replaceAll('"', '').replaceAll(' ', '');
          final value = parts[1].replaceAll(',', '').replaceAll('"', '');
          data[key] = value;
        }
      }
    }
    return data;
  }

  /// Verifica si hay un método de pago disponible
  Future<bool> isPaymentMethodAvailable() async {
    // En producción, aquí se verificaría si hay tarjetas guardadas, etc.
    // Para demo, siempre retornamos true
    return true;
  }

  /// Obtiene el estado actual de la suscripción
  Future<UserSubscription?> getCurrentSubscription() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final subscriptionJson = prefs.getString('user_subscription');

      if (subscriptionJson == null) return null;

      return UserSubscription.fromJson(_parseSubscriptionJson(subscriptionJson));
    } catch (e) {
      print('Error obteniendo suscripción actual: $e');
      return null;
    }
  }

  /// Verifica si la suscripción está activa y no ha expirado
  Future<bool> isSubscriptionActive() async {
    final subscription = await getCurrentSubscription();

    if (subscription == null || !subscription.isActive) {
      return false;
    }

    if (subscription.endDate != null && DateTime.now().isAfter(subscription.endDate!)) {
      return false;
    }

    return true;
  }

  /// Renueva la suscripción automáticamente
  Future<PaymentResult?> renewSubscription() async {
    final subscription = await getCurrentSubscription();

    if (subscription == null || subscription.plan == SubscriptionPlan.none) {
      return null;
    }

    if (!subscription.autoRenew) {
      return null;
    }

    return await purchaseSubscription(
      plan: subscription.plan ?? SubscriptionPlan.monthly,
      email: subscription.email ?? '',
      userId: subscription.userId,
    );
  }
}