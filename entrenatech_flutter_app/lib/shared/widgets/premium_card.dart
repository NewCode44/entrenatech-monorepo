import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../core/models/access_models.dart';

class PremiumCard extends StatelessWidget {
  final Widget child;
  final Gradient? gradient;
  final BorderRadius? borderRadius;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final VoidCallback? onTap;
  final bool isAnimated;

  const PremiumCard({
    super.key,
    required this.child,
    this.gradient,
    this.borderRadius,
    this.padding,
    this.margin,
    this.onTap,
    this.isAnimated = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final defaultGradient = gradient ?? LinearGradient(
      colors: [
        Colors.white.withOpacity(0.1),
        Colors.white.withOpacity(0.05),
      ],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    );

    final defaultBorderRadius = borderRadius ?? BorderRadius.circular(16.r);
    final defaultPadding = padding ?? EdgeInsets.all(16.w);
    final defaultMargin = margin ?? EdgeInsets.zero;

    Widget card = Container(
      margin: defaultMargin,
      decoration: BoxDecoration(
        gradient: defaultGradient,
        borderRadius: defaultBorderRadius,
        border: Border.all(
          color: Colors.white.withOpacity(0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: defaultPadding,
        child: child,
      ),
    );

    if (onTap != null) {
      card = Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: defaultBorderRadius,
          onTap: onTap,
          child: card,
        ),
      );
    }

    if (isAnimated) {
      card = card.animate().fadeIn(
        duration: 300.ms,
        curve: Curves.easeInOut,
      ).slideY(
        begin: 0.1,
        end: 0,
        duration: 300.ms,
        curve: Curves.easeOut,
      );
    }

    return card;
  }
}

class GradientButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final Gradient? gradient;
  final Color? textColor;
  final double? height;
  final double? width;
  final BorderRadius? borderRadius;
  final bool isLoading;
  final IconData? icon;
  final EdgeInsetsGeometry? padding;

  const GradientButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.gradient,
    this.textColor,
    this.height,
    this.width,
    this.borderRadius,
    this.isLoading = false,
    this.icon,
    this.padding,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    final defaultGradient = gradient ?? LinearGradient(
      colors: [
        const Color(0xFF4F46E5), // Indigo
        const Color(0xFF7C3AED), // Purple
      ],
      begin: Alignment.centerLeft,
      end: Alignment.centerRight,
    );

    final defaultTextColor = textColor ?? Colors.white;
    final defaultHeight = height ?? 56.h;
    final defaultBorderRadius = borderRadius ?? BorderRadius.circular(12.r);
    final defaultPadding = padding ?? EdgeInsets.symmetric(horizontal: 24.w, vertical: 16.h);

    Widget buttonChild;

    if (isLoading) {
      buttonChild = Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          SizedBox(
            width: 20.w,
            height: 20.w,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation<Color>(defaultTextColor),
            ),
          ),
          SizedBox(width: 12.w),
          Text(
            'Procesando...',
            style: TextStyle(
              color: defaultTextColor,
              fontSize: 16.sp,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      );
    } else {
      buttonChild = Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (icon != null) ...[
            Icon(icon, color: defaultTextColor, size: 20.w),
            SizedBox(width: 8.w),
          ],
          Text(
            text,
            style: TextStyle(
              color: defaultTextColor,
              fontSize: 16.sp,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      );
    }

    return Container(
      width: width,
      height: defaultHeight,
      decoration: BoxDecoration(
        gradient: defaultGradient,
        borderRadius: defaultBorderRadius,
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4F46E5).withOpacity(0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: defaultBorderRadius,
          onTap: isLoading ? null : onPressed,
          child: Padding(
            padding: defaultPadding,
            child: Center(child: buttonChild),
          ),
        ),
      ),
    ).animate().fadeIn(
      duration: 400.ms,
      curve: Curves.easeInOut,
    ).scale(
      begin: const Offset(0.95, 0.95),
      end: const Offset(1.0, 1.0),
      duration: 400.ms,
      curve: Curves.elasticOut,
    );
  }
}

class StatusIndicator extends StatelessWidget {
  final AccessMode accessMode;
  final String message;
  final double? size;

  const StatusIndicator({
    super.key,
    required this.accessMode,
    required this.message,
    this.size,
  });

  @override
  Widget build(BuildContext context) {
    final icon = _getAccessModeIcon();
    final color = _getAccessModeColor();
    final defaultSize = size ?? 24.w;

    return Row(
      children: [
        Icon(
          icon,
          color: color,
          size: defaultSize,
        ).animate().scale(
          duration: 600.ms,
          curve: Curves.elasticOut,
        ),
        SizedBox(width: 12.w),
        Expanded(
          child: Text(
            message,
            style: TextStyle(
              color: color,
              fontWeight: FontWeight.w600,
              fontSize: 14.sp,
            ),
          ),
        ),
      ],
    );
  }

  IconData _getAccessModeIcon() {
    if (accessMode == AccessMode.free) {
      return Icons.wifi_rounded;
    } else if (accessMode == AccessMode.premium) {
      return Icons.diamond_rounded;
    } else if (accessMode == AccessMode.trial) {
      return Icons.timer_rounded;
    } else {
      return Icons.lock_rounded;
    }
  }

  Color _getAccessModeColor() {
    if (accessMode == AccessMode.free) {
      return const Color(0xFF10B981); // Green
    } else if (accessMode == AccessMode.premium) {
      return const Color(0xFFF59E0B); // Amber
    } else if (accessMode == AccessMode.trial) {
      return const Color(0xFF3B82F6); // Blue
    } else {
      return const Color(0xFFEF4444); // Red
    }
  }
}

class FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final Color? iconColor;
  final bool isAvailable;

  const FeatureCard({
    super.key,
    required this.icon,
    required this.title,
    required this.description,
    this.iconColor,
    this.isAvailable = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final effectiveIconColor = iconColor ?? theme.primaryColor;

    return PremiumCard(
      padding: EdgeInsets.all(16.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(12.w),
                decoration: BoxDecoration(
                  color: effectiveIconColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12.r),
                ),
                child: Icon(
                  icon,
                  color: isAvailable ? effectiveIconColor : Colors.grey,
                  size: 24.w,
                ),
              ),
              const Spacer(),
              if (!isAvailable)
                Icon(
                  Icons.lock_outline,
                  color: Colors.grey,
                  size: 20.w,
                ),
            ],
          ),
          SizedBox(height: 16.h),
          Text(
            title,
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.bold,
              color: isAvailable ? theme.colorScheme.onSurface : Colors.grey,
            ),
          ),
          SizedBox(height: 8.h),
          Text(
            description,
            style: TextStyle(
              fontSize: 14.sp,
              color: isAvailable
                  ? theme.colorScheme.onSurface.withOpacity(0.7)
                  : Colors.grey.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }
}

