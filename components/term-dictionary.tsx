"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search } from "lucide-react"
import { useState } from "react"

interface TermDictionaryProps {
  isBeginnerMode: boolean
}

interface Term {
  id: string
  term: string
  category: string
  definition: string
  example?: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

const BASEBALL_TERMS: Term[] = [
  {
    id: "1",
    term: "홈런",
    category: "타격",
    definition: "타자가 친 공이 펜스를 넘어가서 한 번에 홈까지 돌아오는 것",
    example: "김민수가 3회에 2점 홈런을 쳤습니다.",
    difficulty: "beginner",
  },
  {
    id: "2",
    term: "타점",
    category: "타격",
    definition: "타자가 타격으로 주자를 홈으로 불러들인 점수",
    example: "오늘 3타점을 기록했습니다.",
    difficulty: "beginner",
  },
  {
    id: "3",
    term: "병살",
    category: "수비",
    definition: "한 번의 플레이로 두 명의 주자를 아웃시키는 것",
    example: "6-4-3 병살로 위기를 넘겼습니다.",
    difficulty: "intermediate",
  },
  {
    id: "4",
    term: "마무리 투수",
    category: "투수",
    definition: "경기 마지막에 등판하여 승리를 확정짓는 투수",
    example: "마무리 투수 이성민이 완벽하게 마무리했습니다.",
    difficulty: "beginner",
  },
  {
    id: "5",
    term: "평균자책점",
    category: "투수",
    definition: "투수가 9이닝 동안 내준 평균 실점 (ERA)",
    example: "평균자책점 2.50으로 좋은 성적을 보이고 있습니다.",
    difficulty: "intermediate",
  },
  {
    id: "6",
    term: "고의사구",
    category: "투수",
    definition: "의도적으로 볼넷을 주어 타자를 1루로 보내는 것",
    example: "강타자를 피해 고의사구를 선택했습니다.",
    difficulty: "intermediate",
  },
  {
    id: "7",
    term: "데드볼",
    category: "투수",
    definition: "투수가 던진 공이 타자의 몸에 맞는 것",
    example: "데드볼로 1루에 출루했습니다.",
    difficulty: "beginner",
  },
  {
    id: "8",
    term: "스퀴즈",
    category: "전술",
    definition: "3루 주자가 있을 때 번트로 득점을 노리는 전술",
    example: "스퀴즈 플레이로 동점을 만들었습니다.",
    difficulty: "advanced",
  },
]

export default function TermDictionary({ isBeginnerMode }: TermDictionaryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(BASEBALL_TERMS.map((term) => term.category)))

  const filteredTerms = BASEBALL_TERMS.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || term.category === selectedCategory
    const matchesDifficulty = !isBeginnerMode || term.difficulty === "beginner"

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "초급"
      case "intermediate":
        return "중급"
      case "advanced":
        return "고급"
      default:
        return "기타"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            야구 용어 사전
            {isBeginnerMode && (
              <Badge variant="secondary" className="ml-2">
                입문자 모드
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="용어를 검색해보세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge
              variant={selectedCategory === null ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(null)}
            >
              전체
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>

          {isBeginnerMode && (
            <div className="bg-blue-50 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-2">
                <div className="text-lg">💡</div>
                <div className="text-sm">
                  <div className="font-medium text-blue-800 mb-1">입문자 모드</div>
                  <p className="text-blue-700">
                    초급 용어만 표시됩니다. 더 많은 용어를 보려면 입문자 모드를 해제하세요.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms List */}
      <div className="space-y-3">
        {filteredTerms.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-600">다른 키워드로 검색해보세요.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTerms.map((term) => (
            <Card key={term.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{term.term}</h3>
                    <Badge variant="outline" className="text-xs">
                      {term.category}
                    </Badge>
                  </div>
                  <Badge className={`text-xs ${getDifficultyColor(term.difficulty)}`}>
                    {getDifficultyLabel(term.difficulty)}
                  </Badge>
                </div>
                <p className="text-gray-700 mb-2">{term.definition}</p>
                {term.example && (
                  <div className="bg-gray-50 rounded p-2">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">예시:</span> {term.example}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
