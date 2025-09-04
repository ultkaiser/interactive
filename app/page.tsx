"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Heart, Mail, Gift, Sparkles, Lock, Unlock, Clock } from "lucide-react"

interface Message {
  id: string
  content: string
  unlockHour: number // 13 for 1 PM, 14 for 2 PM, etc.
  unlocked: boolean
  type: "letter" | "easter-egg"
  easterEggType?: "gif" | "game" | "surprise"
}

interface Reply {
  id: string
  content: string
  timestamp: number
}

const HOURLY_MESSAGES: Message[] = [
  {
    id: "1",
    content:
      "Good afternoon, my love! 🌅 The day feels brighter knowing you're in it. I hope you're having a wonderful time and remember that you're always in my heart.",
    unlockHour: 13, // 1 PM
    unlocked: false,
    type: "letter",
  },
  {
    id: "2",
    content: "🎮 Mini Game Alert! Click the hearts to collect them! Let's see how many you can gather! ❤️💖💕",
    unlockHour: 14, // 2 PM
    unlocked: false,
    type: "easter-egg",
    easterEggType: "game",
  },
  {
    id: "3",
    content:
      "I was just thinking about your beautiful smile and how it makes my entire world light up. You have this amazing way of making everything better just by being you. 😊✨",
    unlockHour: 15, // 3 PM
    unlocked: false,
    type: "letter",
  },
  {
    id: "4",
    content:
      "Surprise! Here's a virtual bouquet just for you because you deserve all the beautiful things in the world! 💐🌹🌺🌻🌷",
    unlockHour: 16, // 4 PM
    unlocked: false,
    type: "easter-egg",
    easterEggType: "surprise",
  },
  {
    id: "5",
    content:
      "As the day goes on, I find myself thinking about all the little things that make you so special. Your laugh, your kindness, the way you see the world - everything about you is perfect. 💕",
    unlockHour: 17, // 5 PM
    unlocked: false,
    type: "letter",
  },
  {
    id: "6",
    content:
      "Evening is approaching, and I wish I could be there to watch the sunset with you. Until then, know that you're the most beautiful part of my day, every day. 🌅",
    unlockHour: 18, // 6 PM
    unlocked: false,
    type: "letter",
  },
  {
    id: "7",
    content:
      "Dinner time! I hope you're taking care of yourself and eating something delicious. You deserve all the good things, including amazing food and endless love. 🍽️❤️",
    unlockHour: 19, // 7 PM
    unlocked: false,
    type: "letter",
  },
  {
    id: "8",
    content:
      "🎊 Special Evening Surprise! You've unlocked a shower of virtual confetti because you're absolutely amazing! 🎉✨🎈",
    unlockHour: 20, // 8 PM
    unlocked: false,
    type: "easter-egg",
    easterEggType: "surprise",
  },
  {
    id: "9",
    content:
      "The evening is here, and I'm sending you all my love across the distance. I hope you can feel how much you mean to me, even when we're apart. You're my everything. 🌙💫",
    unlockHour: 21, // 9 PM
    unlocked: false,
    type: "letter",
  },
  {
    id: "10",
    content:
      "As the night settles in, I want you to know that you're the last thing on my mind before I sleep and the first when I wake. Sweet dreams are made of you. 🌟💤",
    unlockHour: 22, // 10 PM
    unlocked: false,
    type: "letter",
  },
  {
    id: "11",
    content:
      "Late night love note: Even in the quiet of the night, my heart is loud with love for you. You're my peace, my joy, and my forever. Sleep well, beautiful. 🌙❤️",
    unlockHour: 23, // 11 PM
    unlocked: false,
    type: "letter",
  },
  {
    id: "12",
    content:
      "🌟 Almost Midnight Magic! You've reached the final message of the day. Here's to another day of loving you tomorrow and always. Sweet dreams, my darling! ✨💕🌙",
    unlockHour: 23.59, // 11:59 PM
    unlocked: false,
    type: "easter-egg",
    easterEggType: "surprise",
  },
]

export default function LoveLettersWebsite() {
  const [messages, setMessages] = useState<Message[]>([])
  const [replies, setReplies] = useState<Reply[]>([])
  const [newReply, setNewReply] = useState("")
  const [heartCount, setHeartCount] = useState(0)
  const [showHeartGame, setShowHeartGame] = useState(false)
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number; y: number }[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  const isMessageUnlockable = (unlockHour: number) => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()

    if (unlockHour === 23.59) {
      return currentHour > 23 || (currentHour === 23 && currentMinute >= 59)
    }

    const targetHour = unlockHour === 24 ? 0 : Math.floor(unlockHour)

    if (unlockHour === 24) {
      return currentHour >= 0 || currentHour >= 13
    }

    return currentHour >= targetHour
  }

  useEffect(() => {
    const savedReplies = localStorage.getItem("loveReplies")
    const savedHeartCount = localStorage.getItem("heartCount")

    const initializedMessages = HOURLY_MESSAGES.map((msg) => ({
      ...msg,
      unlocked: isMessageUnlockable(msg.unlockHour),
    }))

    setMessages(initializedMessages)

    if (savedReplies) {
      setReplies(JSON.parse(savedReplies))
    }

    if (savedHeartCount) {
      setHeartCount(Number.parseInt(savedHeartCount))
    }

    const interval = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      setMessages((prev) => {
        const updated = prev.map((msg) => ({
          ...msg,
          unlocked: isMessageUnlockable(msg.unlockHour),
        }))
        return updated
      })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const unlockMessage = (messageId: string) => {
    setMessages((prev) => {
      const updated = prev.map((msg) => (msg.id === messageId ? { ...msg, unlocked: true } : msg))
      localStorage.setItem("loveLetters", JSON.stringify(updated))
      return updated
    })
  }

  const addReply = () => {
    if (!newReply.trim()) return

    const reply: Reply = {
      id: Date.now().toString(),
      content: newReply,
      timestamp: Date.now(),
    }

    const updatedReplies = [...replies, reply]
    setReplies(updatedReplies)
    localStorage.setItem("loveReplies", JSON.stringify(updatedReplies))
    setNewReply("")
  }

  const startHeartGame = () => {
    setShowHeartGame(true)
    const hearts = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 60 + 20,
    }))
    setFloatingHearts(hearts)
  }

  const collectHeart = (heartId: number) => {
    setFloatingHearts((prev) => prev.filter((h) => h.id !== heartId))
    const newCount = heartCount + 1
    setHeartCount(newCount)
    localStorage.setItem("heartCount", newCount.toString())

    if (floatingHearts.length === 1) {
      setShowHeartGame(false)
    }
  }

  const formatUnlockTime = (unlockHour: number) => {
    if (unlockHour === 23.59) return "11:59 PM"
    if (unlockHour === 24) return "12:00 AM"
    if (unlockHour === 12) return "12:00 PM"
    if (unlockHour > 12) return `${unlockHour - 12}:00 PM`
    return `${unlockHour}:00 AM`
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Heart className="h-6 w-6 text-primary fill-current" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-balance">Love Letters</h1>
                <p className="text-muted-foreground text-sm">Messages from your heart</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Heart className="h-3 w-3 fill-current" />
                {heartCount} Hearts Collected
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Your Messages</h2>
            </div>

            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="relative overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        {message.type === "easter-egg" ? (
                          <Gift className="h-4 w-4 text-accent" />
                        ) : (
                          <Heart className="h-4 w-4 text-primary fill-current" />
                        )}
                        {message.type === "easter-egg" ? "Special Surprise" : "Love Letter"}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {message.unlocked ? (
                          <Unlock className="h-4 w-4 text-green-500" />
                        ) : (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {message.unlocked ? "Unlocked" : `Unlocks at ${formatUnlockTime(message.unlockHour)}`}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {message.unlocked ? (
                      <div className="space-y-3">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.type === "easter-egg" && message.easterEggType === "game" && (
                          <Button
                            onClick={startHeartGame}
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                            Play Heart Collection Game
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-muted-foreground text-sm">
                          This message will unlock at {formatUnlockTime(message.unlockHour)}. Come back then to read it!
                          💕
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>
                            Available in{" "}
                            {message.unlockHour > currentTime.getHours()
                              ? message.unlockHour - currentTime.getHours()
                              : 0}{" "}
                            hours
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              <h2 className="text-xl font-semibold">Your Journal</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Write a Reply</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts, feelings, or just say hello..."
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <Button onClick={addReply} className="w-full">
                  <Heart className="h-4 w-4 mr-2 fill-current" />
                  Send Love Back
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="font-medium text-muted-foreground">Your Previous Messages</h3>
              {replies.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground text-sm">No messages yet. Write your first reply above! 💕</p>
                  </CardContent>
                </Card>
              ) : (
                replies
                  .slice()
                  .reverse()
                  .map((reply) => (
                    <Card key={reply.id}>
                      <CardContent className="pt-4">
                        <p className="text-sm leading-relaxed mb-2">{reply.content}</p>
                        <p className="text-xs text-muted-foreground">{formatTime(reply.timestamp)}</p>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </div>
        </div>
      </div>

      {showHeartGame && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <Card>
                <CardContent className="py-4 px-6">
                  <p className="text-center font-medium">Collect all the hearts! ❤️ ({floatingHearts.length} left)</p>
                </CardContent>
              </Card>
            </div>

            {floatingHearts.map((heart) => (
              <button
                key={heart.id}
                onClick={() => collectHeart(heart.id)}
                className="absolute animate-pulse hover:scale-110 transition-transform"
                style={{
                  left: `${heart.x}%`,
                  top: `${heart.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <Heart className="h-8 w-8 text-primary fill-current" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
