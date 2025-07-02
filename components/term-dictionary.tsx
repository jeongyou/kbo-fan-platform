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
  // 기본 용어들
  {
    id: "1",
    term: "스트라이크",
    category: "기본",
    definition: "타자가 치지 못했거나, 치기 좋은 공인데 안 쳤을 때 판정",
    example: "3스트라이크로 삼진 아웃되었습니다.",
    difficulty: "beginner",
  },
  {
    id: "2",
    term: "볼",
    category: "기본",
    definition: "타자가 치기 어려운 공. 4개 누적되면 자동으로 1루 진루",
    example: "볼넷으로 1루에 출루했습니다.",
    difficulty: "beginner",
  },
  {
    id: "3",
    term: "아웃",
    category: "기본",
    definition: "타자나 주자가 규칙에 따라 아웃 처리되는 것",
    example: "플라이볼로 아웃되었습니다.",
    difficulty: "beginner",
  },
  {
    id: "4",
    term: "안타",
    category: "타격",
    definition: "공을 쳐서 베이스에 안전하게 도착하는 것 (1루 이상)",
    example: "좌중간으로 깔끔한 안타를 쳤습니다.",
    difficulty: "beginner",
  },
  {
    id: "5",
    term: "홈런",
    category: "타격",
    definition: "담장을 넘겨 바로 홈까지 도는 타격",
    example: "김민수가 3회에 2점 홈런을 쳤습니다.",
    difficulty: "beginner",
  },
  {
    id: "6",
    term: "도루",
    category: "주루",
    definition: "투수가 던질 때 주자가 다음 루로 몰래 뛰는 플레이",
    example: "2루 도루에 성공했습니다.",
    difficulty: "intermediate",
  },
  {
    id: "7",
    term: "삼진",
    category: "투수",
    definition: "스트라이크 3개로 아웃되는 것",
    example: "빠른 직구로 삼진을 잡았습니다.",
    difficulty: "beginner",
  },
  {
    id: "8",
    term: "병살",
    category: "수비",
    definition: "한 플레이로 2명 이상이 아웃되는 수비",
    example: "6-4-3 병살로 위기를 넘겼습니다.",
    difficulty: "intermediate",
  },
  {
    id: "9",
    term: "타순",
    category: "기본",
    definition: "타자들이 타석에 나오는 순서 (1~9번)",
    example: "4번 타자가 타석에 들어섰습니다.",
    difficulty: "beginner",
  },
  {
    id: "10",
    term: "이닝",
    category: "기본",
    definition: "한 팀이 공격과 수비를 한 차례씩 마친 단위 (보통 9이닝까지 진행)",
    example: "7회말 공격이 시작됩니다.",
    difficulty: "beginner",
  },
  {
    id: "11",
    term: "타점",
    category: "타격",
    definition: "타자가 타격으로 주자를 홈으로 불러들인 점수",
    example: "오늘 3타점을 기록했습니다.",
    difficulty: "beginner",
  },
  {
    id: "12",
    term: "마무리 투수",
    category: "투수",
    definition: "경기 마지막에 등판하여 승리를 확정짓는 투수",
    example: "마무리 투수 이성민이 완벽하게 마무리했습니다.",
    difficulty: "beginner",
  },
  {
    id: "13",
    term: "평균자책점",
    category: "투수",
    definition: "투수가 9이닝 동안 내준 평균 실점 (ERA)",
    example: "평균자책점 2.50으로 좋은 성적을 보이고 있습니다.",
    difficulty: "intermediate",
  },
  {
    id: "14",
    term: "고의사구",
    category: "투수",
    definition: "의도적으로 볼넷을 주어 타자를 1루로 보내는 것",
    example: "강타자를 피해 고의사구를 선택했습니다.",
    difficulty: "intermediate",
  },
  {
    id: "15",
    term: "데드볼",
    category: "투수",
    definition: "투수가 던진 공이 타자의 몸에 맞는 것",
    example: "데드볼로 1루에 출루했습니다.",
    difficulty: "beginner",
  },
  {
    id: "16",
    term: "스퀴즈",
    category: "전술",
    definition: "3루 주자가 있을 때 번트로 득점을 노리는 전술",
    example: "스퀴즈 플레이로 동점을 만들었습니다.",
    difficulty: "advanced",
  },
  // 은어/은표 추가
  {
    id: "17",
    term: "불펜",
    category: "은어",
    definition: "선발 외 투수진 (중간계투, 마무리 등)",
    example: "불펜 투수들이 좋은 활약을 보이고 있습니다.",
    difficulty: "intermediate",
  },
  {
    id: "18",
    term: "똥볼",
    category: "은어",
    definition: "느린 공 (속도는 느린데 타이밍 맞추기 어려움)",
    example: "똥볼에 속아서 헛스윙했습니다.",
    difficulty: "intermediate",
  },
  {
    id: "19",
    term: "불방망이",
    category: "은어",
    definition: "타자들이 계속 안타·홈런을 치는 상태",
    example: "오늘 우리 팀 타선이 불방망이네요!",
    difficulty: "intermediate",
  },
  {
    id: "20",
    term: "먹튀",
    category: "은어",
    definition: "고액 연봉인데 활약이 없는 선수",
    example: "그 선수는 올 시즌 먹튀라는 소리를 듣고 있어요.",
    difficulty: "intermediate",
  },
  {
    id: "21",
    term: "먹방",
    category: "은어",
    definition: "타자들이 삼진만 당하고 타격이 안 되는 날",
    example: "오늘 우리 팀 타선이 완전 먹방이네요.",
    difficulty: "intermediate",
  },
  {
    id: "22",
    term: "사사구",
    category: "은어",
    definition: "볼넷과 몸에 맞는 공 (타자가 공 안 쳐도 진루)",
    example: "사사구로 출루 기회를 만들었습니다.",
    difficulty: "intermediate",
  },
  {
    id: "23",
    term: "퀄스",
    category: "은어",
    definition: "선발 투수가 6이닝 이상 던지고 3점 이하 실점한 경우 (QS)",
    example: "오늘 선발투수가 퀄스를 기록했습니다.",
    difficulty: "advanced",
  },
  {
    id: "24",
    term: "타이밍 안 맞음",
    category: "은어",
    definition: "스윙 타이밍이 늦거나 빨라서 공을 제대로 못 침",
    example: "계속 타이밍이 안 맞아서 헛스윙하고 있어요.",
    difficulty: "intermediate",
  },
  {
    id: "25",
    term: "K",
    category: "은어",
    definition: "삼진을 뜻하는 기호 (삼진 3개는 KKK)",
    example: "오늘 투수가 10K를 기록했습니다.",
    difficulty: "intermediate",
  },
  {
    id: "26",
    term: "초구딱",
    category: "은어",
    definition: "첫 번째 공을 바로 쳐서 안타나 홈런을 치는 것",
    example: "초구딱으로 홈런을 날렸습니다!",
    difficulty: "intermediate",
  },
  {
    id: "27",
    term: "떨공삼",
    category: "은어",
    definition: "떨어지는 공으로 삼진을 당하는 것 (변화구에 속음)",
    example: "슬라이더에 완전히 속아서 떨공삼 당했네요.",
    difficulty: "intermediate",
  },
  {
    id: "28",
    term: "몸빵",
    category: "은어",
    definition: "몸으로 공을 맞아서 출루하는 것 (데드볼)",
    example: "몸빵으로 출루 기회를 만들었습니다.",
    difficulty: "intermediate",
  },
  {
    id: "29",
    term: "깜놀",
    category: "은어",
    definition: "깜짝 놀랄 만한 플레이나 결과",
    example: "신인이 첫 타석에서 홈런? 완전 깜놀이네요!",
    difficulty: "intermediate",
  },
  {
    id: "30",
    term: "뻥튀기",
    category: "은어",
    definition: "높이 뜬 플라이볼 (쉬운 아웃)",
    example: "뻥튀기로 쉽게 아웃되었습니다.",
    difficulty: "intermediate",
  },
  {
    id: "31",
    term: "땅볼머신",
    category: "은어",
    definition: "땅볼만 치는 타자 (안타가 잘 안 나오는 타자)",
    example: "오늘 완전 땅볼머신이 되었네요.",
    difficulty: "intermediate",
  },
  {
    id: "32",
    term: "삼진머신",
    category: "은어",
    definition: "삼진을 많이 당하는 타자",
    example: "요즘 삼진머신이 되어서 고민이에요.",
    difficulty: "intermediate",
  },
  {
    id: "33",
    term: "폭탄",
    category: "은어",
    definition: "투수가 많은 실점을 하는 것",
    example: "선발투수가 3회에 폭탄을 맞았습니다.",
    difficulty: "intermediate",
  },
  {
    id: "34",
    term: "노가다",
    category: "은어",
    definition: "힘들게 점수를 내는 것 (소량 득점)",
    example: "오늘은 노가다로 1점씩 따내고 있어요.",
    difficulty: "intermediate",
  },
  {
    id: "35",
    term: "뒷심",
    category: "은어",
    definition: "후반 이닝에서 보여주는 집중력과 실력",
    example: "우리 팀은 뒷심이 좋아서 역전 가능성이 있어요.",
    difficulty: "intermediate",
  },
  {
    id: "36",
    term: "꿀빨",
    category: "은어",
    definition: "매우 쉬운 상대나 경기 (꿀을 빨듯 쉬움)",
    example: "오늘 상대 투수는 완전 꿀빨이네요.",
    difficulty: "intermediate",
  },
  {
    id: "37",
    term: "똥망",
    category: "은어",
    definition: "경기나 선수가 완전히 망친 상태",
    example: "선발투수가 1회에 5실점으로 똥망했네요.",
    difficulty: "intermediate",
  },
  {
    id: "38",
    term: "쫄리게",
    category: "은어",
    definition: "긴장되고 조마조마하게",
    example: "9회말 1점차 게임이라 쫄리게 보고 있어요.",
    difficulty: "intermediate",
  },
  {
    id: "39",
    term: "갓투수",
    category: "은어",
    definition: "신과 같은 실력을 보여주는 투수",
    example: "오늘 선발은 완전 갓투수네요!",
    difficulty: "intermediate",
  },
  {
    id: "40",
    term: "갓타자",
    category: "은어",
    definition: "신과 같은 실력을 보여주는 타자",
    example: "4타수 4안타? 완전 갓타자입니다!",
    difficulty: "intermediate",
  },
  {
    id: "41",
    term: "레전드",
    category: "은어",
    definition: "전설적인 플레이나 기록",
    example: "노히터 달성? 완전 레전드네요!",
    difficulty: "intermediate",
  },
  {
    id: "42",
    term: "명경기",
    category: "은어",
    definition: "매우 흥미진진하고 기억에 남을 만한 경기",
    example: "연장 12회까지 간 명경기였어요!",
    difficulty: "intermediate",
  },
  {
    id: "43",
    term: "흔들림",
    category: "은어",
    definition: "투수나 선수가 실수를 연발하며 불안한 모습",
    example: "마무리 투수가 흔들리고 있어요.",
    difficulty: "intermediate",
  },
  {
    id: "44",
    term: "작품",
    category: "은어",
    definition: "예술적이고 완벽한 플레이나 경기",
    example: "오늘 투수의 피칭은 완전 작품이었어요!",
    difficulty: "intermediate",
  },
  {
    id: "45",
    term: "역전포",
    category: "은어",
    definition: "역전 가능성이 있는 포수 (캐처)",
    example: "9회말 2아웃 만루, 역전포가 타석에 들어섰습니다!",
    difficulty: "intermediate",
  },
  {
    id: "46",
    term: "빈볼",
    category: "은어",
    definition: "타자를 겨냥해서 던지는 위험한 공",
    example: "보복성 빈볼을 던졌다는 의혹이 있어요.",
    difficulty: "intermediate",
  },
  {
    id: "47",
    term: "콜드게임",
    category: "은어",
    definition: "5회 이후 10점 이상 차이로 경기가 조기 종료되는 것",
    example: "15-2로 콜드게임이 선언되었습니다.",
    difficulty: "intermediate",
  },
  {
    id: "48",
    term: "워킹",
    category: "은어",
    definition: "볼넷 (4볼로 걸어서 1루로 가는 것)",
    example: "연속 워킹으로 만루가 되었어요.",
    difficulty: "intermediate",
  },
  {
    id: "49",
    term: "클린업",
    category: "은어",
    definition: "3-4-5번 타자 (주축 타자들)",
    example: "클린업 트리오가 모두 홈런을 쳤어요!",
    difficulty: "intermediate",
  },
  {
    id: "50",
    term: "백투백",
    category: "은어",
    definition: "연속 홈런 (등등 맞대고 홈런)",
    example: "백투백 홈런으로 분위기를 뒤집었어요!",
    difficulty: "intermediate",
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
