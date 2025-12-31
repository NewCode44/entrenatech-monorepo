import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:vibration/vibration.dart';
import '../../../core/services/payment_service.dart';
import '../../../core/services/wifi_service.dart';
import '../../../core/models/access_models.dart';
import '../../../shared/widgets/premium_card.dart';

class PaymentPage extends StatefulWidget {
  const PaymentPage({super.key});

  @override
  State<PaymentPage> createState() => _PaymentPageState();
}

class _PaymentPageState extends State<PaymentPage> {
  final PaymentService _paymentService = PaymentService();
  final WiFiService _wifiService = WiFiService();
  final TextEditingController _emailController = TextEditingController();

  SubscriptionPlan _selectedPlan = SubscriptionPlan.monthly;
  bool _isProcessing = false;
  PaymentResult? _lastPaymentResult;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).colorScheme.background,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: const Text('Planes Premium'),
        foregroundColor: Theme.of(context).colorScheme.onSurface,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: EdgeInsets.all(24.w),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              SizedBox(height: 32.h),
              _buildPlanSelection(),
              SizedBox(height: 32.h),
              _buildEmailInput(),
              SizedBox(height: 32.h),
              _buildPaymentButton(),
              SizedBox(height: 32.h),
              if (_lastPaymentResult != null) _buildPaymentResult(),
              SizedBox(height: 32.h),
              _buildFeatures(),
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
        Container(
          padding: EdgeInsets.all(16.w),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                const Color(0xFF4F46E5),
                const Color(0xFF7C3AED),
              ],
            ),
            borderRadius: BorderRadius.circular(20.r),
          ),
          child: Icon(
            Icons.diamond_rounded,
            color: Colors.white,
            size: 40.w,
          ),
        ).animate().fadeIn(
          duration: 600.ms,
          curve: Curves.easeOut,
        ).scale(
          begin: const Offset(0.8, 0.8),
          end: const Offset(1.0, 1.0),
          duration: 600.ms,
          curve: Curves.elasticOut,
        ),
        SizedBox(height: 24.h),
        Text(
          'Desbloquea Acceso Premium',
          style: TextStyle(
            fontSize: 32.sp,
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ).animate().fadeIn(
          duration: 800.ms,
          curve: Curves.easeOut,
        ).slideX(
          begin: -0.1,
          end: 0,
          duration: 800.ms,
          curve: Curves.easeOut,
        ),
        SizedBox(height: 16.h),
        Text(
          'Disfruta de todas las características premium desde cualquier lugar.',
          style: TextStyle(
            fontSize: 18.sp,
            color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
          ),
        ).animate().fadeIn(
          duration: 1000.ms,
          curve: Curves.easeOut,
        ).slideX(
          begin: -0.1,
          end: 0,
          duration: 1000.ms,
          curve: Curves.easeOut,
        ),
      ],
    );
  }

  Widget _buildPlanSelection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Selecciona tu plan',
          style: TextStyle(
            fontSize: 24.sp,
            fontWeight: FontWeight.bold,
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
        SizedBox(height: 16.h),
        ...SubscriptionPlanInfo.plans.asMap().entries.map((entry) {
          final index = entry.key;
          final planInfo = entry.value;
          final isSelected = _selectedPlan == planInfo.plan;

          return Padding(
            padding: EdgeInsets.only(bottom: 16.h),
            child: _buildPlanCard(planInfo, isSelected, index),
          );
        }),
      ],
    );
  }

  Widget _buildPlanCard(SubscriptionPlanInfo planInfo, bool isSelected, int index) {
    return GestureDetector(
      onTap: () {
        setState(() => _selectedPlan = planInfo.plan);
        Vibration.vibrate(duration: 50);
      },
      child: PremiumCard(
        gradient: isSelected
            ? LinearGradient(
                colors: [
                  const Color(0xFF4F46E5).withOpacity(0.1),
                  const Color(0xFF7C3AED).withOpacity(0.05),
                ],
              )
            : null,
        padding: EdgeInsets.all(20.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        planInfo.name,
                        style: TextStyle(
                          fontSize: 20.sp,
                          fontWeight: FontWeight.bold,
                          color: isSelected
                              ? const Color(0xFF4F46E5)
                              : Theme.of(context).colorScheme.onSurface,
                        ),
                      ),
                      SizedBox(height: 8.h),
                      Row(
                        children: [
                          Text(
                            '\$${planInfo.price.toStringAsFixed(0)} MXN',
                            style: TextStyle(
                              fontSize: 28.sp,
                              fontWeight: FontWeight.bold,
                              color: isSelected
                                  ? const Color(0xFF4F46E5)
                                  : Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          SizedBox(width: 8.w),
                          Text(
                            '/${planInfo.duration}',
                            style: TextStyle(
                              fontSize: 16.sp,
                              color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                if (isSelected)
                  Container(
                    padding: EdgeInsets.all(8.w),
                    decoration: BoxDecoration(
                      color: const Color(0xFF4F46E5),
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                    child: Icon(
                      Icons.check_rounded,
                      color: Colors.white,
                      size: 24.w,
                    ),
                  ),
              ],
            ),
            SizedBox(height: 16.h),
            Text(
              planInfo.description,
              style: TextStyle(
                fontSize: 16.sp,
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
            if (planInfo.discount > 0) ...[
              SizedBox(height: 12.h),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
                decoration: BoxDecoration(
                  color: Colors.green.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20.r),
                ),
                child: Text(
                  'Ahorra ${planInfo.discount}%',
                  style: TextStyle(
                    color: Colors.green,
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ],
        ),
      ).animate().fadeIn(
        duration: (800 + (index * 200)).ms,
        curve: Curves.easeOut,
      ).slideX(
        begin: 0.2,
        end: 0,
        duration: (800 + (index * 200)).ms,
        curve: Curves.easeOut,
      ),
    );
  }

  Widget _buildEmailInput() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Email para la suscripción',
          style: TextStyle(
            fontSize: 18.sp,
            fontWeight: FontWeight.w600,
            color: Theme.of(context).colorScheme.onSurface,
          ),
        ),
        SizedBox(height: 12.h),
        TextField(
          controller: _emailController,
          keyboardType: TextInputType.emailAddress,
          decoration: InputDecoration(
            hintText: 'tu@email.com',
            prefixIcon: Icon(Icons.email_outlined, size: 24.w),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.r),
              borderSide: BorderSide(
                color: Theme.of(context).colorScheme.outline,
              ),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12.r),
              borderSide: BorderSide(
                color: const Color(0xFF4F46E5),
                width: 2,
              ),
            ),
          ),
        ).animate().fadeIn(
          duration: 1200.ms,
          curve: Curves.easeOut,
        ),
      ],
    );
  }

  Widget _buildPaymentButton() {
    return GradientButton(
      text: 'Comprar Suscripción',
      icon: Icons.diamond_rounded,
      isLoading: _isProcessing,
      onPressed: _isProcessing ? null : () {
                _processPayment();
              },
      height: 60.h,
    ).animate().fadeIn(
      duration: 1400.ms,
      curve: Curves.easeOut,
    ).scale(
      begin: const Offset(0.95, 0.95),
      end: const Offset(1.0, 1.0),
      duration: 1400.ms,
      curve: Curves.elasticOut,
    );
  }

  Widget _buildPaymentResult() {
    if (_lastPaymentResult == null) return const SizedBox.shrink();

    final isSuccess = _lastPaymentResult!.success;

    return PremiumCard(
      gradient: isSuccess
          ? LinearGradient(
              colors: [
                Colors.green.withOpacity(0.1),
                Colors.green.withOpacity(0.05),
              ],
            )
          : LinearGradient(
              colors: [
                Colors.red.withOpacity(0.1),
                Colors.red.withOpacity(0.05),
              ],
            ),
      child: Column(
        children: [
          Row(
            children: [
              Icon(
                isSuccess ? Icons.check_circle_rounded : Icons.error_rounded,
                color: isSuccess ? Colors.green : Colors.red,
                size: 32.w,
              ),
              SizedBox(width: 16.w),
              Expanded(
                child: Text(
                  isSuccess
                      ? '¡Pago Exitoso!'
                      : 'Error en el Pago',
                  style: TextStyle(
                    fontSize: 20.sp,
                    fontWeight: FontWeight.bold,
                    color: isSuccess ? Colors.green : Colors.red,
                  ),
                ),
              ),
            ],
          ),
          if (isSuccess && _lastPaymentResult!.transactionId != null) ...[
            SizedBox(height: 12.h),
            Text(
              'ID Transacción: ${_lastPaymentResult!.transactionId}',
              style: TextStyle(
                fontSize: 14.sp,
                color: Theme.of(context).colorScheme.onSurface.withOpacity(0.7),
              ),
            ),
          ],
          if (!isSuccess && _lastPaymentResult!.error != null) ...[
            SizedBox(height: 12.h),
            Text(
              _lastPaymentResult!.error!,
              style: TextStyle(
                fontSize: 14.sp,
                color: Colors.red.withOpacity(0.8),
              ),
            ),
          ],
        ],
      ),
    ).animate().fadeIn(
      duration: 300.ms,
      curve: Curves.easeOut,
    );
  }

  Widget _buildFeatures() {
    final features = [
      '✅ Acceso ilimitado fuera del gym',
      '✅ Rutinas personalizadas IA',
      '✅ Chat con entrenador virtual',
      '✅ Música y podcasts motivacionales',
      '✅ Seguimiento de progreso avanzado',
      '✅ Desafíos y competiciones',
      '✅ Sin anuncios',
      '✅ Soporte prioritario 24/7',
    ];

    return PremiumCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Todo lo que obtienes:',
            style: TextStyle(
              fontSize: 20.sp,
              fontWeight: FontWeight.bold,
              color: Theme.of(context).colorScheme.onSurface,
            ),
          ),
          SizedBox(height: 16.h),
          ...features.map((feature) => Padding(
            padding: EdgeInsets.only(bottom: 12.h),
            child: Row(
              children: [
                Text(
                  feature,
                  style: TextStyle(
                    fontSize: 16.sp,
                    color: Theme.of(context).colorScheme.onSurface.withOpacity(0.8),
                  ),
                ),
              ],
            ),
          )),
        ],
      ),
    ).animate().fadeIn(
      duration: 1600.ms,
      curve: Curves.easeOut,
    ).slideY(
      begin: 0.2,
      end: 0,
      duration: 1600.ms,
      curve: Curves.easeOut,
    );
  }

  Future<void> _processPayment() async {
    final email = _emailController.text.trim();

    if (email.isEmpty) {
      _showErrorSnackBar('Por favor ingresa tu email');
      return;
    }

    if (!email.contains('@')) {
      _showErrorSnackBar('Por favor ingresa un email válido');
      return;
    }

    setState(() => _isProcessing = true);

    try {
      final result = await _paymentService.purchaseSubscription(
        plan: _selectedPlan,
        email: email,
        userId: null, // En producción sería el ID del usuario autenticado
        simulatePayment: true, // Para demo/testing
      );

      setState(() {
        _isProcessing = false;
        _lastPaymentResult = result;
      });

      if (result.success) {
        _showSuccessSnackBar();
        // Actualizar el estado de acceso
        await _wifiService.simulateSubscription(_selectedPlan, email);

        // Navegar de vuelta después de un delay
        Future.delayed(const Duration(seconds: 3), () {
          if (mounted) {
            Navigator.of(context).pop();
          }
        });
      }
    } catch (e) {
      setState(() => _isProcessing = false);
      _showErrorSnackBar('Error procesando el pago: ${e.toString()}');
    }
  }

  void _showSuccessSnackBar() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.green,
        content: Row(
          children: [
            const Icon(Icons.check_circle, color: Colors.white),
            SizedBox(width: 12.w),
            const Expanded(
              child: Text(
                '¡Suscripción activada exitosamente!',
                style: TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.red,
        content: Row(
          children: [
            const Icon(Icons.error, color: Colors.white),
            SizedBox(width: 12.w),
            Expanded(
              child: Text(
                message,
                style: const TextStyle(color: Colors.white),
              ),
            ),
          ],
        ),
        duration: const Duration(seconds: 3),
      ),
    );
  }
}