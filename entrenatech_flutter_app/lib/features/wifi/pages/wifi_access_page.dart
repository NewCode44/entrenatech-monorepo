import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/services/wifi_service.dart';
import '../../../core/models/access_models.dart';
import '../../../shared/widgets/premium_card.dart';
import '../../../features/payment/pages/payment_page.dart';

class WiFiAccessPage extends StatefulWidget {
  const WiFiAccessPage({super.key});

  @override
  State<WiFiAccessPage> createState() => _WiFiAccessPageState();
}

class _WiFiAccessPageState extends State<WiFiAccessPage> {
  final WiFiService _wifiService = WiFiService();
  AccessMode _accessMode = AccessMode.expired;
  String _accessMessage = 'Detectando conexión...';
  bool _isLoading = true;
  String? _email;
  UserSubscription? _subscription;

  @override
  void initState() {
    super.initState();
    _initializeAccessDetection();
  }

  Future<void> _initializeAccessDetection() async {
    await _updateAccessStatus();

    // Escuchar cambios de conectividad
    _wifiService.accessModeStream.listen((_) {
      _updateAccessStatus();
    });
  }

  Future<void> _updateAccessStatus() async {
    if (!mounted) return;

    setState(() => _isLoading = true);

    try {
      final accessMode = await _wifiService.getAccessMode();
      final message = await _wifiService.getAccessModeMessage();
      final subscription = await _wifiService.getUserSubscription(null);

      setState(() {
        _accessMode = accessMode;
        _accessMessage = message;
        _subscription = subscription;
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _accessMode = AccessMode.expired;
        _accessMessage = 'Error detectando conexión';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(24.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              SizedBox(height: 32.h),
              _buildAccessStatusCard(),
              SizedBox(height: 32.h),
              _buildMainContent(),
              SizedBox(height: 32.h),
              _buildActionButtons(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(
              padding: EdgeInsets.all(12.w),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    const Color(0xFF4F46E5),
                    const Color(0xFF7C3AED),
                  ],
                ),
                borderRadius: BorderRadius.circular(16.r),
              ),
              child: Icon(
                Icons.fitness_center_rounded,
                color: Colors.white,
                size: 32.w,
              ),
            ),
            SizedBox(width: 16.w),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'EntrenaTech',
                    style: TextStyle(
                      fontSize: 28.sp,
                      fontWeight: FontWeight.bold,
                      color: Theme.of(context).colorScheme.onSurface,
                    ),
                  ),
                  Text(
                    'Tu acceso premium al fitness',
                    style: TextStyle(
                      fontSize: 16.sp,
                      color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ).animate().fadeIn(
          duration: 600.ms,
          curve: Curves.easeOut,
        ).slideX(
          begin: -0.1,
          end: 0,
          duration: 600.ms,
          curve: Curves.easeOut,
        ),
      ],
    );
  }

  Widget _buildAccessStatusCard() {
    return PremiumCard(
      gradient: LinearGradient(
        colors: _getAccessModeGradientColors(),
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (_isLoading) ...[
            Row(
              children: [
                SizedBox(
                  width: 24.w,
                  height: 24.w,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      _getAccessModeColor(),
                    ),
                  ),
                ),
                SizedBox(width: 12.w),
                Expanded(
                  child: Text(
                    'Verificando acceso...',
                    style: TextStyle(
                      color: _getAccessModeColor(),
                      fontWeight: FontWeight.w600,
                      fontSize: 16.sp,
                    ),
                  ),
                ),
              ],
            ),
          ] else ...[
            StatusIndicator(
              accessMode: _accessMode,
              message: _accessMessage,
              size: 28.w,
            ),
            if (_subscription != null && _subscription!.isActive) ...[
              SizedBox(height: 16.h),
              _buildSubscriptionInfo(),
            ],
          ],
        ],
      ),
    ).animate().fadeIn(
      duration: 800.ms,
      curve: Curves.easeOut,
    ).scale(
      begin: const Offset(0.9, 0.9),
      end: const Offset(1.0, 1.0),
      duration: 800.ms,
      curve: Curves.elasticOut,
    );
  }

  Widget _buildSubscriptionInfo() {
    if (_subscription == null) return const SizedBox.shrink();

    final planInfo = SubscriptionPlanInfo.getPlanInfo(_subscription!.plan!);
    final endDate = _subscription!.endDate;

    return Container(
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(12.r),
      ),
      child: Row(
        children: [
          Icon(
            Icons.diamond_rounded,
            color: Colors.amber,
            size: 20.w,
          ),
          SizedBox(width: 8.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Plan ${planInfo.name}',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.w600,
                    fontSize: 14.sp,
                  ),
                ),
                if (endDate != null)
                  Text(
                    'Vence: ${_formatDate(endDate)}',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.8),
                      fontSize: 12.sp,
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMainContent() {
    switch (_accessMode) {
      case AccessMode.free:
        return _buildFreeAccessContent();
      case AccessMode.premium:
        return _buildPremiumAccessContent();
      case AccessMode.trial:
        return _buildTrialAccessContent();
      case AccessMode.expired:
        return _buildExpiredAccessContent();
    }
  }

  Widget _buildFreeAccessContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '🎉 ¡Acceso Gratuito!',
          style: TextStyle(
            fontSize: 24.sp,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF10B981),
          ),
        ).animate().fadeIn(
          duration: 1000.ms,
          curve: Curves.easeOut,
        ),
        SizedBox(height: 16.h),
        Text(
          'Estás conectado al WiFi del gym. Disfruta de todas las características premium sin costo alguno.',
          style: TextStyle(
            fontSize: 16.sp,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.8),
          ),
        ),
        SizedBox(height: 24.h),
        _buildFeaturesGrid(isPremium: true),
      ],
    );
  }

  Widget _buildPremiumAccessContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '💎 Acceso Premium Activo',
          style: TextStyle(
            fontSize: 24.sp,
            fontWeight: FontWeight.bold,
            color: const Color(0xFFF59E0B),
          ),
        ).animate().fadeIn(
          duration: 1000.ms,
          curve: Curves.easeOut,
        ),
        SizedBox(height: 16.h),
        Text(
          'Tu suscripción está activa. Disfruta acceso completo desde cualquier lugar.',
          style: TextStyle(
            fontSize: 16.sp,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.8),
          ),
        ),
        SizedBox(height: 24.h),
        _buildFeaturesGrid(isPremium: true),
      ],
    );
  }

  Widget _buildTrialAccessContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '🎯 Período de Prueba',
          style: TextStyle(
            fontSize: 24.sp,
            fontWeight: FontWeight.bold,
            color: const Color(0xFF3B82F6),
          ),
        ).animate().fadeIn(
          duration: 1000.ms,
          curve: Curves.easeOut,
        ),
        SizedBox(height: 16.h),
        Text(
          'Estás en período de prueba. Disfruta todas las características premium mientras decides.',
          style: TextStyle(
            fontSize: 16.sp,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.8),
          ),
        ),
        SizedBox(height: 24.h),
        _buildFeaturesGrid(isPremium: true),
      ],
    );
  }

  Widget _buildExpiredAccessContent() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          '🔒 Suscripción Requerida',
          style: TextStyle(
            fontSize: 24.sp,
            fontWeight: FontWeight.bold,
            color: const Color(0xFFEF4444),
          ),
        ).animate().fadeIn(
          duration: 1000.ms,
          curve: Curves.easeOut,
        ),
        SizedBox(height: 16.h),
        Text(
          'Accede a todas las características premium por solo \$50 MXN al mes.',
          style: TextStyle(
            fontSize: 16.sp,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.8),
          ),
        ),
        SizedBox(height: 24.h),
        _buildFeaturesGrid(isPremium: false),
      ],
    );
  }

  Widget _buildFeaturesGrid({required bool isPremium}) {
    final features = [
      FeatureCard(
        icon: Icons.fitness_center_rounded,
        title: 'Rutinas Personalizadas',
        description: 'Planes de entrenamiento adaptados a tus objetivos',
        isAvailable: isPremium,
      ),
      FeatureCard(
        icon: Icons.emoji_events_rounded,
        title: 'Gamificación',
        description: 'Desafíos, logros y recompensas',
        isAvailable: isPremium,
      ),
      FeatureCard(
        icon: Icons.chat_rounded,
        title: 'Chat IA Personal',
        description: 'Asistente de fitness inteligente 24/7',
        isAvailable: isPremium,
      ),
      FeatureCard(
        icon: Icons.music_note_rounded,
        title: 'Música y Podcasts',
        description: 'Streaming de música motivadora',
        isAvailable: isPremium,
      ),
    ];

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 1.0,
        crossAxisSpacing: 16.w,
        mainAxisSpacing: 16.h,
      ),
      itemCount: features.length,
      itemBuilder: (context, index) {
        return features[index].animate().fadeIn(
          duration: (1000 + (index * 200)).ms,
          curve: Curves.easeOut,
        ).slideY(
          begin: 0.2,
          end: 0,
          duration: (1000 + (index * 200)).ms,
          curve: Curves.easeOut,
        );
      },
    );
  }

  Widget _buildActionButtons() {
    if (_accessMode == AccessMode.expired) {
      return Column(
        children: [
          GradientButton(
            text: 'Obtener Acceso Premium',
            icon: Icons.diamond_rounded,
            onPressed: () => _navigateToPayment(),
          ).animate().fadeIn(
            duration: 1200.ms,
            curve: Curves.easeOut,
          ).slideY(
            begin: 0.3,
            end: 0,
            duration: 1200.ms,
            curve: Curves.easeOut,
          ),
          SizedBox(height: 16.h),
          TextButton(
            onPressed: () => _refreshStatus(),
            child: Text(
              'Verificar conexión',
              style: TextStyle(
                fontSize: 16.sp,
                color: Theme.of(context).primaryColor,
              ),
            ),
          ),
        ],
      );
    }

    return GradientButton(
      text: 'Actualizar Estado',
      icon: Icons.refresh_rounded,
      onPressed: () => _refreshStatus(),
    ).animate().fadeIn(
      duration: 1200.ms,
      curve: Curves.easeOut,
    ).slideY(
      begin: 0.3,
      end: 0,
      duration: 1200.ms,
      curve: Curves.easeOut,
    );
  }

  void _navigateToPayment() {
    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (context) => const PaymentPage(),
      ),
    );
  }

  void _refreshStatus() {
    _updateAccessStatus();
  }

  List<Color> _getAccessModeGradientColors() {
    switch (_accessMode) {
      case AccessMode.free:
        return [
          const Color(0xFF10B981).withOpacity(0.1),
          const Color(0xFF059669).withOpacity(0.05),
        ];
      case AccessMode.premium:
        return [
          const Color(0xFFF59E0B).withOpacity(0.1),
          const Color(0xFFD97706).withOpacity(0.05),
        ];
      case AccessMode.trial:
        return [
          const Color(0xFF3B82F6).withOpacity(0.1),
          const Color(0xFF2563EB).withOpacity(0.05),
        ];
      case AccessMode.expired:
        return [
          const Color(0xFFEF4444).withOpacity(0.1),
          const Color(0xFFDC2626).withOpacity(0.05),
        ];
    }
  }

  Color _getAccessModeColor() {
    switch (_accessMode) {
      case AccessMode.free:
        return const Color(0xFF10B981);
      case AccessMode.premium:
        return const Color(0xFFF59E0B);
      case AccessMode.trial:
        return const Color(0xFF3B82F6);
      case AccessMode.expired:
        return const Color(0xFFEF4444);
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day.toString().padLeft(2, '0')}/${date.month.toString().padLeft(2, '0')}/${date.year}';
  }
}