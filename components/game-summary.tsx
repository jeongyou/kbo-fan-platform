"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingUp, Share2, Info } from "lucide-react"
import { useState } from "react"
import TermTooltip from "./term-tooltip"

interface Team {
  id: string
  name: string
  color: string
  logo: string
}

interface GameSummaryProps {
  team: Team
  isBeginnerMode: boolean
}

export default function GameSummary({ team, isBeginnerMode }: GameSummaryProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Mock game data
  const gameData = {
    date: "2025.07.15",
    opponent: "LG 트윈스",
    opponentLogo: "⚾",
    score: { home: 7, away: 4 },
    result: "WIN",
    stadium: "잠실야구장",
    highlights: [
      "3회초 김민수의 2점 홈런으로 역전!",
      "7회말 박준호의 결승 타점으로 승부 결정",
      "마무리 투수 이성민 완벽 마무리",
    ],
    mvp: {
      name: "김민수",
      position: "외야수",
      stats: "3타수 2안타 2타점 1홈런",
    },
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            오늘의 경기 요약
          </div>
          <Badge variant="secondary" className="bg-white text-green-600">
            {gameData.result === "WIN" ? "승리" : "패배"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {/* Score Display */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl mb-1">{team.logo}</div>
              <div className="text-sm text-gray-600">{team.name}</div>
              <div className="text-3xl font-bold text-green-600">{gameData.score.home}</div>
            </div>
            <div className="text-2xl text-gray-400">VS</div>
            <div className="text-center">
              <div className="text-2xl mb-1">{gameData.opponentLogo}</div>
              <div className="text-sm text-gray-600">{gameData.opponent}</div>
              <div className="text-3xl font-bold text-gray-600">{gameData.score.away}</div>
            </div>
          </div>
        </div>

        {/* Game Info */}
        <div className="text-center text-sm text-gray-600 mb-4">
          {gameData.date} · {gameData.stadium}
        </div>

        {/* Highlights */}
        <div className="space-y-2 mb-4">
          <h4 className="font-semibold text-gray-800">🔥 주요 하이라이트</h4>
          {gameData.highlights.map((highlight, index) => (
            <div key={index} className="text-sm text-gray-700 pl-4 border-l-2 border-green-200">
              {isBeginnerMode ? <TermTooltip text={highlight} terms={["홈런", "타점", "마무리 투수"]} /> : highlight}
            </div>
          ))}
        </div>

        {/* MVP */}
        <div className="bg-yellow-50 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-lg">🏆</div>
            <span className="font-semibold text-yellow-800">오늘의 MVP</span>
          </div>
          <div className="text-sm">
            <div className="font-medium">
              {gameData.mvp.name} ({gameData.mvp.position})
            </div>
            <div className="text-gray-600">{gameData.mvp.stats}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1 bg-transparent">
            <Share2 className="w-4 h-4 mr-1" />
            공유하기
          </Button>
          <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
            <Info className="w-4 h-4 mr-1" />
            상세보기
          </Button>
        </div>

        {showDetails && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              <p className="mb-2">• 관중: 15,432명</p>
              <p className="mb-2">• 경기시간: 3시간 12분</p>
              <p>• 날씨: 맑음, 기온 18°C</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
