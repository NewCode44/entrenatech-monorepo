import React, { useState, useEffect } from 'react';
import Card from '@/ui/Card';
import Icon from '@/ui/Icon';
import { GamificationAI, Achievement, Challenge, Leaderboard, MemberStats } from '../services/ai/gamificationAI';

const GamificationPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'challenges' | 'leaderboard'>('stats');
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    setLoading(true);
    try {
      const [statsData, achievementsData, challengesData, leaderboardData] = await Promise.all([
        Promise.resolve(GamificationAI.getMemberStats('current-user')),
        Promise.resolve(GamificationAI.getAchievements('current-user')),
        GamificationAI.generateChallenges(),
        GamificationAI.getLeaderboard('weekly')
      ]);
      setStats(statsData);
      setAchievements(achievementsData);
      setChallenges(challengesData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading gamification:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-700';
      case 'rare': return 'text-blue-400 border-blue-500/50';
      case 'epic': return 'text-purple-400 border-purple-500/50';
      case 'legendary': return 'text-yellow-400 border-yellow-500/50';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-primary/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Icon name="Trophy" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black gradient-text">Gamificación</h2>
              <p className="text-sm text-gray-400">Logros, desafíos y ranking</p>
            </div>
          </div>
          {stats && (
            <div className="text-right">
              <div className="text-3xl font-black gradient-text">Nivel {stats.level}</div>
              <p className="text-sm text-gray-500">{stats.totalPoints.toLocaleString()} puntos</p>
            </div>
          )}
        </div>

        {stats && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progreso al Nivel {stats.level + 1}</span>
              <span className="text-sm font-bold text-white">{stats.currentLevelProgress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                style={{ width: `${stats.currentLevelProgress}%` }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: 'stats', label: 'Stats', icon: 'BarChart' },
          { id: 'achievements', label: 'Logros', icon: 'Award' },
          { id: 'challenges', label: 'Desafíos', icon: 'Target' },
          { id: 'leaderboard', label: 'Ranking', icon: 'Trophy' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Icon name={tab.icon as any} className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="TrendingUp" className="w-5 h-5 text-primary" />
              Tus Estadísticas
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Ranking Global</span>
                <span className="text-xl font-bold text-white">#{stats.rank} <span className="text-sm text-gray-500">/ {stats.totalMembers}</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Logros Desbloqueados</span>
                <span className="text-xl font-bold text-white">{stats.achievements.unlocked} <span className="text-sm text-gray-500">/ {stats.achievements.total}</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Racha Actual</span>
                <span className="text-xl font-bold text-orange-400">{stats.streaks.current} días 🔥</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Mejor Racha</span>
                <span className="text-xl font-bold text-yellow-400">{stats.streaks.longest} días ⭐</span>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Icon name="Flame" className="w-5 h-5 text-orange-500" />
              Racha de Fuego
            </h3>
            <div className="text-center py-6">
              <div className="text-6xl font-black text-orange-400 mb-2">{stats.streaks.current}</div>
              <p className="text-sm text-gray-400 mb-4">Días consecutivos entrenando</p>
              <div className="flex justify-center gap-1">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      i < (stats.streaks.current % 7) ? 'bg-orange-500' : 'bg-gray-800'
                    }`}
                  >
                    {i < (stats.streaks.current % 7) ? '🔥' : ''}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">Esta semana</p>
            </div>
          </Card>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <Card
              key={achievement.id}
              className={`border ${getRarityColor(achievement.rarity)} ${
                achievement.unlocked ? 'bg-gray-900/50' : 'opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-4xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.unlocked ? '🏆' : '🔒'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-white">{achievement.title}</h4>
                    <span className="text-sm font-bold text-primary">{achievement.points}pts</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className={getRarityColor(achievement.rarity)}>{achievement.rarity.toUpperCase()}</span>
                    {!achievement.unlocked && (
                      <span className="text-gray-500">{achievement.progress}%</span>
                    )}
                  </div>
                  {!achievement.unlocked && (
                    <div className="mt-2 w-full bg-gray-700 rounded-full h-1">
                      <div
                        className="bg-primary h-1 rounded-full transition-all"
                        style={{ width: `${achievement.progress}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && (
        <div className="space-y-4">
          {challenges.map(challenge => (
            <Card key={challenge.id} className="border border-primary/30">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{challenge.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(challenge.difficulty)}`}>
                      {challenge.difficulty}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-300">
                      {challenge.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-3">{challenge.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold gradient-text">{challenge.reward.points}</div>
                  <p className="text-xs text-gray-500">puntos</p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Progreso</span>
                  <span className="text-xs font-bold text-white">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                    style={{ width: `${challenge.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Icon name="Users" className="w-3 h-3" />
                  {challenge.participants} participantes
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" className="w-3 h-3" />
                  {new Date(challenge.deadline).toLocaleDateString()}
                </span>
              </div>

              {challenge.reward.prize && (
                <div className="mt-3 p-2 bg-primary/10 border border-primary/30 rounded-lg text-xs text-primary">
                  🎁 Premio: {challenge.reward.prize}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Leaderboard Tab */}
      {activeTab === 'leaderboard' && (
        <Card>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Icon name="Trophy" className="w-5 h-5 text-yellow-500" />
            Top 5 Esta Semana
          </h3>
          <div className="space-y-3">
            {leaderboard.map(member => (
              <div
                key={member.memberId}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                  member.rank <= 3 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30' : 'bg-gray-900/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${
                  member.rank === 1 ? 'bg-yellow-500 text-black' :
                  member.rank === 2 ? 'bg-gray-400 text-black' :
                  member.rank === 3 ? 'bg-orange-600 text-white' :
                  'bg-gray-700 text-gray-400'
                }`}>
                  {member.rank}
                </div>
                <img src={member.avatar} alt={member.memberName} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <h4 className="font-bold text-white">{member.memberName}</h4>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>Nivel {member.level}</span>
                    <span>•</span>
                    <span>{member.badges} logros</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{member.points.toLocaleString()}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {member.trend === 'up' && <Icon name="TrendingUp" className="w-3 h-3 text-green-500" />}
                    {member.trend === 'down' && <Icon name="TrendingDown" className="w-3 h-3 text-red-500" />}
                    {member.trend === 'same' && <Icon name="Minus" className="w-3 h-3 text-gray-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default GamificationPanel;