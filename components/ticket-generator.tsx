"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Ticket, Download, Share2, Clock, MapPin, Tv } from "lucide-react"
import { useState, useEffect } from "react"

interface Team {
  id: string
  name: string
  color: string
  logo: string
}

interface TicketGeneratorProps {
  team: Team
}

interface GameSchedule {
  id: string
  date: string
  startTime: string
  endTime: string
  homeTeam: string
  awayTeam: string
  stadium: string
  status: "scheduled" | "live" | "finished"
}

const TEAM_DESIGNS = {
  doosan: {
    primary: "#131230",
    secondary: "#1a1a3a",
    accent: "#ffd700",
    pattern: "navy-stripes",
    nickname: "Bears",
  },
  lg: {
    primary: "#C30452",
    secondary: "#e91e63",
    accent: "#ffffff",
    pattern: "twins-diamond",
    nickname: "Twins",
  },
  kia: {
    primary: "#EA0029",
    secondary: "#ff1744",
    accent: "#000000",
    pattern: "tiger-stripes",
    nickname: "Tigers",
  },
  samsung: {
    primary: "#074CA1",
    secondary: "#1976d2",
    accent: "#ffffff",
    pattern: "lion-mane",
    nickname: "Lions",
  },
  lotte: {
    primary: "#041E42",
    secondary: "#1565c0",
    accent: "#ffd700",
    pattern: "giant-waves",
    nickname: "Giants",
  },
  ssg: {
    primary: "#CE0E2D",
    secondary: "#d32f2f",
    accent: "#ffffff",
    pattern: "landers-grid",
    nickname: "Landers",
  },
  hanwha: {
    primary: "#FF6600",
    secondary: "#ff9800",
    accent: "#000000",
    pattern: "eagle-wings",
    nickname: "Eagles",
  },
  kiwoom: {
    primary: "#570514",
    secondary: "#8d1e2d",
    accent: "#ffd700",
    pattern: "hero-shield",
    nickname: "Heroes",
  },
  nc: {
    primary: "#315288",
    secondary: "#5472d3",
    accent: "#ffffff",
    pattern: "dino-scales",
    nickname: "Dinos",
  },
  kt: {
    primary: "#000000",
    secondary: "#424242",
    accent: "#ffd700",
    pattern: "wiz-magic",
    nickname: "Wiz",
  },
}

export default function TicketGenerator({ team }: TicketGeneratorProps) {
  const [showTicket, setShowTicket] = useState(false)
  const [ticketType, setTicketType] = useState<"attendance" | "tv" | null>(null)
  const [currentGame, setCurrentGame] = useState<GameSchedule | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  // Mock game schedule - 실제로는 API에서 가져올 데이터
  const todayGames: GameSchedule[] = [
    {
      id: "game1",
      date: new Date().toISOString().split("T")[0],
      startTime: "14:00",
      endTime: "17:00",
      homeTeam: team.id,
      awayTeam: "lg",
      stadium: "잠실야구장",
      status: "live",
    },
    {
      id: "game2",
      date: new Date().toISOString().split("T")[0],
      startTime: "18:30",
      endTime: "21:30",
      homeTeam: "kia",
      awayTeam: team.id,
      stadium: "광주-KIA 챔피언스 필드",
      status: "scheduled",
    },
  ]

  useEffect(() => {
    const checkGameStatus = () => {
      const now = new Date()
      const currentTime = now.getHours() * 60 + now.getMinutes()

      // 테스트를 위해 현재 시간 기준으로 가상의 경기 생성
      const testGame: GameSchedule = {
        id: "test-game",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00", // 오전 9시부터
        endTime: "23:59", // 밤 11시 59분까지 (테스트용)
        homeTeam: team.id,
        awayTeam: "lg",
        stadium: "잠실야구장",
        status: "live",
      }

      // 현재 시간이 9시~23시59분 사이면 경기 중으로 처리
      if (currentTime >= 540 && currentTime <= 1439) {
        // 9:00 ~ 23:59
        setCurrentGame(testGame)

        const endTime = new Date()
        endTime.setHours(23, 59, 0, 0)

        const remaining = endTime.getTime() - now.getTime()
        if (remaining > 0) {
          const hours = Math.floor(remaining / (1000 * 60 * 60))
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
          setTimeRemaining(`${hours}시간 ${minutes}분`)
        } else {
          setTimeRemaining("종료")
        }
      } else {
        setCurrentGame(null)
        setTimeRemaining("")
      }
    }

    checkGameStatus()
    const interval = setInterval(checkGameStatus, 60000) // 1분마다 체크

    return () => clearInterval(interval)
  }, [team.id])

  const generateTicket = (type: "attendance" | "tv") => {
    console.log("티켓 발급 시작:", type, currentGame)

    if (!currentGame) {
      console.log("현재 경기가 없습니다")
      return
    }

    setTicketType(type)
    setShowTicket(true)

    // Save ticket to localStorage
    const tickets = JSON.parse(localStorage.getItem("fanTickets") || "[]")
    const newTicket = {
      id: Date.now(),
      type,
      team: team.id,
      date: new Date().toISOString().split("T")[0],
      gameId: currentGame.id,
      opponent: currentGame.homeTeam === team.id ? currentGame.awayTeam : currentGame.homeTeam,
      stadium: currentGame.stadium,
      createdAt: new Date().toISOString(),
    }

    console.log("새 티켓 생성:", newTicket)

    tickets.push(newTicket)
    localStorage.setItem("fanTickets", JSON.stringify(tickets))

    // Add to calendar
    const calendarEntries = JSON.parse(localStorage.getItem(`fanCalendar_${team.id}`) || "[]")
    const calendarEntry = {
      id: Date.now() + 1,
      date: new Date().toISOString().split("T")[0],
      type: "ticket",
      title: type === "attendance" ? "직관 티켓 발급" : "TV 시청 티켓 발급",
      content: `${currentGame.stadium}에서 경기 ${type === "attendance" ? "직관" : "TV 시청"}`,
      emotion: "excited",
      ticketId: newTicket.id,
    }

    console.log("캘린더 엔트리 생성:", calendarEntry)

    calendarEntries.push(calendarEntry)
    localStorage.setItem(`fanCalendar_${team.id}`, JSON.stringify(calendarEntries))

    console.log("티켓 발급 완료")
  }

  const downloadTicket = () => {
    alert("티켓 이미지가 다운로드됩니다!")
  }

  const shareTicket = () => {
    alert("티켓을 SNS에 공유합니다!")
  }

  const getOpponentInfo = (opponentId: string) => {
    const teams = {
      lg: { name: "LG 트윈스", logo: "⚾" },
      kia: { name: "KIA 타이거즈", logo: "🐅" },
      samsung: { name: "삼성 라이온즈", logo: "🦁" },
      // ... 다른 팀들
    }
    return teams[opponentId as keyof typeof teams] || { name: "상대팀", logo: "⚾" }
  }

  const getTeamDesign = (teamId: string) => {
    return TEAM_DESIGNS[teamId as keyof typeof TEAM_DESIGNS] || TEAM_DESIGNS.doosan
  }

  const getPatternStyle = (pattern: string, primary: string, secondary: string) => {
    switch (pattern) {
      case "navy-stripes":
        return {
          backgroundImage: `repeating-linear-gradient(45deg, ${primary}, ${primary} 10px, ${secondary} 10px, ${secondary} 20px)`,
        }
      case "twins-diamond":
        return {
          backgroundImage: `repeating-conic-gradient(from 45deg, ${primary} 0deg 90deg, ${secondary} 90deg 180deg)`,
        }
      case "tiger-stripes":
        return {
          backgroundImage: `repeating-linear-gradient(90deg, ${primary}, ${primary} 8px, ${secondary} 8px, ${secondary} 16px)`,
        }
      case "lion-mane":
        return {
          backgroundImage: `radial-gradient(circle at center, ${primary} 30%, ${secondary} 70%)`,
        }
      case "giant-waves":
        return {
          backgroundImage: `repeating-linear-gradient(135deg, ${primary} 0px, ${secondary} 15px, ${primary} 30px)`,
        }
      case "landers-grid":
        return {
          backgroundImage: `repeating-linear-gradient(0deg, ${primary}, ${primary} 5px, ${secondary} 5px, ${secondary} 10px),
                           repeating-linear-gradient(90deg, ${primary}, ${primary} 5px, ${secondary} 5px, ${secondary} 10px)`,
        }
      case "eagle-wings":
        return {
          backgroundImage: `conic-gradient(from 180deg at 50% 50%, ${primary} 0deg, ${secondary} 180deg, ${primary} 360deg)`,
        }
      case "hero-shield":
        return {
          backgroundImage: `linear-gradient(45deg, ${primary} 25%, ${secondary} 25%, ${secondary} 50%, ${primary} 50%, ${primary} 75%, ${secondary} 75%)`,
        }
      case "dino-scales":
        return {
          backgroundImage: `repeating-radial-gradient(circle at 0 0, ${primary} 0px, ${secondary} 10px, ${primary} 20px)`,
        }
      case "wiz-magic":
        return {
          backgroundImage: `conic-gradient(${primary} 0deg, ${secondary} 120deg, ${primary} 240deg, ${secondary} 360deg)`,
        }
      default:
        return {
          background: `linear-gradient(135deg, ${primary}, ${secondary})`,
        }
    }
  }

  if (!currentGame) {
    return (
      <Card className="opacity-60">
        <CardContent className="p-4 text-center">
          <Ticket className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <h3 className="font-semibold mb-1 text-gray-600">티켓 발급</h3>
          <p className="text-sm text-gray-500 mb-3">경기 시간이 아닙니다</p>
          <div className="space-y-2">
            <Button size="sm" className="w-full" disabled>
              직관 티켓 발급
            </Button>
            <Button size="sm" variant="outline" className="w-full bg-transparent" disabled>
              TV 시청 티켓 발급
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">경기 시간 동안만 발급 가능</div>
        </CardContent>
      </Card>
    )
  }

  const opponent = getOpponentInfo(currentGame.homeTeam === team.id ? currentGame.awayTeam : currentGame.homeTeam)
  const teamDesign = getTeamDesign(team.id)

  return (
    <>
      <Card className="hover:shadow-md transition-shadow border-green-200 bg-green-50">
        <CardContent className="p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <Ticket className="w-6 h-6 text-green-600" />
            <Badge variant="secondary" className="bg-green-100 text-green-800 animate-pulse">
              LIVE
            </Badge>
          </div>
          <h3 className="font-semibold mb-1">티켓 발급 가능!</h3>

          <div className="text-sm text-gray-600 mb-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span>{team.logo}</span>
              <span>VS</span>
              <span>{opponent.logo}</span>
            </div>
            <div className="flex items-center justify-center gap-1 text-xs">
              <MapPin className="w-3 h-3" />
              {currentGame.stadium}
            </div>
          </div>

          <div className="bg-white rounded p-2 mb-3">
            <div className="flex items-center justify-center gap-1 text-xs text-orange-600">
              <Clock className="w-3 h-3" />
              <span>등록 가능 시간: {timeRemaining}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              size="sm"
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => generateTicket("attendance")}
            >
              <MapPin className="w-3 h-3 mr-1" />
              직관 티켓 발급
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-white hover:bg-gray-50"
              onClick={() => generateTicket("tv")}
            >
              <Tv className="w-3 h-3 mr-1" />
              TV 시청 티켓 발급
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showTicket} onOpenChange={setShowTicket}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{ticketType === "attendance" ? "직관 티켓" : "TV 시청 티켓"} 발급 완료!</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Team-specific Ticket Design */}
            <div
              className="relative text-white rounded-lg p-6 overflow-hidden"
              style={getPatternStyle(teamDesign.pattern, teamDesign.primary, teamDesign.secondary)}
            >
              {/* Team accent overlay */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundColor: teamDesign.accent }} />

              <div className="relative z-10 text-center">
                {/* Team Header */}
                <div className="mb-3">
                  <div className="text-3xl mb-1">{team.logo}</div>
                  <div className="font-bold text-xl tracking-wide">{teamDesign.nickname.toUpperCase()}</div>
                  <div className="text-sm opacity-90">{team.name}</div>
                </div>

                {/* VS Section */}
                <div className="flex items-center justify-center gap-3 mb-3">
                  <div className="text-2xl">{team.logo}</div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: teamDesign.accent, color: teamDesign.primary }}
                  >
                    VS
                  </div>
                  <div className="text-2xl">{opponent.logo}</div>
                </div>

                {/* Ticket Type Badge */}
                <div
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-3"
                  style={{ backgroundColor: teamDesign.accent, color: teamDesign.primary }}
                >
                  {ticketType === "attendance" ? <MapPin className="w-3 h-3" /> : <Tv className="w-3 h-3" />}
                  {ticketType === "attendance" ? "STADIUM TICKET" : "TV VIEWING TICKET"}
                </div>

                {/* Game Info */}
                <div className="space-y-2 mb-3">
                  <div
                    className="bg-white/20 backdrop-blur-sm rounded p-2 border"
                    style={{ borderColor: teamDesign.accent + "40" }}
                  >
                    <div className="text-xs opacity-90">VENUE</div>
                    <div className="font-bold text-sm">{currentGame.stadium}</div>
                  </div>

                  <div
                    className="bg-white/20 backdrop-blur-sm rounded p-2 border"
                    style={{ borderColor: teamDesign.accent + "40" }}
                  >
                    <div className="text-xs opacity-90">GAME TIME</div>
                    <div className="font-bold text-sm">
                      {currentGame.startTime} - {currentGame.endTime}
                    </div>
                  </div>
                </div>

                {/* Serial Number */}
                <div className="text-xs opacity-75 font-mono">#{Date.now().toString().slice(-8)}</div>
                <div className="text-xs opacity-75">{new Date().toLocaleDateString("ko-KR")}</div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 opacity-20">
                <div className="text-4xl">{team.logo}</div>
              </div>
              <div className="absolute bottom-4 left-4 opacity-20">
                <div className="text-2xl">{team.logo}</div>
              </div>

              {/* Ticket perforation effect */}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-sm text-green-800 text-center">🎉 티켓이 캘린더에 자동으로 저장되었습니다!</div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={downloadTicket}>
                <Download className="w-4 h-4 mr-1" />
                다운로드
              </Button>
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={shareTicket}>
                <Share2 className="w-4 h-4 mr-1" />
                공유하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
