"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Trophy, Users, BookOpen, Ticket, Star } from "lucide-react"
import TeamSelector from "@/components/team-selector"
import GameSummary from "@/components/game-summary"
import NextGamePreview from "@/components/next-game-preview"
import TicketGenerator from "@/components/ticket-generator"
import FanCalendar from "@/components/fan-calendar"
import TermDictionary from "@/components/term-dictionary"
import TicketCollection from "@/components/ticket-collection"
import FanCommunity from "@/components/fan-community"

const KBO_TEAMS = [
  { id: "doosan", name: "두산 베어스", color: "#131230", logo: "🐻" },
  { id: "lg", name: "LG 트윈스", color: "#C30452", logo: "⚾" },
  { id: "kia", name: "KIA 타이거즈", color: "#EA0029", logo: "🐅" },
  { id: "samsung", name: "삼성 라이온즈", color: "#074CA1", logo: "🦁" },
  { id: "lotte", name: "롯데 자이언츠", color: "#041E42", logo: "⚡" },
  { id: "ssg", name: "SSG 랜더스", color: "#CE0E2D", logo: "🚀" },
  { id: "hanwha", name: "한화 이글스", color: "#FF6600", logo: "🦅" },
  { id: "kiwoom", name: "키움 히어로즈", color: "#570514", logo: "🦸" },
  { id: "nc", name: "NC 다이노스", color: "#315288", logo: "🦕" },
  { id: "kt", name: "KT 위즈", color: "#000000", logo: "🧙" },
]

export default function HomePage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [showTeamSelector, setShowTeamSelector] = useState(false)
  const [isBeginnerMode, setIsBeginnerMode] = useState(false)

  useEffect(() => {
    const savedTeam = localStorage.getItem("selectedTeam")
    const beginnerMode = localStorage.getItem("beginnerMode") === "true"

    if (savedTeam) {
      setSelectedTeam(savedTeam)
    } else {
      setShowTeamSelector(true)
    }

    setIsBeginnerMode(beginnerMode)
  }, [])

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeam(teamId)
    localStorage.setItem("selectedTeam", teamId)
    setShowTeamSelector(false)
  }

  const selectedTeamData = KBO_TEAMS.find((team) => team.id === selectedTeam)

  if (!selectedTeam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
        <TeamSelector teams={KBO_TEAMS} onSelect={handleTeamSelect} isOpen={true} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">⚾</div>
              <h1 className="text-xl font-bold text-green-800">야구플래닛</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTeamSelector(true)}
                className="flex items-center gap-2"
              >
                {selectedTeamData?.logo} {selectedTeamData?.name}
              </Button>
              <Button
                variant={isBeginnerMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setIsBeginnerMode(!isBeginnerMode)
                  localStorage.setItem("beginnerMode", (!isBeginnerMode).toString())
                }}
              >
                입문자 모드
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="home" className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />홈
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-1">
              <Ticket className="w-4 h-4" />
              티켓
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              캘린더
            </TabsTrigger>
            <TabsTrigger value="dictionary" className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              용어사전
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              커뮤니티
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            {/* Welcome Message */}
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{selectedTeamData?.logo}</div>
                  <div>
                    <h2 className="text-xl font-bold">{selectedTeamData?.name} 팬님, 환영합니다! 🎉</h2>
                    <p className="text-green-100 mt-1">오늘도 우리 팀을 응원해봐요!</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Today's Game Summary */}
            <GameSummary team={selectedTeamData!} isBeginnerMode={isBeginnerMode} />

            {/* Next Game Preview */}
            <NextGamePreview team={selectedTeamData!} isBeginnerMode={isBeginnerMode} />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <TicketGenerator team={selectedTeamData!} />
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <h3 className="font-semibold mb-1">팬 랭킹</h3>
                  <p className="text-sm text-gray-600">이번 달 팬력 순위</p>
                  <Badge variant="secondary" className="mt-2">
                    7위 / 1,234명
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <TicketCollection team={selectedTeamData!} />
          </TabsContent>

          <TabsContent value="calendar">
            <FanCalendar team={selectedTeamData!} />
          </TabsContent>

          <TabsContent value="dictionary">
            <TermDictionary isBeginnerMode={isBeginnerMode} />
          </TabsContent>

          <TabsContent value="community">
            <FanCommunity team={selectedTeamData!} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Team Selector Modal */}
      <Dialog open={showTeamSelector} onOpenChange={setShowTeamSelector}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>좋아하는 팀을 선택해주세요</DialogTitle>
          </DialogHeader>
          <TeamSelector teams={KBO_TEAMS} onSelect={handleTeamSelect} isOpen={false} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
