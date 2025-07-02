"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface TermTooltipProps {
  text: string
  terms: string[]
}

export default function TermTooltip({ text, terms }: TermTooltipProps) {
  const [hoveredTerm, setHoveredTerm] = useState<string | null>(null)

  const termDefinitions: Record<string, string> = {
    홈런: "타자가 친 공이 펜스를 넘어가서 한 번에 홈까지 돌아오는 것",
    타점: "타자가 타격으로 주자를 홈으로 불러들인 점수",
    "마무리 투수": "경기 마지막에 등판하여 승리를 확정짓는 투수",
    병살: "한 번의 플레이로 두 명의 주자를 아웃시키는 것",
    평균자책점: "투수가 9이닝 동안 내준 평균 실점 (ERA)",
  }

  const highlightTerms = (text: string) => {
    let highlightedText = text

    terms.forEach((term) => {
      const regex = new RegExp(`(${term})`, "gi")
      highlightedText = highlightedText.replace(
        regex,
        `<mark class="bg-yellow-200 px-1 rounded cursor-pointer hover:bg-yellow-300" data-term="$1">$1</mark>`,
      )
    })

    return highlightedText
  }

  return (
    <div className="relative">
      <div
        dangerouslySetInnerHTML={{ __html: highlightTerms(text) }}
        onClick={(e) => {
          const target = e.target as HTMLElement
          if (target.tagName === "MARK") {
            const term = target.getAttribute("data-term")
            setHoveredTerm(term)
          }
        }}
      />

      {hoveredTerm && termDefinitions[hoveredTerm] && (
        <Card className="absolute z-10 mt-2 w-64 shadow-lg">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                용어 설명
              </Badge>
            </div>
            <div className="font-medium text-sm mb-1">{hoveredTerm}</div>
            <div className="text-sm text-gray-600">{termDefinitions[hoveredTerm]}</div>
            <button className="text-xs text-blue-600 mt-2 hover:underline" onClick={() => setHoveredTerm(null)}>
              닫기
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
