"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  MessageCircle,
  Heart,
  Share2,
  Plus,
  TrendingUp,
  Trophy,
  Camera,
  MessageSquare,
  FlameIcon as Fire,
} from "lucide-react"
import { useState, useEffect } from "react"

interface Team {
  id: string
  name: string
  color: string
  logo: string
}

interface FanCommunityProps {
  team: Team
}

interface Post {
  id: number
  author: string
  avatar: string
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  type: "general" | "game" | "photo" | "prediction"
  gameDate?: string
  isLiked?: boolean
}

interface Comment {
  id: number
  postId: number
  author: string
  avatar: string
  content: string
  timestamp: string
  likes: number
}

interface Player {
  id: string
  name: string
  position: string
  backNumber: number
  team: string
  stats?: {
    avg?: string
    era?: string
    homeRuns?: number
    rbi?: number
  }
}

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    author: "야구덕후123",
    avatar: "⚾",
    content: "오늘 경기 정말 짜릿했어요! 9회말 역전승 너무 감동적이었습니다 🔥 우리 팀 최고!",
    timestamp: "2025-07-20 22:30",
    likes: 24,
    comments: 8,
    type: "game",
    gameDate: "2025-07-20",
    isLiked: false,
  },
  {
    id: 2,
    author: "홈런왕",
    avatar: "🏆",
    content: "내일 경기 예측해봅시다! 우리 팀 선발투수 컨디션이 좋아 보이는데 어떻게 생각하세요?",
    timestamp: "2025-07-19 18:45",
    likes: 15,
    comments: 12,
    type: "prediction",
    isLiked: true,
  },
  {
    id: 3,
    author: "직관러버",
    avatar: "📸",
    content: "어제 직관 갔다 왔어요! 분위기 정말 최고였습니다. 다음에 같이 가실 분 있나요?",
    image: "/placeholder.svg?height=200&width=300",
    timestamp: "2025-07-18 14:20",
    likes: 31,
    comments: 6,
    type: "photo",
    isLiked: false,
  },
  {
    id: 4,
    author: "팬클럽회장",
    avatar: "👑",
    content: "7월 팀 성적 정말 좋네요! 이대로만 가면 플레이오프 진출 확실할 것 같아요 💪",
    timestamp: "2025-07-17 16:10",
    likes: 42,
    comments: 15,
    type: "general",
    isLiked: true,
  },
  {
    id: 5,
    author: "신입팬",
    avatar: "🌟",
    content: "야구 입문한 지 얼마 안 됐는데 이 팀 응원하게 된 이유가... 정말 매력적이에요!",
    timestamp: "2025-07-16 20:05",
    likes: 18,
    comments: 9,
    type: "general",
    isLiked: false,
  },
]

const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    postId: 1,
    author: "응원단장",
    avatar: "📣",
    content: "정말 짜릿했죠! 마지막까지 포기하지 않는 모습이 감동적이었어요",
    timestamp: "2025-07-20 22:35",
    likes: 5,
  },
  {
    id: 2,
    postId: 1,
    author: "야구매니아",
    avatar: "⚾",
    content: "9회말 역전 홈런 순간 소름 돋았습니다 🔥",
    timestamp: "2025-07-20 22:40",
    likes: 8,
  },
]

export default function FanCommunity({ team }: FanCommunityProps) {
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS)
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showNewPost, setShowNewPost] = useState(false)
  const [newPost, setNewPost] = useState({ content: "", type: "general" as const })
  const [newComment, setNewComment] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [favoritePlayer, setFavoritePlayer] = useState<Player | null>(null)
  const [showPlayerSelector, setShowPlayerSelector] = useState(false)
  const [availablePlayers] = useState<Player[]>([
    // 각 팀별 주요 선수들 (7월 기준)
    {
      id: "doosan_1",
      name: "김재환",
      position: "내야수",
      backNumber: 32,
      team: "doosan",
      stats: { avg: ".285", homeRuns: 15, rbi: 42 },
    },
    {
      id: "doosan_2",
      name: "양의지",
      position: "포수",
      backNumber: 25,
      team: "doosan",
      stats: { avg: ".278", homeRuns: 8, rbi: 35 },
    },
    {
      id: "lg_1",
      name: "김현수",
      position: "외야수",
      backNumber: 17,
      team: "lg",
      stats: { avg: ".312", homeRuns: 18, rbi: 48 },
    },
    {
      id: "lg_2",
      name: "오지환",
      position: "내야수",
      backNumber: 24,
      team: "lg",
      stats: { avg: ".289", homeRuns: 12, rbi: 38 },
    },
    {
      id: "kia_1",
      name: "최형우",
      position: "외야수",
      backNumber: 34,
      team: "kia",
      stats: { avg: ".295", homeRuns: 16, rbi: 45 },
    },
    {
      id: "kia_2",
      name: "나성범",
      position: "외야수",
      backNumber: 5,
      team: "kia",
      stats: { avg: ".301", homeRuns: 14, rbi: 41 },
    },
    {
      id: "samsung_1",
      name: "구자욱",
      position: "외야수",
      backNumber: 5,
      team: "samsung",
      stats: { avg: ".288", homeRuns: 11, rbi: 33 },
    },
    {
      id: "samsung_2",
      name: "김헌곤",
      position: "내야수",
      backNumber: 64,
      team: "samsung",
      stats: { avg: ".275", homeRuns: 9, rbi: 28 },
    },
    {
      id: "lotte_1",
      name: "이대호",
      position: "내야수",
      backNumber: 10,
      team: "lotte",
      stats: { avg: ".267", homeRuns: 13, rbi: 39 },
    },
    {
      id: "lotte_2",
      name: "전준우",
      position: "외야수",
      backNumber: 51,
      team: "lotte",
      stats: { avg: ".293", homeRuns: 10, rbi: 31 },
    },
    {
      id: "ssg_1",
      name: "최정",
      position: "내야수",
      backNumber: 14,
      team: "ssg",
      stats: { avg: ".279", homeRuns: 17, rbi: 46 },
    },
    {
      id: "ssg_2",
      name: "한유섬",
      position: "외야수",
      backNumber: 32,
      team: "ssg",
      stats: { avg: ".285", homeRuns: 8, rbi: 29 },
    },
    {
      id: "hanwha_1",
      name: "노시환",
      position: "내야수",
      backNumber: 13,
      team: "hanwha",
      stats: { avg: ".291", homeRuns: 19, rbi: 52 },
    },
    {
      id: "hanwha_2",
      name: "문현빈",
      position: "외야수",
      backNumber: 20,
      team: "hanwha",
      stats: { avg: ".276", homeRuns: 7, rbi: 26 },
    },
    {
      id: "kiwoom_1",
      name: "김혜성",
      position: "내야수",
      backNumber: 3,
      team: "kiwoom",
      stats: { avg: ".298", homeRuns: 6, rbi: 34 },
    },
    {
      id: "kiwoom_2",
      name: "이정후",
      position: "외야수",
      backNumber: 51,
      team: "kiwoom",
      stats: { avg: ".315", homeRuns: 14, rbi: 43 },
    },
    {
      id: "nc_1",
      name: "박민우",
      position: "외야수",
      backNumber: 23,
      team: "nc",
      stats: { avg: ".282", homeRuns: 12, rbi: 37 },
    },
    {
      id: "nc_2",
      name: "손아섭",
      position: "내야수",
      backNumber: 6,
      team: "nc",
      stats: { avg: ".271", homeRuns: 8, rbi: 25 },
    },
    {
      id: "kt_1",
      name: "강백호",
      position: "내야수",
      backNumber: 50,
      team: "kt",
      stats: { avg: ".287", homeRuns: 21, rbi: 55 },
    },
    {
      id: "kt_2",
      name: "김민혁",
      position: "외야수",
      backNumber: 7,
      team: "kt",
      stats: { avg: ".294", homeRuns: 9, rbi: 32 },
    },
  ])

  useEffect(() => {
    const savedPlayer = localStorage.getItem(`favoritePlayer_${team.id}`)
    if (savedPlayer) {
      setFavoritePlayer(JSON.parse(savedPlayer))
    }
  }, [team.id])

  const handleSelectPlayer = (player: Player) => {
    setFavoritePlayer(player)
    localStorage.setItem(`favoritePlayer_${team.id}`, JSON.stringify(player))
    setShowPlayerSelector(false)
  }

  const getTeamPlayers = () => {
    return availablePlayers.filter((player) => player.team === team.id)
  }

  const handleLike = (postId: number) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
          : post,
      ),
    )
  }

  const handleCreatePost = () => {
    if (!newPost.content.trim()) return

    const post: Post = {
      id: Date.now(),
      author: "나",
      avatar: team.logo,
      content: newPost.content,
      timestamp: new Date().toLocaleString("ko-KR"),
      likes: 0,
      comments: 0,
      type: newPost.type,
      isLiked: false,
    }

    setPosts([post, ...posts])
    setNewPost({ content: "", type: "general" })
    setShowNewPost(false)
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return

    const comment: Comment = {
      id: Date.now(),
      postId: selectedPost.id,
      author: "나",
      avatar: team.logo,
      content: newComment,
      timestamp: new Date().toLocaleString("ko-KR"),
      likes: 0,
    }

    setComments([...comments, comment])
    setPosts(posts.map((post) => (post.id === selectedPost.id ? { ...post, comments: post.comments + 1 } : post)))
    setNewComment("")
  }

  const getFilteredPosts = () => {
    switch (activeTab) {
      case "game":
        return posts.filter((post) => post.type === "game")
      case "photo":
        return posts.filter((post) => post.type === "photo")
      case "prediction":
        return posts.filter((post) => post.type === "prediction")
      default:
        return posts
    }
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case "game":
        return <Trophy className="w-4 h-4 text-yellow-500" />
      case "photo":
        return <Camera className="w-4 h-4 text-blue-500" />
      case "prediction":
        return <TrendingUp className="w-4 h-4 text-purple-500" />
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case "game":
        return "경기 후기"
      case "photo":
        return "직관 인증"
      case "prediction":
        return "경기 예측"
      default:
        return "일반"
    }
  }

  const postComments = selectedPost ? comments.filter((c) => c.postId === selectedPost.id) : []

  return (
    <div className="space-y-4">
      {/* Community Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              {team.name} 팬 커뮤니티
            </div>
            <Button onClick={() => setShowNewPost(true)} size="sm">
              <Plus className="w-4 h-4 mr-1" />
              글쓰기
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <div className="text-2xl font-bold text-blue-600">1,234</div>
              <div className="text-sm text-gray-600">활성 팬</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">89</div>
              <div className="text-sm text-gray-600">오늘 게시글</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">456</div>
              <div className="text-sm text-gray-600">이번 주 댓글</div>
            </div>
          </div>

          {/* 응원 선수 섹션 */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">내가 응원하는 선수</h3>
              <Button variant="outline" size="sm" onClick={() => setShowPlayerSelector(true)}>
                {favoritePlayer ? "변경" : "선택"}
              </Button>
            </div>

            {favoritePlayer ? (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-blue-600">#{favoritePlayer.backNumber}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{favoritePlayer.name}</span>
                      <Badge variant="secondary">{favoritePlayer.position}</Badge>
                    </div>
                    {favoritePlayer.stats && (
                      <div className="text-sm text-gray-600">
                        {favoritePlayer.stats.avg && `타율 ${favoritePlayer.stats.avg}`}
                        {favoritePlayer.stats.homeRuns && ` • 홈런 ${favoritePlayer.stats.homeRuns}개`}
                        {favoritePlayer.stats.rbi && ` • 타점 ${favoritePlayer.stats.rbi}개`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-gray-500 mb-2">⚾</div>
                <p className="text-sm text-gray-600">응원할 선수를 선택해보세요!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Post Filters */}
      <Card>
        <CardContent className="p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" className="flex items-center gap-1">
                <Fire className="w-4 h-4" />
                전체
              </TabsTrigger>
              <TabsTrigger value="game" className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                경기
              </TabsTrigger>
              <TabsTrigger value="photo" className="flex items-center gap-1">
                <Camera className="w-4 h-4" />
                사진
              </TabsTrigger>
              <TabsTrigger value="prediction" className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                예측
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {getFilteredPosts().map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">{post.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">{post.author}</span>
                    <Badge variant="outline" className="text-xs">
                      {getPostTypeLabel(post.type)}
                    </Badge>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                  </div>

                  <p className="text-gray-800 mb-3">{post.content}</p>

                  {post.image && (
                    <div className="mb-3">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="게시글 이미지"
                        className="rounded-lg max-w-full h-48 object-cover"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1 ${post.isLiked ? "text-red-500" : "text-gray-500"}`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`} />
                      {post.likes}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedPost(post)}
                      className="flex items-center gap-1 text-gray-500"
                    >
                      <MessageSquare className="w-4 h-4" />
                      {post.comments}
                    </Button>

                    <Button variant="ghost" size="sm" className="flex items-center gap-1 text-gray-500">
                      <Share2 className="w-4 h-4" />
                      공유
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hot Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fire className="w-5 h-5 text-orange-500" />
            인기 토픽
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { tag: "#7월_성적", count: 45 },
              { tag: "#직관_후기", count: 32 },
              { tag: "#선수_응원", count: 28 },
              { tag: "#경기_예측", count: 21 },
              { tag: "#팬미팅", count: 15 },
            ].map((topic, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <span className="text-blue-600 font-medium">{topic.tag}</span>
                <Badge variant="secondary">{topic.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* New Post Dialog */}
      <Dialog open={showNewPost} onOpenChange={setShowNewPost}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>새 글 작성</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">카테고리</label>
              <div className="flex gap-2">
                {[
                  { key: "general", label: "일반", icon: <MessageCircle className="w-4 h-4" /> },
                  { key: "game", label: "경기", icon: <Trophy className="w-4 h-4" /> },
                  { key: "photo", label: "사진", icon: <Camera className="w-4 h-4" /> },
                  { key: "prediction", label: "예측", icon: <TrendingUp className="w-4 h-4" /> },
                ].map((type) => (
                  <Button
                    key={type.key}
                    variant={newPost.type === type.key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewPost((prev) => ({ ...prev, type: type.key as any }))}
                  >
                    {type.icon}
                    <span className="ml-1 text-xs">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">내용</label>
              <Textarea
                placeholder="팬들과 나누고 싶은 이야기를 적어보세요..."
                value={newPost.content}
                onChange={(e) => setNewPost((prev) => ({ ...prev, content: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePost} className="flex-1" disabled={!newPost.content.trim()}>
                게시하기
              </Button>
              <Button variant="outline" onClick={() => setShowNewPost(false)}>
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Post Detail Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>댓글</DialogTitle>
          </DialogHeader>

          {selectedPost && (
            <div className="space-y-4">
              {/* Original Post */}
              <div className="border-b pb-4">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{selectedPost.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">{selectedPost.author}</span>
                      <Badge variant="outline" className="text-xs">
                        {getPostTypeLabel(selectedPost.type)}
                      </Badge>
                    </div>
                    <p className="text-gray-800 mb-2">{selectedPost.content}</p>
                    {selectedPost.image && (
                      <img
                        src={selectedPost.image || "/placeholder.svg"}
                        alt="게시글 이미지"
                        className="rounded-lg max-w-full h-32 object-cover mb-2"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Comments */}
              <div className="space-y-3">
                {postComments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg">{comment.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-800">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment */}
              <div className="border-t pt-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="댓글을 입력하세요..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  />
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    등록
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Player Selection Dialog */}
      <Dialog open={showPlayerSelector} onOpenChange={setShowPlayerSelector}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{team.name} 선수 선택</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {getTeamPlayers().map((player) => (
              <div
                key={player.id}
                className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleSelectPlayer(player)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-blue-600">#{player.backNumber}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{player.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {player.position}
                      </Badge>
                    </div>
                    {player.stats && (
                      <div className="text-sm text-gray-600">
                        {player.stats.avg && `타율 ${player.stats.avg}`}
                        {player.stats.homeRuns && ` • 홈런 ${player.stats.homeRuns}개`}
                        {player.stats.rbi && ` • 타점 ${player.stats.rbi}개`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowPlayerSelector(false)}>
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
