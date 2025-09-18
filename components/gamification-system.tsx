"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Gift, Target, Zap, Crown } from "lucide-react"

interface UserStats {
  level: number
  points: number
  pointsToNextLevel: number
  totalOrders: number
  streak: number
  badges: string[]
}

export default function GamificationSystem() {
  const [userStats] = useState<UserStats>({
    level: 3,
    points: 1250,
    pointsToNextLevel: 750,
    totalOrders: 24,
    streak: 7,
    badges: ["Eco Warrior", "Frequent Customer", "Quality Lover"],
  })

  const challenges = [
    {
      id: 1,
      title: "3 lavadas = cupón extra",
      description: "Completa 3 pedidos esta semana",
      progress: 2,
      target: 3,
      reward: "Cupón 15% descuento",
      icon: Target,
    },
    {
      id: 2,
      title: "Eco Challenge",
      description: "Usa servicios eco-friendly 5 veces",
      progress: 3,
      target: 5,
      reward: "Badge Eco Master",
      icon: Zap,
    },
  ]

  const achievements = [
    {
      name: "Eco Warrior",
      description: "10 servicios eco-friendly",
      icon: "🌱",
      earned: true,
    },
    {
      name: "Frequent Customer",
      description: "20+ pedidos completados",
      icon: "⭐",
      earned: true,
    },
    {
      name: "Quality Lover",
      description: "Siempre elige servicios premium",
      icon: "👑",
      earned: true,
    },
    {
      name: "Speed Demon",
      description: "5 pedidos express",
      icon: "⚡",
      earned: false,
    },
  ]

  const levelProgress = (userStats.points / (userStats.points + userStats.pointsToNextLevel)) * 100

  return (
    <div className="space-y-6">
      {/* Level & Points */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Nivel {userStats.level}</h3>
              <p className="text-slate-600 dark:text-slate-300">{userStats.points} puntos</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">VIP Member</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-300">Progreso al Nivel {userStats.level + 1}</span>
            <span className="text-slate-600 dark:text-slate-300">{userStats.pointsToNextLevel} puntos restantes</span>
          </div>
          <Progress value={levelProgress} className="h-3" />
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <Trophy className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-slate-800 dark:text-white">{userStats.totalOrders}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">Pedidos</div>
        </Card>

        <Card className="p-4 text-center">
          <Star className="h-6 w-6 text-orange-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-slate-800 dark:text-white">{userStats.streak}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">Días seguidos</div>
        </Card>

        <Card className="p-4 text-center">
          <Gift className="h-6 w-6 text-green-500 mx-auto mb-2" />
          <div className="text-lg font-bold text-slate-800 dark:text-white">{userStats.badges.length}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">Insignias</div>
        </Card>
      </div>

      {/* Active Challenges */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Desafíos Activos</h3>
        <div className="space-y-4">
          {challenges.map((challenge) => {
            const IconComponent = challenge.icon
            const progressPercentage = (challenge.progress / challenge.target) * 100

            return (
              <div key={challenge.id} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <IconComponent className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-800 dark:text-white">{challenge.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{challenge.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {challenge.reward}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-300">
                      Progreso: {challenge.progress}/{challenge.target}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Achievements */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Logros</h3>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border-2 ${
                achievement.earned
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                  : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h4
                  className={`font-medium text-sm ${
                    achievement.earned ? "text-green-800 dark:text-green-200" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {achievement.name}
                </h4>
                <p
                  className={`text-xs ${
                    achievement.earned ? "text-green-600 dark:text-green-300" : "text-slate-500 dark:text-slate-500"
                  }`}
                >
                  {achievement.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Leaderboard Preview */}
      <Card className="p-6">
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">Ranking Semanal</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Ana Torres</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">2,450 puntos</p>
              </div>
            </div>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <p className="font-medium text-slate-800 dark:text-white">Tú (María)</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">1,250 puntos</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">+2 posiciones</Badge>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-4 bg-transparent">
          Ver Ranking Completo
        </Button>
      </Card>
    </div>
  )
}
