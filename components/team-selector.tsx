"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Team {
  id: string
  name: string
  color: string
  logo: string
}

interface TeamSelectorProps {
  teams: Team[]
  onSelect: (teamId: string) => void
  isOpen: boolean
}

export default function TeamSelector({ teams, onSelect, isOpen }: TeamSelectorProps) {
  if (isOpen) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">⚾</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">야구플래닛</h2>
            <p className="text-gray-600">좋아하는 팀을 선택해주세요</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {teams.map((team) => (
              <Button
                key={team.id}
                variant="outline"
                className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-green-50 bg-transparent"
                onClick={() => onSelect(team.id)}
              >
                <div className="text-2xl">{team.logo}</div>
                <span className="text-sm font-medium text-center leading-tight">{team.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {teams.map((team) => (
        <Button
          key={team.id}
          variant="outline"
          className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-green-50 bg-transparent"
          onClick={() => onSelect(team.id)}
        >
          <div className="text-2xl">{team.logo}</div>
          <span className="text-sm font-medium text-center leading-tight">{team.name}</span>
        </Button>
      ))}
    </div>
  )
}
