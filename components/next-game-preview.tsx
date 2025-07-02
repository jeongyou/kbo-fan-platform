"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Vote } from "lucide-react"
import { useState } from "react"

interface Team {
  id: string
  name: string
  color: string
  logo: string
}

interface NextGamePreviewProps {
  team: Team
  isBeginnerMode: boolean
}

export default function NextGamePreview({ team, isBeginnerMode }: NextGamePreviewProps) {
  const [userVote, setUserVote] = useState<"win" | "lose" | null>(null)

  // Mock next game data
  const nextGame = {
    date: "2025.07.25",
    time: "14:00",
    opponent: "KIA 타이거즈",
    opponentLogo: "🐅",
    stadium: "광주-KIA 챔피언스 필드",
    startingPitcher: {
      our: { name: "박성우", era: "3.24", record: "2승 1패" },
      opponent: { name: "김동진", era: "2.89", record: "3승 0패" },
    },
    recentRecord: {
      our: ["승", "승", "패", "승", "패"],
      opponent: ["승", "패", "승", "승", "승"],
    },
    prediction: {
      win: 67,
      lose: 33,
    },
  }

  const handleVote = (vote: "win" | "lose") => {
    setUserVote(vote)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          다음 경기 미리보기
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Game Info */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="text-center">
              <div className="text-2xl mb-1">{team.logo}</div>
              <div className="text-sm font-medium">{team.name}</div>
            </div>
            <div className="text-xl text-gray-400">VS</div>
            <div className="text-center">
              <div className="text-2xl mb-1">{nextGame.opponentLogo}</div>
              <div className="text-sm font-medium">{nextGame.opponent}</div>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {nextGame.date} {nextGame.time}
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-1">
            <MapPin className="w-3 h-3" />
            {nextGame.stadium}
          </div>
        </div>

        {/* Starting Pitchers */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3 text-center">선발 투수 비교</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="font-medium">{nextGame.startingPitcher.our.name}</div>
              <div className="text-sm text-gray-600">평균자책점 {nextGame.startingPitcher.our.era}</div>
              <div className="text-sm text-gray-600">{nextGame.startingPitcher.our.record}</div>
            </div>
            <div className="text-center">
              <div className="font-medium">{nextGame.startingPitcher.opponent.name}</div>
              <div className="text-sm text-gray-600">평균자책점 {nextGame.startingPitcher.opponent.era}</div>
              <div className="text-sm text-gray-600">{nextGame.startingPitcher.opponent.record}</div>
            </div>
          </div>
        </div>

        {/* Recent Record */}
        <div>
          <h4 className="font-semibold mb-2">최근 5경기 성적</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600 mb-1">{team.name}</div>
              <div className="flex gap-1">
                {nextGame.recentRecord.our.map((result, index) => (
                  <Badge
                    key={index}
                    variant={result === "승" ? "default" : "secondary"}
                    className={result === "승" ? "bg-green-500" : "bg-red-500"}
                  >
                    {result}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">{nextGame.opponent}</div>
              <div className="flex gap-1">
                {nextGame.recentRecord.opponent.map((result, index) => (
                  <Badge
                    key={index}
                    variant={result === "승" ? "default" : "secondary"}
                    className={result === "승" ? "bg-green-500" : "bg-red-500"}
                  >
                    {result}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fan Prediction */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Vote className="w-4 h-4" />
            <span className="font-semibold">팬 승부 예측</span>
          </div>

          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>승리 예상</span>
              <span>{nextGame.prediction.win}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${nextGame.prediction.win}%` }}></div>
            </div>
          </div>

          {!userVote ? (
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600" onClick={() => handleVote("win")}>
                승리 예측
              </Button>
              <Button size="sm" variant="outline" className="flex-1 bg-transparent" onClick={() => handleVote("lose")}>
                패배 예측
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Badge variant="secondary">{userVote === "win" ? "승리" : "패배"} 예측 완료!</Badge>
            </div>
          )}
        </div>

        {isBeginnerMode && (
          <div className="bg-yellow-50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="text-lg">💡</div>
              <div className="text-sm">
                <div className="font-medium text-yellow-800 mb-1">입문자 팁</div>
                <p className="text-yellow-700">
                  평균자책점(ERA)이 낮을수록 좋은 투수예요. 선발 투수의 컨디션이 경기 결과에 큰 영향을 미칩니다!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
