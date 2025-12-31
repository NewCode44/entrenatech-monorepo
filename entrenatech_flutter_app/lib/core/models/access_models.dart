enum AccessMode {
  free,      // Acceso gratuito en el gym
  premium,   // Acceso premium pagado
  trial,     // Periodo de prueba
  expired,   // Suscripción expirada
}

enum NetworkType {
  gym,       // Conectado a WiFi del gym
  mobile,    // Usando datos móviles
  external,  // Otra red WiFi
}

class UserSubscription {
  final String? userId;
  final String? email;
  final SubscriptionPlan? plan;
  final DateTime? startDate;
  final DateTime? endDate;
  final bool isActive;
  final bool autoRenew;

  const UserSubscription({
    this.userId,
    this.email,
    this.plan,
    this.startDate,
    this.endDate,
    this.isActive = false,
    this.autoRenew = false,
  });

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'email': email,
      'plan': plan?.toString(),
      'startDate': startDate?.toIso8601String(),
      'endDate': endDate?.toIso8601String(),
      'isActive': isActive,
      'autoRenew': autoRenew,
    };
  }

  factory UserSubscription.fromJson(Map<String, dynamic> json) {
    return UserSubscription(
      userId: json['userId'],
      email: json['email'],
      plan: SubscriptionPlan.values.firstWhere(
        (plan) => plan.toString() == json['plan'],
        orElse: () => SubscriptionPlan.none,
      ),
      startDate: json['startDate'] != null ? DateTime.parse(json['startDate']) : null,
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      isActive: json['isActive'] ?? false,
      autoRenew: json['autoRenew'] ?? false,
    );
  }
}

enum SubscriptionPlan {
  none,      // Sin plan
  monthly,   // \$50 MXN/mes
  quarterly, // \$135 MXN/3 meses (10% descuento)
  yearly,    // \$480 MXN/año (20% descuento)
}

class SubscriptionPlanInfo {
  final SubscriptionPlan plan;
  final String name;
  final double price;
  final String duration;
  final String description;
  final double discount;

  const SubscriptionPlanInfo({
    required this.plan,
    required this.name,
    required this.price,
    required this.duration,
    required this.description,
    this.discount = 0.0,
  });

  static const List<SubscriptionPlanInfo> plans = [
    SubscriptionPlanInfo(
      plan: SubscriptionPlan.monthly,
      name: 'Mensual',
      price: 50.0,
      duration: '1 mes',
      description: 'Acceso premium ilimitado fuera del gym',
    ),
    SubscriptionPlanInfo(
      plan: SubscriptionPlan.quarterly,
      name: 'Trimestral',
      price: 135.0,
      duration: '3 meses',
      description: 'Ahorra 10% comparado con el plan mensual',
      discount: 10.0,
    ),
    SubscriptionPlanInfo(
      plan: SubscriptionPlan.yearly,
      name: 'Anual',
      price: 480.0,
      duration: '12 meses',
      description: 'Ahorra 20% comparado con el plan mensual',
      discount: 20.0,
    ),
  ];

  static SubscriptionPlanInfo getPlanInfo(SubscriptionPlan plan) {
    return plans.firstWhere((p) => p.plan == plan, orElse: () => plans.first);
  }
}

class PaymentResult {
  final bool success;
  final String? transactionId;
  final String? error;
  final SubscriptionPlan? plan;
  final DateTime? timestamp;

  const PaymentResult({
    required this.success,
    this.transactionId,
    this.error,
    this.plan,
    this.timestamp,
  });

  factory PaymentResult.success({
    required String transactionId,
    required SubscriptionPlan plan,
  }) {
    return PaymentResult(
      success: true,
      transactionId: transactionId,
      plan: plan,
      timestamp: DateTime.now(),
    );
  }

  factory PaymentResult.error(String error) {
    return PaymentResult(
      success: false,
      error: error,
      timestamp: DateTime.now(),
    );
  }
}