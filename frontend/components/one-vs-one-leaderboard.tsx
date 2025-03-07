"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search, Trophy, Medal, Award, Swords } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for 1v1 players
const initialPlayers = [
  {
    id: 1,
    name: "Mike Chen",
    wins: 37,
    losses: 12,
    winRate: 75.5,
    streak: 8,
    bestMatchup: { name: "Ryan Murphy", wins: 8, losses: 1 },
    worstMatchup: { name: "Lisa Wang", wins: 3, losses: 5 },
  },
  {
    id: 2,
    name: "Lisa Wang",
    wins: 34,
    losses: 15,
    winRate: 69.4,
    streak: 3,
    bestMatchup: { name: "Emma Davis", wins: 7, losses: 1 },
    worstMatchup: { name: "John Smith", wins: 2, losses: 4 },
  },
  {
    id: 3,
    name: "John Smith",
    wins: 31,
    losses: 19,
    winRate: 62.0,
    streak: 0,
    bestMatchup: { name: "Lisa Wang", wins: 4, losses: 2 },
    worstMatchup: { name: "Mike Chen", wins: 1, losses: 6 },
  },
  {
    id: 4,
    name: "Priya Patel",
    wins: 29,
    losses: 22,
    winRate: 56.9,
    streak: 2,
    bestMatchup: { name: "Zoe Williams", wins: 6, losses: 1 },
    worstMatchup: { name: "Carlos Gomez", wins: 2, losses: 5 },
  },
  {
    id: 5,
    name: "Carlos Gomez",
    wins: 26,
    losses: 21,
    winRate: 55.3,
    streak: 1,
    bestMatchup: { name: "Priya Patel", wins: 5, losses: 2 },
    worstMatchup: { name: "Mike Chen", wins: 1, losses: 7 },
  },
  {
    id: 6,
    name: "Aisha Johnson",
    wins: 24,
    losses: 23,
    winRate: 51.1,
    streak: 0,
    bestMatchup: { name: "Tom Wilson", wins: 5, losses: 2 },
    worstMatchup: { name: "Lisa Wang", wins: 1, losses: 5 },
  },
  {
    id: 7,
    name: "Tom Wilson",
    wins: 22,
    losses: 25,
    winRate: 46.8,
    streak: -2,
    bestMatchup: { name: "Ryan Murphy", wins: 5, losses: 3 },
    worstMatchup: { name: "Aisha Johnson", wins: 2, losses: 5 },
  },
  {
    id: 8,
    name: "Emma Davis",
    wins: 19,
    losses: 28,
    winRate: 40.4,
    streak: -1,
    bestMatchup: { name: "Zoe Williams", wins: 5, losses: 2 },
    worstMatchup: { name: "Lisa Wang", wins: 1, losses: 7 },
  },
  {
    id: 9,
    name: "Ryan Murphy",
    wins: 17,
    losses: 31,
    winRate: 35.4,
    streak: -3,
    bestMatchup: { name: "Zoe Williams", wins: 4, losses: 2 },
    worstMatchup: { name: "Mike Chen", wins: 1, losses: 8 },
  },
  {
    id: 10,
    name: "Zoe Williams",
    wins: 14,
    losses: 34,
    winRate: 29.2,
    streak: 0,
    bestMatchup: { name: "Ryan Murphy", wins: 3, losses: 2 },
    worstMatchup: { name: "Priya Patel", wins: 1, losses: 6 },
  },
]

export function OneVsOneLeaderboard() {
  const [players, setPlayers] = useState(initialPlayers)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "winRate", direction: "desc" })

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc"
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })

    const sortedPlayers = [...players].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1
      return 0
    })
    setPlayers(sortedPlayers)
  }

  // Filter players based on search term
  const filteredPlayers = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? "↑" : "↓"
    }
    return ""
  }

  // Get medal for top 3 players
  const getMedal = (index) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (index === 1) return <Medal className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Award className="h-5 w-5 text-amber-700" />
    return null
  }

  // Get streak display
  const getStreakDisplay = (streak) => {
    if (streak > 0) return <span className="text-green-500">+{streak} 🔥</span>
    if (streak < 0) return <span className="text-red-500">{streak} ❄️</span>
    return <span className="text-muted-foreground">0</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">1 vs 1 Leaderboard</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search players..."
            className="pl-8 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 text-center">#</TableHead>
              <TableHead>Player</TableHead>
              <TableHead className="w-[180px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("winRate")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Win Rate
                  <ArrowUpDown className="h-4 w-4" />
                  {getSortIcon("winRate")}
                </Button>
              </TableHead>
              <TableHead className="w-24">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("wins")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  W/L
                  <ArrowUpDown className="h-4 w-4" />
                  {getSortIcon("wins")}
                </Button>
              </TableHead>
              <TableHead className="w-24 text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("streak")}
                  className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                >
                  Streak
                  <ArrowUpDown className="h-4 w-4" />
                  {getSortIcon("streak")}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredPlayers.map((player, index) => (
                <motion.tr
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className={`${
                    index % 2 === 0 ? "bg-muted/50" : ""
                  } hover:bg-primary/5 transition-colors cursor-pointer`}
                  whileHover={{
                    scale: 1.01,
                    transition: { duration: 0.2 },
                  }}
                >
                  <TableCell className="text-center font-medium">
                    <div className="flex justify-center">{getMedal(index) || index + 1}</div>
                  </TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Swords className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium">{player.name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="p-4 max-w-xs rounded-xl">
                          <div className="space-y-2">
                            <h4 className="font-bold">{player.name}</h4>
                            <div className="grid grid-cols-1 gap-3 text-sm mt-2">
                              <div>
                                <p className="text-muted-foreground mb-1">Best Matchup:</p>
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                                    <Trophy className="h-3 w-3 text-green-600 dark:text-green-400" />
                                  </div>
                                  <span className="font-medium">{player.bestMatchup.name}</span>
                                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                                    {player.bestMatchup.wins}-{player.bestMatchup.losses}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <p className="text-muted-foreground mb-1">Worst Matchup:</p>
                                <div className="flex items-center gap-2">
                                  <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                                    <Award className="h-3 w-3 text-red-600 dark:text-red-400" />
                                  </div>
                                  <span className="font-medium">{player.worstMatchup.name}</span>
                                  <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                                    {player.worstMatchup.wins}-{player.worstMatchup.losses}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{player.winRate.toFixed(1)}%</span>
                      </div>
                      <Progress value={player.winRate} className="h-2 rounded-full" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      <span className="text-green-500">{player.wins}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-red-500">{player.losses}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{getStreakDisplay(player.streak)}</TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

