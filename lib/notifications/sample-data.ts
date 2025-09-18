import { NotificationFeed, NotificationPayload } from "@/lib/notifications/types"

function createNotification(partial: Partial<NotificationPayload>): NotificationPayload {
  if (!partial.id) {
    throw new Error("Notification requires an id")
  }

  return {
    id: partial.id,
    category: partial.category ?? "news",
    severity: partial.severity ?? "medium",
    title: partial.title ?? "Update",
    message: partial.message ?? "",
    timestamp: partial.timestamp ?? new Date().toISOString(),
    read: partial.read ?? false,
    tags: partial.tags ?? [],
    actions: partial.actions ?? [],
    entities: partial.entities,
    metadata: partial.metadata,
  }
}

export function getSampleNotificationFeed(): NotificationFeed {
  const now = Date.now()

  const notifications: NotificationPayload[] = [
    createNotification({
      id: "injury-jefferson",
      category: "injury",
      severity: "high",
      title: "Justin Jefferson questionable (hip)",
      message: "Jefferson logged a limited practice Friday. Monitor Saturday walkthrough before locking him in.",
      timestamp: new Date(now - 1000 * 60 * 18).toISOString(),
      tags: ["vikings", "limited"],
      actions: [{ label: "Open player card", command: "open-player:justin-jefferson" }],
      entities: [
        { id: "jefferson", name: "Justin Jefferson", type: "player" },
        { id: "vikings", name: "Minnesota Vikings", type: "team" },
      ],
    }),
    createNotification({
      id: "trade-proposal-1001",
      category: "trade",
      severity: "medium",
      title: "Trade offer from Priya",
      message: "Receive Amon-Ra St. Brown + Jahmyr Gibbs for Justin Jefferson + James Conner.",
      timestamp: new Date(now - 1000 * 60 * 42).toISOString(),
      tags: ["trade", "pending"],
      actions: [
        { label: "Review offer", href: "/dashboard/trades" },
        { label: "Open chat", command: "open-chat:priya" },
      ],
      entities: [
        { id: "team-b", name: "Pacifica Waves", type: "team" },
        { id: "priya", name: "Priya", type: "manager" },
      ],
    }),
    createNotification({
      id: "lineup-reminder-1500",
      category: "lineup",
      severity: "medium",
      title: "Lineup reminder: Thursday kickoff",
      message: "Tank Dell starts in FLEX at 8:15 PM ET. Confirm lineup before lock.",
      timestamp: new Date(now - 1000 * 60 * 120).toISOString(),
      tags: ["reminder"],
      actions: [{ label: "Adjust lineup", href: "/dashboard/team" }],
      entities: [{ id: "tank-dell", name: "Tank Dell", type: "player" }],
    }),
    createNotification({
      id: "score-update-330",
      category: "score",
      severity: "low",
      title: "Live score update",
      message: "Legends lead 84.3 to 72.9 midway through Sunday window.",
      timestamp: new Date(now - 1000 * 60 * 8).toISOString(),
      tags: ["live"],
      actions: [{ label: "Open matchup", href: "/dashboard/matchup" }],
      entities: [
        { id: "team-a", name: "Bay Area Legends", type: "team" },
        { id: "team-b", name: "Pacifica Waves", type: "team" },
      ],
      metadata: {
        yourScore: 84.3,
        opponentScore: 72.9,
        winProbability: 0.61,
      },
    }),
    createNotification({
      id: "news-alert-sf-beat",
      category: "news",
      severity: "low",
      title: "49ers beat writer notes",
      message: "Kyle Shanahan plans to feature Brandon Aiyuk on schemed touches vs. Seattle's Cover-3.",
      timestamp: new Date(now - 1000 * 60 * 5).toISOString(),
      tags: ["news", "schemes"],
      actions: [{ label: "View matchup analyzer", href: "/dashboard/matchup" }],
      entities: [{ id: "brandon-aiyuk", name: "Brandon Aiyuk", type: "player" }],
    }),
  ]

  return {
    generatedAt: new Date(now).toISOString(),
    season: 2024,
    week: 15,
    notifications,
  }
}
