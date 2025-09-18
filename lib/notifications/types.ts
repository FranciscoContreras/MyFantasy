export type NotificationCategory = "injury" | "trade" | "lineup" | "score" | "news"

export type NotificationSeverity = "low" | "medium" | "high"

export interface NotificationAction {
  label: string
  href?: string
  command?: string
}

export interface NotificationEntity {
  id: string
  name: string
  type: "player" | "team" | "opponent" | "league" | "manager"
}

export interface NotificationPayload {
  id: string
  category: NotificationCategory
  severity: NotificationSeverity
  title: string
  message: string
  timestamp: string
  read: boolean
  tags: string[]
  actions: NotificationAction[]
  entities?: NotificationEntity[]
  metadata?: Record<string, unknown>
}

export interface NotificationFeed {
  generatedAt: string
  season: number
  week: number
  notifications: NotificationPayload[]
}
