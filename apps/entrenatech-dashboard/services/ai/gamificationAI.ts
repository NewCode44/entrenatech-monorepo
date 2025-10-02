// Gamification AI - Sistema de logros, puntos y desafíos personalizados

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'attendance' | 'strength' | 'cardio' | 'social' | 'streak' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  progress: number; // 0-100
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'event';
  difficulty: 'easy' | 'medium' | 'hard';
  reward: {
    points: number;
    badge?: string;
    prize?: string;
  };
  deadline: string;
  progress: number; // 0-100
  participants: number;
  completed: boolean;
}

export interface Leaderboard {
  rank: number;
  memberId: string;
  memberName: string;
  avatar: string;
  points: number;
  level: number;
  badges: number;
  trend: 'up' | 'down' | 'same';
}

export interface MemberStats {
  totalPoints: number;
  level: number;
  currentLevelProgress: number; // 0-100
  nextLevelPoints: number;
  rank: number;
  totalMembers: number;
  achievements: {
    unlocked: number;
    total: number;
  };
  streaks: {
    current: number;
    longest: number;
  };
}

export class GamificationAI {
  /**
   * Genera logros personalizados basados en comportamiento del usuario
   */
  static getAchievements(memberId?: string): Achievement[] {
    return [
      {
        id: 'first-workout',
        title: 'Primer Entreno',
        description: 'Completa tu primera sesión de entrenamiento',
        icon: 'Dumbbell',
        category: 'attendance',
        rarity: 'common',
        points: 10,
        progress: 100,
        unlocked: true,
        unlockedAt: '2024-01-15',
        requirement: '1 entrenamiento'
      },
      {
        id: 'week-warrior',
        title: 'Guerrero Semanal',
        description: 'Entrena 5 días en una semana',
        icon: 'Award',
        category: 'attendance',
        rarity: 'rare',
        points: 50,
        progress: 80,
        unlocked: false,
        requirement: '5 días en 1 semana'
      },
      {
        id: 'early-bird',
        title: 'Madrugador',
        description: 'Entrena antes de las 7 AM durante 10 días',
        icon: 'Sunrise',
        category: 'attendance',
        rarity: 'rare',
        points: 75,
        progress: 60,
        unlocked: false,
        requirement: '10 entrenamientos antes de 7 AM'
      },
      {
        id: 'strength-master',
        title: 'Maestro de Fuerza',
        description: 'Aumenta tu peso en press de banca en 20kg',
        icon: 'TrendingUp',
        category: 'strength',
        rarity: 'epic',
        points: 100,
        progress: 45,
        unlocked: false,
        requirement: '+20kg en press de banca'
      },
      {
        id: 'cardio-king',
        title: 'Rey del Cardio',
        description: 'Corre 100km acumulados',
        icon: 'Activity',
        category: 'cardio',
        rarity: 'epic',
        points: 150,
        progress: 67,
        unlocked: false,
        requirement: '100km corridos'
      },
      {
        id: 'social-butterfly',
        title: 'Mariposa Social',
        description: 'Invita a 5 amigos al gym',
        icon: 'Users',
        category: 'social',
        rarity: 'rare',
        points: 200,
        progress: 40,
        unlocked: false,
        requirement: '5 referidos'
      },
      {
        id: 'fire-streak',
        title: 'Racha de Fuego',
        description: 'Mantén una racha de 30 días consecutivos',
        icon: 'Flame',
        category: 'streak',
        rarity: 'legendary',
        points: 500,
        progress: 73,
        unlocked: false,
        requirement: '30 días consecutivos'
      },
      {
        id: 'class-enthusiast',
        title: 'Fanático de Clases',
        description: 'Asiste a 50 clases grupales',
        icon: 'Users',
        category: 'attendance',
        rarity: 'epic',
        points: 120,
        progress: 84,
        unlocked: false,
        requirement: '50 clases grupales'
      },
      {
        id: 'legend',
        title: 'Leyenda del Gym',
        description: 'Alcanza 10,000 puntos totales',
        icon: 'Trophy',
        category: 'special',
        rarity: 'legendary',
        points: 1000,
        progress: 35,
        unlocked: false,
        requirement: '10,000 puntos'
      }
    ];
  }

  /**
   * Genera desafíos personalizados con IA
   */
  static async generateChallenges(userProfile?: any): Promise<Challenge[]> {
    await new Promise(resolve => setTimeout(resolve, 700));

    return [
      {
        id: 'daily-steps',
        title: 'Camina 10,000 Pasos',
        description: 'Completa 10,000 pasos hoy. ¡Mantente activo!',
        type: 'daily',
        difficulty: 'easy',
        reward: {
          points: 20,
          badge: '🚶'
        },
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        progress: 65,
        participants: 45,
        completed: false
      },
      {
        id: 'weekly-cardio',
        title: 'Desafío Cardio Semanal',
        description: 'Completa 3 sesiones de cardio de 30 min esta semana',
        type: 'weekly',
        difficulty: 'medium',
        reward: {
          points: 100,
          badge: '❤️',
          prize: 'Smoothie gratis'
        },
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 33,
        participants: 28,
        completed: false
      },
      {
        id: 'monthly-strength',
        title: 'Mes de la Fuerza',
        description: 'Incrementa tu 1RM en cualquier levantamiento principal',
        type: 'monthly',
        difficulty: 'hard',
        reward: {
          points: 500,
          badge: '💪',
          prize: '1 mes gratis de suplementos'
        },
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 15,
        participants: 67,
        completed: false
      },
      {
        id: 'event-transformation',
        title: 'Transformación 90 Días',
        description: 'Completa programa de transformación de 90 días',
        type: 'event',
        difficulty: 'hard',
        reward: {
          points: 2000,
          badge: '⭐',
          prize: '3 meses gratis + sesión con nutricionista'
        },
        deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 42,
        participants: 156,
        completed: false
      }
    ];
  }

  /**
   * Genera leaderboard con ranking inteligente
   */
  static async getLeaderboard(period: 'daily' | 'weekly' | 'monthly' | 'alltime' = 'weekly'): Promise<Leaderboard[]> {
    await new Promise(resolve => setTimeout(resolve, 500));

    return [
      {
        rank: 1,
        memberId: 'M042',
        memberName: 'Carlos "The Beast" Ramírez',
        avatar: 'https://i.pravatar.cc/40?u=m042',
        points: 2850,
        level: 12,
        badges: 34,
        trend: 'same'
      },
      {
        rank: 2,
        memberId: 'M031',
        memberName: 'María "Iron Lady" González',
        avatar: 'https://i.pravatar.cc/40?u=m031',
        points: 2720,
        level: 11,
        badges: 31,
        trend: 'up'
      },
      {
        rank: 3,
        memberId: 'M089',
        memberName: 'Luis "Lightning" Méndez',
        avatar: 'https://i.pravatar.cc/40?u=m089',
        points: 2650,
        level: 11,
        badges: 29,
        trend: 'down'
      },
      {
        rank: 4,
        memberId: 'M012',
        memberName: 'Ana "Warrior" Torres',
        avatar: 'https://i.pravatar.cc/40?u=m012',
        points: 2480,
        level: 10,
        badges: 27,
        trend: 'up'
      },
      {
        rank: 5,
        memberId: 'M067',
        memberName: 'Roberto "Titan" Díaz',
        avatar: 'https://i.pravatar.cc/40?u=m067',
        points: 2340,
        level: 10,
        badges: 25,
        trend: 'same'
      }
    ];
  }

  /**
   * Obtiene stats de gamificación del miembro
   */
  static getMemberStats(memberId: string): MemberStats {
    return {
      totalPoints: 1850,
      level: 8,
      currentLevelProgress: 65,
      nextLevelPoints: 2000,
      rank: 12,
      totalMembers: 248,
      achievements: {
        unlocked: 15,
        total: 42
      },
      streaks: {
        current: 22,
        longest: 45
      }
    };
  }

  /**
   * Calcula puntos ganados por actividad con IA
   */
  static calculatePoints(activity: {
    type: 'workout' | 'class' | 'referral' | 'checkin' | 'achievement';
    duration?: number; // minutos
    intensity?: 'low' | 'medium' | 'high';
    metadata?: any;
  }): { points: number; multiplier: number; bonus: string[] } {
    let basePoints = 0;
    let multiplier = 1;
    const bonus: string[] = [];

    switch (activity.type) {
      case 'workout':
        basePoints = 10;
        if (activity.duration) {
          basePoints += Math.floor(activity.duration / 10); // +1 punto cada 10 min
        }
        if (activity.intensity === 'high') {
          multiplier = 1.5;
          bonus.push('Alta intensidad +50%');
        }
        break;
      case 'class':
        basePoints = 25;
        bonus.push('Clase grupal');
        break;
      case 'referral':
        basePoints = 200;
        bonus.push('¡Nuevo miembro referido!');
        break;
      case 'checkin':
        basePoints = 5;
        break;
      case 'achievement':
        basePoints = activity.metadata?.points || 50;
        break;
    }

    return {
      points: Math.round(basePoints * multiplier),
      multiplier,
      bonus
    };
  }

  /**
   * Genera recomendaciones personalizadas de gamificación
   */
  static async getPersonalizedSuggestions(memberId: string): Promise<{
    nextAchievements: Achievement[];
    recommendedChallenges: Challenge[];
    motivationalMessage: string;
  }> {
    await new Promise(resolve => setTimeout(resolve, 600));

    const achievements = this.getAchievements(memberId);
    const nextAchievements = achievements
      .filter(a => !a.unlocked && a.progress > 30)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 3);

    const challenges = await this.generateChallenges();
    const recommendedChallenges = challenges
      .filter(c => !c.completed && c.difficulty !== 'hard')
      .slice(0, 2);

    const motivationalMessage = `¡Estás a solo ${100 - nextAchievements[0]?.progress}% de desbloquear "${nextAchievements[0]?.title}"! 🔥 Sigue así.`;

    return {
      nextAchievements,
      recommendedChallenges,
      motivationalMessage
    };
  }

  /**
   * Detecta hitos importantes automáticamente
   */
  static detectMilestone(activity: any): {
    isMilestone: boolean;
    title?: string;
    description?: string;
    reward?: number;
  } {
    // Ejemplo: detectar si es el workout #100
    if (activity.totalWorkouts === 100) {
      return {
        isMilestone: true,
        title: '¡100 Entrenamientos!',
        description: 'Has completado 100 entrenamientos. ¡Eres imparable!',
        reward: 500
      };
    }

    // Detectar racha de 7 días
    if (activity.streak === 7) {
      return {
        isMilestone: true,
        title: '¡Semana Perfecta!',
        description: '7 días seguidos entrenando. Increíble consistencia.',
        reward: 100
      };
    }

    return { isMilestone: false };
  }
}