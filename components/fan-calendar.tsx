"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Heart,
  Frown,
  Smile,
  Meh,
  Ticket,
  Trophy,
  Tv,
  MapPin,
  Clock,
} from "lucide-react"
import { useState, useEffect } from "react"

interface Team {
  id: string
  name: string
  color: string
  logo: string
}

interface FanCalendarProps {
  team: Team
}

interface CalendarEntry {
  id: number
  date: string
  type: "win" | "lose" | "scheduled" | "attendance" | "note" | "ticket"
  title: string
  content?: string
  emotion?: "happy" | "sad" | "excited" | "neutral"
  ticketId?: number
  opponent?: string
  gameResult?: "win" | "lose" | "scheduled"
  score?: { home: number; away: number }
  gameTime?: string
  stadium?: string
}

const TEAM_LOGOS = {
  doosan: "🐻",
  lg: "⚾",
  kia: "🐅",
  samsung: "🦁",
  lotte: "⚡",
  ssg: "🚀",
  hanwha: "🦅",
  kiwoom: "🦸",
  nc: "🦕",
  kt: "🧙",
}

const STADIUMS = {
  doosan: "잠실야구장",
  lg: "잠실야구장",
  kia: "광주-KIA 챔피언스 필드",
  samsung: "대구 삼성 라이온즈 파크",
  lotte: "사직야구장",
  ssg: "인천 SSG 랜더스 필드",
  hanwha: "대전 한화생명 이글스 파크",
  kiwoom: "고척 스카이돔",
  nc: "창원 NC 파크",
  kt: "수원 KT 위즈 파크",
}

export default function FanCalendar({ team }: FanCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [entries, setEntries] = useState<CalendarEntry[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedDateEntries, setSelectedDateEntries] = useState<CalendarEntry[]>([])
  const [newEntry, setNewEntry] = useState({ title: "", content: "", emotion: "happy" as const })
  const [showAddEntry, setShowAddEntry] = useState(false)
  const [selectedGameEntry, setSelectedGameEntry] = useState<CalendarEntry | null>(null)

  // Mock game schedule for demonstration - 팀별로 다른 상대팀과 경기
  const getMockGameSchedule = (teamId: string) => {
    const allTeams = ["doosan", "lg", "kia", "samsung", "lotte", "ssg", "hanwha", "kiwoom", "nc", "kt"]
    const opponents = allTeams.filter((t) => t !== teamId) // 자기 팀 제외

    const gameSchedule = [
      // 완료된 경기들
      {
        date: "2025-07-03",
        opponent: opponents[0],
        result: "win" as const,
        score: { home: 7, away: 4 },
        gameTime: "18:30",
        stadium: STADIUMS[teamId as keyof typeof STADIUMS],
      },
      {
        date: "2025-07-06",
        opponent: opponents[1],
        result: "lose" as const,
        score: { home: 3, away: 5 },
        gameTime: "14:00",
        stadium: STADIUMS[opponents[1] as keyof typeof STADIUMS],
      },
      {
        date: "2025-07-10",
        opponent: opponents[2],
        result: "win" as const,
        score: { home: 6, away: 2 },
        gameTime: "18:30",
        stadium: STADIUMS[teamId as keyof typeof STADIUMS],
      },
      {
        date: "2025-07-13",
        opponent: opponents[3],
        result: "win" as const,
        score: { home: 8, away: 3 },
        gameTime: "14:00",
        stadium: STADIUMS[opponents[3] as keyof typeof STADIUMS],
      },
      {
        date: "2025-07-17",
        opponent: opponents[4],
        result: "lose" as const,
        score: { home: 2, away: 4 },
        gameTime: "18:30",
        stadium: STADIUMS[teamId as keyof typeof STADIUMS],
      },
      {
        date: "2025-07-20",
        opponent: opponents[5],
        result: "win" as const,
        score: { home: 5, away: 1 },
        gameTime: "14:00",
        stadium: STADIUMS[opponents[5] as keyof typeof STADIUMS],
      },
      // 예정된 경기들
      {
        date: "2025-07-24",
        opponent: opponents[6],
        result: "scheduled" as const,
        gameTime: "18:30",
        stadium: STADIUMS[teamId as keyof typeof STADIUMS],
      },
      {
        date: "2025-07-27",
        opponent: opponents[7],
        result: "scheduled" as const,
        gameTime: "14:00",
        stadium: STADIUMS[opponents[7] as keyof typeof STADIUMS],
      },
      {
        date: "2025-07-30",
        opponent: opponents[8],
        result: "scheduled" as const,
        gameTime: "18:30",
        stadium: STADIUMS[teamId as keyof typeof STADIUMS],
      },
      // 8월 예정 경기들을 다음과 같이 7월로 변경:
      {
        date: "2025-07-31", // 2025-08-02에서 변경
        opponent: opponents[0],
        result: "scheduled" as const,
        gameTime: "18:30",
        stadium: STADIUMS[opponents[0] as keyof typeof STADIUMS],
      },
    ]

    return gameSchedule
  }

  useEffect(() => {
    // Load calendar entries from localStorage
    const savedEntries = JSON.parse(localStorage.getItem(`fanCalendar_${team.id}`) || "[]")

    // Get mock game schedule for current team
    const mockGameSchedule = getMockGameSchedule(team.id)

    // Add mock game entries to entries if not already present
    const existingDates = savedEntries.map((entry: CalendarEntry) => entry.date)
    const newGameEntries = mockGameSchedule
      .filter((game) => !existingDates.includes(game.date))
      .map((game) => ({
        id: Date.now() + Math.random(),
        date: game.date,
        type: game.result === "scheduled" ? "scheduled" : game.result,
        title:
          game.result === "scheduled"
            ? `예정 vs ${TEAM_LOGOS[game.opponent as keyof typeof TEAM_LOGOS]}`
            : `${game.result === "win" ? "승리" : "패배"} vs ${TEAM_LOGOS[game.opponent as keyof typeof TEAM_LOGOS]}`,
        content:
          game.result === "scheduled"
            ? `${game.gameTime} ${game.stadium}`
            : `${game.score!.home} : ${game.score!.away}`,
        opponent: game.opponent,
        gameResult: game.result,
        score: game.score,
        gameTime: game.gameTime,
        stadium: game.stadium,
        emotion: game.result === "win" ? "happy" : game.result === "lose" ? "sad" : "excited",
      }))

    // Add mock ticket entries for some game dates
    const mockTicketEntries = [
      {
        id: Date.now() + 1000,
        date: "2025-07-03",
        type: "ticket",
        title: "직관 티켓 발급",
        content: "잠실야구장에서 경기 직관",
        emotion: "excited",
        ticketId: 12345,
      },
      {
        id: Date.now() + 2000,
        date: "2025-07-10",
        type: "ticket",
        title: "TV 시청 티켓 발급",
        content: "집에서 TV로 경기 시청",
        emotion: "happy",
        ticketId: 12346,
      },
      {
        id: Date.now() + 3000,
        date: "2025-07-20",
        type: "ticket",
        title: "직관 티켓 발급",
        content: "광주-KIA 챔피언스 필드에서 경기 직관",
        emotion: "excited",
        ticketId: 12347,
      },
    ]

    // Filter out existing ticket entries for these dates
    const existingTicketDates = savedEntries
      .filter((entry: CalendarEntry) => entry.type === "ticket")
      .map((entry: CalendarEntry) => entry.date)

    const newTicketEntries = mockTicketEntries.filter((ticket) => !existingTicketDates.includes(ticket.date))

    const allEntries = [...savedEntries, ...newGameEntries, ...newTicketEntries]
    setEntries(allEntries)

    // Save updated entries
    if (newGameEntries.length > 0 || newTicketEntries.length > 0) {
      localStorage.setItem(`fanCalendar_${team.id}`, JSON.stringify(allEntries))
    }
  }, [team.id])

  const saveEntry = () => {
    if (!selectedDate || !newEntry.title) return

    const entry: CalendarEntry = {
      id: Date.now(),
      date: selectedDate,
      type: "note",
      title: newEntry.title,
      content: newEntry.content,
      emotion: newEntry.emotion,
    }

    const updatedEntries = [...entries, entry]
    setEntries(updatedEntries)
    localStorage.setItem(`fanCalendar_${team.id}`, JSON.stringify(updatedEntries))

    setNewEntry({ title: "", content: "", emotion: "happy" })
    setShowAddEntry(false)

    // Update selected date entries
    const dateEntries = updatedEntries.filter((entry) => entry.date === selectedDate)
    setSelectedDateEntries(dateEntries)
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getEntriesForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return entries.filter((entry) => entry.date === dateStr)
  }

  const getTicketInfo = (ticketId: number) => {
    const tickets = JSON.parse(localStorage.getItem("fanTickets") || "[]")
    return tickets.find((ticket: any) => ticket.id === ticketId)
  }

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case "happy":
        return <Smile className="w-3 h-3 text-green-500" />
      case "sad":
        return <Frown className="w-3 h-3 text-red-500" />
      case "excited":
        return <Heart className="w-3 h-3 text-pink-500" />
      default:
        return <Meh className="w-3 h-3 text-gray-500" />
    }
  }

  const getEntryIcon = (entry: CalendarEntry) => {
    switch (entry.type) {
      case "win":
        return <Trophy className="w-3 h-3 text-yellow-500" />
      case "lose":
        return <Frown className="w-3 h-3 text-red-500" />
      case "scheduled":
        return <Clock className="w-3 h-3 text-blue-500" />
      case "ticket":
        return <Ticket className="w-3 h-3 text-green-500" />
      default:
        return entry.emotion ? getEmotionIcon(entry.emotion) : <Meh className="w-3 h-3 text-gray-500" />
    }
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
    const dateEntries = getEntriesForDate(day)
    setSelectedDateEntries(dateEntries)
  }

  const days = getDaysInMonth(currentDate)
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />팬 캘린더
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="font-medium">
                {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
              </span>
              <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-gray-600 p-2">
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className="p-2"></div>
              }

              const dayEntries = getEntriesForDate(day)
              const gameEntry = dayEntries.find(
                (entry) => entry.type === "win" || entry.type === "lose" || entry.type === "scheduled",
              )
              const hasTicket = dayEntries.some((entry) => entry.type === "ticket")

              return (
                <div
                  key={day}
                  className="relative p-2 min-h-[80px] border rounded hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleDateClick(day)}
                >
                  <div className="text-sm font-medium mb-1">{day}</div>

                  {/* Game Display */}
                  {gameEntry && (
                    <div className="mb-2">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span className="text-lg">{team.logo}</span>
                        <span className="text-xs font-bold">VS</span>
                        <span className="text-lg">{TEAM_LOGOS[gameEntry.opponent as keyof typeof TEAM_LOGOS]}</span>
                      </div>

                      {gameEntry.type === "scheduled" ? (
                        <>
                          <div className="text-xs text-center px-1 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                            예정
                          </div>
                          <div className="text-xs text-center text-gray-600 mt-1 font-medium">{gameEntry.gameTime}</div>
                        </>
                      ) : (
                        <>
                          <div
                            className={`text-xs text-center px-1 py-0.5 rounded font-bold ${
                              gameEntry.type === "win" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {gameEntry.type === "win" ? "승" : "패"}
                          </div>
                          {gameEntry.score && (
                            <div className="text-xs text-center text-gray-600 mt-1 font-medium">
                              {gameEntry.score.home}:{gameEntry.score.away}
                            </div>
                          )}
                        </>
                      )}

                      {/* 경기가 있는 날의 티켓 표시 */}
                      {hasTicket && (
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <Ticket className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600 font-medium">티켓</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Other Entries - 경기가 없는 날의 다른 엔트리들 */}
                  {!gameEntry && (
                    <div className="space-y-1">
                      {dayEntries.slice(0, 3).map((entry) => (
                        <div key={entry.id} className="flex items-center gap-1">
                          {getEntryIcon(entry)}
                          <div className="text-xs truncate">{entry.title}</div>
                        </div>
                      ))}
                      {dayEntries.length > 3 && <div className="text-xs text-gray-500">+{dayEntries.length - 3}개</div>}
                    </div>
                  )}

                  {/* Ticket Indicator - 경기가 없는 날에만 표시 */}
                  {!gameEntry && hasTicket && (
                    <div className="absolute top-1 right-1">
                      <Ticket className="w-3 h-3 text-green-500" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>최근 기록</CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">아직 기록이 없어요</h3>
              <p className="text-gray-600 mb-4">경기 감상평이나 직관 후기를 남겨보세요!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {entries
                .slice(-5)
                .reverse()
                .map((entry) => {
                  const ticketInfo = entry.ticketId ? getTicketInfo(entry.ticketId) : null

                  return (
                    <div
                      key={entry.id}
                      className={`flex items-start gap-3 p-3 bg-gray-50 rounded-lg ${
                        entry.type === "win" || entry.type === "lose"
                          ? "cursor-pointer hover:bg-gray-100 transition-colors"
                          : ""
                      }`}
                      onClick={() => {
                        if (entry.type === "win" || entry.type === "lose") {
                          setSelectedGameEntry(entry)
                        }
                      }}
                    >
                      {getEntryIcon(entry)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{entry.title}</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.date}
                          </Badge>
                          {entry.opponent && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm">vs</span>
                              <span className="text-lg">{TEAM_LOGOS[entry.opponent as keyof typeof TEAM_LOGOS]}</span>
                            </div>
                          )}
                          {ticketInfo && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              {ticketInfo.type === "attendance" ? "직관" : "TV시청"}
                            </Badge>
                          )}
                        </div>
                        {entry.content && <p className="text-sm text-gray-600">{entry.content}</p>}
                        {ticketInfo && <div className="text-xs text-gray-500 mt-1">📍 {ticketInfo.stadium}</div>}
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Date Detail Dialog */}
      <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedDate} 기록</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Existing Entries */}
            {selectedDateEntries.length > 0 && (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                <h4 className="font-medium text-sm">이날의 기록</h4>
                <div className="space-y-3 pr-2">
                  {selectedDateEntries.map((entry) => {
                    const ticketInfo = entry.ticketId ? getTicketInfo(entry.ticketId) : null

                    return (
                      <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                          {getEntryIcon(entry)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{entry.title}</span>
                              {entry.opponent && (
                                <div className="flex items-center gap-1">
                                  <span className="text-xs">vs</span>
                                  <span className="text-sm">
                                    {TEAM_LOGOS[entry.opponent as keyof typeof TEAM_LOGOS]}
                                  </span>
                                </div>
                              )}
                            </div>

                            {entry.type === "win" || entry.type === "lose" ? (
                              <div>
                                {entry.score && (
                                  <div className="text-sm text-gray-600 mb-1">
                                    최종 스코어: {entry.score.home} - {entry.score.away}
                                  </div>
                                )}
                                <Badge
                                  variant="secondary"
                                  className={
                                    entry.type === "win" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                  }
                                >
                                  {entry.type === "win" ? "승리" : "패배"}
                                </Badge>
                              </div>
                            ) : entry.type === "scheduled" ? (
                              <div>
                                <div className="text-sm text-gray-600 mb-1">경기 시간: {entry.gameTime}</div>
                                <div className="text-sm text-gray-600 mb-1">경기장: {entry.stadium}</div>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  예정된 경기
                                </Badge>
                              </div>
                            ) : (
                              <>
                                {entry.content && <p className="text-sm text-gray-600 mb-1">{entry.content}</p>}
                                {ticketInfo && (
                                  <div className="flex items-center gap-2 text-xs text-gray-500">
                                    {ticketInfo.type === "attendance" ? (
                                      <MapPin className="w-3 h-3" />
                                    ) : (
                                      <Tv className="w-3 h-3" />
                                    )}
                                    <span>{ticketInfo.stadium}</span>
                                    <Badge variant="outline" className="text-xs">
                                      {ticketInfo.type === "attendance" ? "직관" : "TV시청"}
                                    </Badge>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Add New Entry Button */}
            <Button variant="outline" className="w-full bg-transparent" onClick={() => setShowAddEntry(true)}>
              새 기록 추가
            </Button>

            {/* Add Entry Form */}
            {showAddEntry && (
              <div className="space-y-3 border-t pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">제목</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md text-sm"
                    placeholder="예: 오늘 경기 너무 재밌었다!"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">감정</label>
                  <div className="flex gap-2">
                    {[
                      { key: "happy", icon: <Smile className="w-4 h-4" />, label: "기쁨" },
                      { key: "excited", icon: <Heart className="w-4 h-4" />, label: "설렘" },
                      { key: "neutral", icon: <Meh className="w-4 h-4" />, label: "보통" },
                      { key: "sad", icon: <Frown className="w-4 h-4" />, label: "아쉬움" },
                    ].map((emotion) => (
                      <Button
                        key={emotion.key}
                        variant={newEntry.emotion === emotion.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewEntry((prev) => ({ ...prev, emotion: emotion.key as any }))}
                      >
                        {emotion.icon}
                        <span className="ml-1 text-xs">{emotion.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">내용 (선택)</label>
                  <Textarea
                    placeholder="자세한 감상평을 남겨보세요..."
                    value={newEntry.content}
                    onChange={(e) => setNewEntry((prev) => ({ ...prev, content: e.target.value }))}
                    className="text-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={saveEntry} className="flex-1" size="sm">
                    저장하기
                  </Button>
                  <Button variant="outline" onClick={() => setShowAddEntry(false)} size="sm">
                    취소
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Game Detail Dialog */}
      <Dialog open={!!selectedGameEntry} onOpenChange={() => setSelectedGameEntry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>경기 상세 요약</DialogTitle>
          </DialogHeader>

          {selectedGameEntry && (
            <div className="space-y-4">
              {/* Game Header */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <div className="text-center">
                    <div className="text-2xl mb-1">{team.logo}</div>
                    <div className="text-sm font-medium">{team.name}</div>
                  </div>
                  <div className="text-xl text-gray-400">VS</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">
                      {TEAM_LOGOS[selectedGameEntry.opponent as keyof typeof TEAM_LOGOS]}
                    </div>
                    <div className="text-sm font-medium">상대팀</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {selectedGameEntry.date} · {selectedGameEntry.stadium}
                </div>
              </div>

              {/* Game Result */}
              <div className="text-center">
                <Badge
                  variant="secondary"
                  className={`text-lg px-4 py-2 ${
                    selectedGameEntry.type === "win" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedGameEntry.type === "win" ? "승리" : "패배"}
                </Badge>
                {selectedGameEntry.score && (
                  <div className="text-2xl font-bold mt-2">
                    {selectedGameEntry.score.home} - {selectedGameEntry.score.away}
                  </div>
                )}
              </div>

              {/* Game Highlights */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-800">🔥 주요 하이라이트</h4>
                <div className="space-y-2">
                  {selectedGameEntry.type === "win"
                    ? [
                        "3회초 김민수의 2점 홈런으로 역전!",
                        "7회말 박준호의 결승 타점으로 승부 결정",
                        "마무리 투수 이성민 완벽 마무리",
                      ]
                    : [
                        "초반 실점으로 어려운 경기 전개",
                        "8회말 추격했지만 아쉽게 역부족",
                        "다음 경기에서 설욕 기대",
                      ].map((highlight, index) => (
                        <div key={index} className="text-sm text-gray-700 pl-4 border-l-2 border-green-200">
                          {highlight}
                        </div>
                      ))}
                </div>
              </div>

              {/* MVP */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-lg">🏆</div>
                  <span className="font-semibold text-yellow-800">
                    {selectedGameEntry.type === "win" ? "오늘의 MVP" : "선전한 선수"}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-medium">
                    {selectedGameEntry.type === "win" ? "김민수 (외야수)" : "박준호 (내야수)"}
                  </div>
                  <div className="text-gray-600">
                    {selectedGameEntry.type === "win" ? "3타수 2안타 2타점 1홈런" : "4타수 2안타 1타점"}
                  </div>
                </div>
              </div>

              {/* Game Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded p-3">
                  <div className="font-medium mb-1">경기 정보</div>
                  <div className="text-gray-600">
                    <p>• 관중: {Math.floor(Math.random() * 10000) + 10000}명</p>
                    <p>• 경기시간: 3시간 {Math.floor(Math.random() * 30) + 10}분</p>
                    <p>• 날씨: 맑음, 기온 {Math.floor(Math.random() * 10) + 15}°C</p>
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <div className="font-medium mb-1">팀 기록</div>
                  <div className="text-gray-600">
                    <p>• 안타: {Math.floor(Math.random() * 5) + 8}개</p>
                    <p>• 실책: {Math.floor(Math.random() * 3)}개</p>
                    <p>• 잔루: {Math.floor(Math.random() * 8) + 3}명</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
