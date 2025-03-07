"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Search, Trophy, Medal, Award, TableIcon as TableTennisIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for round table players
const initialPlayers = [
  { id: 1, name: "Sarah Johnson", roundsWon: 42, gamesPlayed: 67, winRate: 62.7 },
  { id: 2, name: "David Kim", roundsWon: 38, gamesPlayed: 71, winRate: 53.5 },
  { id: 3, name: "Alex Martinez", roundsWon: 35, gamesPlayed: 59, winRate: 59.3 },
  { id: 4, name: "Emma Wilson", roundsWon: 31, gamesPlayed: 62, winRate: 50.0 },
  { id: 5, name: "James Taylor", roundsWon: 29, gamesPlayed: 55, winRate: 52.7 },
  { id: 6, name: "Olivia Brown", roundsWon: 27, gamesPlayed: 58, winRate: 46.6 },
  { id: 7, name: "Michael Davis", roundsWon: 25, gamesPlayed: 49, winRate: 51.0 },
  { id: 8, name: "Sophia Garcia", roundsWon: 23, gamesPlayed: 51, winRate: 45.1 },
  { id: 9, name: "Daniel Rodriguez", roundsWon: 21, gamesPlayed: 47, winRate: 44.7 },
  { id: 10, name: "Isabella Lopez", roundsWon: 19, gamesPlayed: 42, winRate: 45.2 },
]

export function RoundTableLeaderboard() {
  const [players, setPlayers] = useState(initialPlayers)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "roundsWon", direction: "desc" })

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Round the Table Leaderboard</h2>
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
              <TableHead className="w-32">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("roundsWon")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Rounds Won
                  <ArrowUpDown className="h-4 w-4" />
                  {getSortIcon("roundsWon")}
                </Button>
              </TableHead>
              <TableHead className="w-32">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("gamesPlayed")}
                  className="flex items-center gap-1 p-0 h-auto font-medium"
                >
                  Games Played
                  <ArrowUpDown className="h-4 w-4" />
                  {getSortIcon("gamesPlayed")}
                </Button>
              </TableHead>
              <TableHead className="w-32 text-right">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("winRate")}
                  className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                >
                  Win Rate
                  <ArrowUpDown className="h-4 w-4" />
                  {getSortIcon("winRate")}
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
                              <TableTennisIcon className="h-4 w-4 text-primary" />
                            </div>
                            <span className="font-medium">{player.name}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="p-4 max-w-xs rounded-xl">
                          <div className="space-y-2">
                            <h4 className="font-bold">{player.name}</h4>
                            <p className="text-sm">Joined the league in 2023</p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-muted-foreground">Favorite paddle:</p>
                                <p className="font-medium">Butterfly</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Playing style:</p>
                                <p className="font-medium">{index % 2 === 0 ? "Offensive" : "Defensive"}</p>
                              </div>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>
                    <div className="font-semibold">{player.roundsWon}</div>
                  </TableCell>
                  <TableCell>{player.gamesPlayed}</TableCell>
                  <TableCell className="text-right">{player.winRate.toFixed(1)}%</TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

