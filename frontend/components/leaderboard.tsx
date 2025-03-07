"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TableIcon as TableTennisIcon, Trophy, Medal, Moon, Sun } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { RoundTableLeaderboard } from "@/components/round-table-leaderboard"
import { OneVsOneLeaderboard } from "@/components/one-vs-one-leaderboard"
import { useTheme } from "next-themes"

export function Leaderboard() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Wait for component to mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="container mx-auto py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <TableTennisIcon className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Ping Pong Champions</h1>
          <TableTennisIcon className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground text-lg text-center max-w-2xl">
          Track your office ping pong prowess and claim your rightful place at the top!
        </p>
      </motion.div>

      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-xl"
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>

      <Tabs defaultValue="round-table" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 rounded-xl overflow-hidden">
          <TabsTrigger value="round-table" className="text-base">
            Round the Table
          </TabsTrigger>
          <TabsTrigger value="one-v-one" className="text-base">
            1 vs 1 Matches
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <TabsContent value="round-table" className="mt-0">
            <motion.div
              key="round-table"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-4 md:grid-cols-2 mb-8">
                <StatsCard
                  icon={<Trophy className="h-5 w-5 text-yellow-500" />}
                  title="Champion"
                  value="Sarah Johnson"
                  description="Current reigning champion"
                />
                <StatsCard
                  icon={<Medal className="h-5 w-5 text-blue-500" />}
                  title="Total Games"
                  value="247"
                  description="Games played this season"
                />
              </div>
              <RoundTableLeaderboard />
            </motion.div>
          </TabsContent>

          <TabsContent value="one-v-one" className="mt-0">
            <motion.div
              key="one-v-one"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid gap-4 md:grid-cols-2 mb-8">
                <StatsCard
                  icon={<Trophy className="h-5 w-5 text-yellow-500" />}
                  title="Top Player"
                  value="Mike Chen"
                  description="Highest win rate"
                />
                <StatsCard
                  icon={<Medal className="h-5 w-5 text-blue-500" />}
                  title="Total Matches"
                  value="183"
                  description="1v1 matches this season"
                />
              </div>
              <OneVsOneLeaderboard />
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  )
}

function StatsCard({ icon, title, value, description }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
      <Card className="rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

