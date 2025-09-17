# Fantasy Football Lineup Optimizer - Project Guide

## Project Overview
Build a comprehensive NFL fantasy football web application with AI-powered lineup optimization, featuring a glass morphism UI design, real-time player analysis, and multi-platform league integration.

## Important: MCP Integrations
**This project uses two Model Context Protocol servers:**

### 1. shadcn MCP
- For rapid UI component development
- Direct access to shadcn/ui components
- Generate custom component variants on demand

### 2. Playwright MCP 🎭
- Browser automation for web scraping NFL data
- Automated league imports from ESPN/Yahoo/Sleeper/CBS
- End-to-end testing with screenshots
- Real-time data extraction from sports sites

MCP Usage Tips:
- **shadcn**: "Add shadcn button component" or "Create GlassCard variant"
- **Playwright**: "Scrape NFL stats from ESPN" or "Automate Yahoo league import"

## Tech Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, shadcn/ui (with MCP)
- **Backend**: Node.js, Express/Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Email/Password + Google OAuth)
- **Data Visualization**: Recharts, D3.js
- **NFL Data**: ESPN API, nfl-api-client, Playwright MCP for scraping
- **AI/ML**: OpenAI API for analysis, TensorFlow.js for predictions
- **Real-time**: Socket.io for live updates
- **Caching**: Redis for API response caching
- **Testing**: Jest, React Testing Library, Playwright MCP for E2E
- **Web Automation**: Playwright MCP for scraping and league imports
- **Component Library**: shadcn/ui with MCP integration for rapid development

## Project Structure
```
fantasy-football-optimizer/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Auth pages
│   ├── dashboard/         # Main dashboard
│   ├── api/              # API routes
│   └── components/       # Shared components
├── lib/                   # Utilities and helpers
│   ├── nfl-data/         # NFL data fetching
│   ├── analysis/         # AI/ML analysis
│   └── db/              # Database utilities
├── prisma/               # Database schema
├── public/              # Static assets
└── tests/              # Test files
```

## Quick Start with MCP Advantages

### Why This Project Will Be Faster with MCPs:
1. **shadcn MCP**: No manual component coding - generate UI instantly
2. **Playwright MCP**: No complex scraping setup - direct browser automation
3. **Combined Power**: Test your UI while scraping data in real-time

### First Commands to Run with Claude Code:
```bash
# 1. Start the project
"Initialize the Next.js project as specified in Task 1.1"

# 2. Setup glass morphism UI
"Use shadcn MCP to create the glass morphism theme and base components"

# 3. Test data scraping
"Use Playwright MCP to navigate to ESPN NFL stats and show me what data we can extract"

# 4. Create your first component
"Create a GlassCard component using shadcn Card with glass morphism effects"
```

---

## PHASE 1: Project Setup and Infrastructure

### Task 1.1: Initialize Next.js Project with TypeScript
```bash
# Create project with all necessary dependencies
npx create-next-app@latest fantasy-football-optimizer --typescript --tailwind --app --src-dir=false --import-alias="@/*"

# Navigate to project
cd fantasy-football-optimizer

# Install core dependencies
npm install @prisma/client prisma
npm install next-auth @auth/prisma-adapter
npm install @tanstack/react-query axios
npm install recharts d3
npm install lucide-react clsx tailwind-merge
npm install date-fns moment-timezone
npm install lodash @types/lodash
npm install zod react-hook-form @hookform/resolvers

# Initialize shadcn/ui with MCP support
npx shadcn@latest init

# Note: With shadcn MCP enabled, components can be added on-demand
# Note: Playwright MCP handles browser automation - no puppeteer/cheerio needed
```

### Task 1.2: Setup shadcn/ui with Glass Morphism Theme (Using shadcn MCP)
**Note: Project has shadcn MCP enabled for direct component access**

Initialize shadcn with custom configuration:
```bash
# Initialize shadcn/ui with MCP support
npx shadcn@latest init -d

# Use MCP to add all needed components at once
# Components to add via MCP:
# - button, card, dialog, dropdown-menu, form
# - input, label, navigation-menu, select, separator  
# - sheet, skeleton, switch, table, tabs, toast
# - tooltip, avatar, badge, progress, alert
# - command, popover, scroll-area, slider
```

Configure custom glass morphism theme:
```css
/* globals.css - Glass morphism design system */
@layer utilities {
  .glass {
    @apply bg-white/85 backdrop-blur-md border border-white/20 shadow-lg;
  }
  
  .glass-dark {
    @apply dark:bg-gray-900/85 dark:backdrop-blur-md dark:border-white/10;
  }
  
  .glass-hover {
    @apply hover:bg-white/90 hover:shadow-xl transition-all duration-200;
  }
  
  .glass-card {
    @apply glass rounded-2xl p-6 hover:shadow-2xl transition-all duration-300;
  }
  
  .soft-shadow {
    box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
  }
}
```

Setup theme provider with MCP components:
- Use MCP to generate ThemeProvider component
- Configure next-themes for dark mode
- Create glass morphism variants for all components
- Setup consistent color scheme (primary, secondary, accent)

### Task 1.3: Setup PostgreSQL Database with Prisma
Create comprehensive schema for:
- Users and authentication
- Leagues with custom scoring settings
- Teams and rosters
- Players with stats and projections
- Matchups and historical data
- Trade proposals and analysis

```prisma
// Key models to implement
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  teams         Team[]
  leagues       League[]
  // ... authentication fields
}

model League {
  id            String    @id @default(cuid())
  name          String
  scoringType   ScoringType
  rosterConfig  Json      // Flexible roster configuration
  // ... other league settings
}

model Player {
  id            String    @id @default(cuid())
  nflId         String    @unique
  name          String
  position      Position
  team          String
  stats         PlayerStats[]
  projections   Projection[]
}
```

### Task 1.4: Implement Authentication System
- Setup NextAuth.js with credentials and Google providers
- Create auth pages (login, register, forgot password)
- Implement session management
- Add protected route middleware

---

## PHASE 2: NFL Data Integration

### Task 2.1: Create NFL Data Service Layer
Build comprehensive data fetching system:
```typescript
// lib/nfl-data/index.ts
class NFLDataService {
  - fetchPlayerStats()
  - fetchTeamDefense()
  - fetchSchedule()
  - fetchInjuryReports()
  - fetchWeatherData()
  - syncHistoricalData()
}
```

### Task 2.2: Implement ESPN API Integration
- Setup API client with rate limiting
- Fetch real-time player stats
- Get current week matchups
- Pull injury designations

### Task 2.3: Build Web Scraping Service (with Playwright MCP)
Use Playwright MCP for advanced scraping:
```typescript
// Playwright MCP commands to use:
// "Navigate to ESPN NFL stats page and extract player data"
// "Scrape defensive coordinator information from Pro Football Reference"
// "Extract weather data from NFL.com game pages"
// "Capture advanced metrics from Football Outsiders"

// Scraping targets:
// - ESPN.com: Real-time stats, injury reports
// - Pro-Football-Reference: Historical data, defensive schemes
// - NFL.com: Official injury reports, weather
// - FantasyPros: Expert rankings, projections
// - The Athletic: Advanced analytics (if accessible)

// Use Playwright MCP to:
// - Handle dynamic JavaScript content
// - Bypass anti-scraping measures
// - Take screenshots for debugging
// - Execute custom JS for data extraction
```

### Task 2.4: Setup Data Caching Strategy
- Implement Redis caching
- Create refresh schedules
- Handle stale data gracefully
- Setup webhook listeners for real-time updates
- Use Playwright MCP to monitor for data changes

---

## PHASE 3: Core Algorithm Development

### Task 3.1: Build Player Analysis Engine
Create multi-factor analysis system:
```typescript
interface AnalysisFactors {
  historicalPerformance: number;
  matchupDifficulty: number;
  defensiveSchemeImpact: number;
  coordinatorTendencies: number;
  recentForm: number;
  injuryImpact: number;
  weatherImpact: number;
}
```

### Task 3.2: Implement AI-Powered Predictions
- Integrate OpenAI for natural language insights
- Build TensorFlow.js model for point predictions
- Create confidence scoring system (0-100%)
- Generate probability distributions

### Task 3.3: Develop Matchup Algorithm
Sophisticated matchup analysis:
- Player vs Defense historical data
- Position-specific defensive rankings
- Scheme advantages/disadvantages
- Game script predictions

### Task 3.4: Create Optimization Engine
Build lineup optimizer:
- Consider roster constraints
- Maximize projected points
- Factor in floor/ceiling projections
- Generate multiple lineup options

---

## PHASE 4: User Interface - Landing Page

### Task 4.1: Create Glass Morphism Landing Page (with shadcn MCP)
Build stunning landing with MCP components:
```typescript
// Use shadcn MCP to generate these custom components:
// - GlassCard (extends Card with glass morphism)
// - AnimatedButton (Button with hover effects)
// - FeatureCard (Card variant for features)
// - TestimonialCarousel (Carousel with glass cards)
// - Make the UI a light mode first then dark mode

// MCP commands to use:
// "Create a GlassCard component extending shadcn Card with glass morphism styles"
// "Generate a Hero section with animated gradient background"
// "Build a FeatureGrid using shadcn Cards with glass effects"
```

Components to build:
- Hero section with animated gradient mesh background
- Feature cards with glass morphism and hover lift effect
- Testimonials carousel with auto-play
- Pricing cards with glass effect
- CTA section with animated buttons

### Task 4.2: Implement Responsive Navigation (with shadcn MCP)
Use MCP to create navigation:
```typescript
// MCP components needed:
// - NavigationMenu (desktop)
// - Sheet (mobile menu)
// - DropdownMenu (user menu)
// - Button with theme toggle

// Glass morphism navigation bar
// - Sticky header with blur backdrop
// - Smooth scroll behavior
// - Mobile-responsive hamburger
```

---

## PHASE 5: Dashboard Development

### Task 5.1: Build Main Dashboard Layout (with shadcn MCP)
Create comprehensive dashboard using MCP:
```typescript
// MCP components to generate:
// - DashboardLayout with sidebar navigation
// - StatsCard (glass morphism card for metrics)
// - TeamOverview component with shadcn Table
// - MatchupCard with shadcn Progress bars
// - NewsCard with shadcn ScrollArea

// Use MCP commands like:
// "Create dashboard layout with collapsible sidebar using shadcn Sheet"
// "Generate stats cards grid with shadcn Card components"
// "Build data table with shadcn Table, sorting, and filtering"
```

Dashboard sections:
- Team overview with glass morphism cards
- Weekly matchup display with win probability
- Quick actions panel with shadcn Buttons
- News feed with shadcn ScrollArea
- Performance charts in glass containers

### Task 5.2: Implement Team Management (with shadcn MCP)
Team roster interface using MCP components:
```typescript
// MCP components needed:
// - PlayerCard with draggable functionality
// - SearchCommand (shadcn Command for player search)
// - RosterTable with shadcn Table
// - PlayerDialog for detailed views
// - ConfirmationDialog for add/drop

// Features:
// - Drag-and-drop with glass morphism visual feedback
// - Command palette for player search (Cmd+K)
// - Filterable/sortable roster table
// - Player quick actions menu
```

### Task 5.3: Create League Settings Page (with shadcn MCP)
Customizable configuration with MCP forms:
```typescript
// Use shadcn Form components via MCP:
// - Form with react-hook-form integration
// - Select dropdowns for scoring types
// - Slider for roster positions
// - Switch for league rules
// - Input for custom values

// Glass morphism settings cards
// Each setting in its own glass card
// Real-time validation and preview
```

### Task 5.4: Build Matchup Analyzer (with shadcn MCP)
Detailed matchup view components:
```typescript
// MCP components to create:
// - MatchupComparison with shadcn Tabs
// - PlayerBattle cards with Progress bars
// - ProjectionChart with Recharts + glass container
// - ProbabilityGauge custom component
// - PlayerHighlight with shadcn HoverCard
```

---

## PHASE 6: Advanced Features

### Task 6.1: Implement Start/Sit Recommendations
Create recommendation engine:
- AI-powered suggestions
- Confidence percentages
- Alternative options
- Reasoning explanations
- Historical accuracy tracking

### Task 6.2: Build Trade Analyzer
Sophisticated trade analysis:
- Multi-player trade support
- Value calculations
- Rest-of-season projections
- Trade impact on standings
- Fair trade indicator

### Task 6.3: Create Projections Dashboard
Comprehensive projections:
- Weekly point projections
- Probability distributions
- Floor/ceiling analysis
- Boom/bust percentages
- Target share predictions

### Task 6.4: Implement Notification System
Smart notifications:
- Injury updates
- Trade proposals
- Lineup reminders
- Score updates
- News alerts

---

## PHASE 7: League Integration (with Playwright MCP)

### Task 7.1: Build ESPN League Importer (Playwright Automation)
Use Playwright MCP for automated import:
```typescript
// Playwright MCP workflow:
// "Navigate to ESPN Fantasy login page"
// "Automate login with user credentials"
// "Navigate to user's league page"
// "Extract roster data from DOM"
// "Capture league settings"
// "Screenshot for verification"

// Data to extract:
// - League ID and settings
// - Roster compositions
// - Scoring system
// - Transaction history
// - Current standings
```

### Task 7.2: Implement Yahoo Fantasy Integration (Playwright MCP)
Automated Yahoo import process:
```typescript
// Playwright MCP commands:
// "Automate Yahoo Fantasy OAuth flow"
// "Navigate to Yahoo league dashboard"
// "Extract team rosters from page"
// "Scrape league scoring settings"
// "Download transaction log"

// Handle:
// - OAuth authentication
// - Multi-league support
// - Private league access
// - Live scoring sync
```

### Task 7.3: Add Sleeper Integration (Hybrid Approach)
Combine API with Playwright MCP:
```typescript
// Use Sleeper API where available
// Use Playwright MCP for:
// "Login to Sleeper web app"
// "Extract data not in API"
// "Capture league chat history"
// "Screenshot league settings"
```

### Task 7.4: Create CBS Sports Integration (Full Playwright)
Complete automation with Playwright MCP:
```typescript
// CBS doesn't have public API, use Playwright MCP:
// "Automate CBS Sports Fantasy login"
// "Navigate through league pages"
// "Extract all roster data"
// "Scrape custom scoring rules"
// "Download player notes"

// Error handling:
// - Retry failed extractions
// - Handle CAPTCHAs gracefully
// - Fallback to manual entry
```

### Task 7.5: Build Universal Import Handler
Create unified import system:
```typescript
// Features:
// - Platform detection
// - Credential management (secure)
// - Progress indicators
// - Error recovery
// - Import verification with screenshots
// - Data normalization across platforms
```

---

## PHASE 8: Data Visualization

### Task 8.1: Build Performance Charts
Interactive visualizations:
- Season trends
- Points distribution
- Matchup history
- Position performance
- Team comparison radar charts

### Task 8.2: Create Player Cards
Detailed player views:
- Season stats grid
- Game log
- Splits analysis
- Upcoming schedule
- News feed

### Task 8.3: Implement Heat Maps
Visual analysis tools:
- Matchup difficulty
- Position strength
- Weekly projections
- Trade values

---

## PHASE 9: Mobile Optimization

### Task 9.1: Responsive Design Implementation
- Touch-optimized interfaces
- Swipe gestures
- Mobile navigation
- Responsive tables
- Card-based layouts

### Task 9.2: PWA Features
- Service worker setup
- Offline capability
- Push notifications
- App manifest
- Install prompts

---

## PHASE 10: Testing and Deployment

### Task 10.1: Write Comprehensive Tests (with Playwright MCP)
Leverage Playwright MCP for testing:
```typescript
// Unit tests (Jest)
- Algorithm accuracy tests
- Data transformation tests
- API endpoint tests

// E2E tests (Playwright MCP)
// "Test complete user registration flow"
// "Test lineup optimization workflow"
// "Test drag-and-drop roster management"
// "Test league import from ESPN"
// "Verify glass morphism UI across browsers"
// "Test mobile responsive design"
// "Capture screenshots of all major flows"

// Visual regression testing:
// "Screenshot all pages in light/dark mode"
// "Compare UI changes across deployments"
// "Test glass morphism effects in different browsers"

// Performance testing:
// "Measure page load times"
// "Test with 1000+ player datasets"
// "Stress test real-time updates"
```

### Task 10.2: Setup CI/CD Pipeline
Automated testing with Playwright MCP:
```yaml
# GitHub Actions workflow
- Run Playwright MCP tests on PR
- Generate test reports with screenshots
- Visual regression checks
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile viewport testing
- Automated accessibility testing
```

### Task 10.3: Performance Optimization
- Image optimization
- Code splitting
- Lazy loading
- API response caching
- Database query optimization
- Use Playwright MCP to measure improvements

### Task 10.4: Security Implementation
- Input validation
- SQL injection prevention
- XSS protection
- Rate limiting
- API key management
- Use Playwright MCP to test security measures

---

## Environment Variables
```env
# Database
DATABASE_URL="postgresql://..."

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# NFL APIs
ESPN_API_KEY=""
YAHOO_CLIENT_ID=""
SLEEPER_API_TOKEN=""

# AI/ML
OPENAI_API_KEY=""

# Redis
REDIS_URL=""

# Analytics
VERCEL_ANALYTICS_ID=""
```

---

## Implementation Order

### Week 1: Foundation
1. Complete Phase 1 (Setup)
2. Start Phase 2 (NFL Data)

### Week 2: Core Features
3. Complete Phase 2
4. Complete Phase 3 (Algorithm)

### Week 3: User Interface
5. Complete Phase 4 (Landing)
6. Complete Phase 5 (Dashboard)

### Week 4: Advanced Features
7. Complete Phase 6 (Features)
8. Start Phase 7 (Integration)

### Week 5: Polish
9. Complete Phase 7
10. Complete Phase 8 (Visualization)

### Week 6: Launch Prep
11. Complete Phase 9 (Mobile)
12. Complete Phase 10 (Testing/Deploy)

---

## Success Metrics
- [ ] User can create account and manage teams
- [ ] Real-time NFL data updates working
- [ ] AI recommendations achieving >70% accuracy
- [ ] League imports functional for all platforms
- [ ] Mobile responsive with <3s load time
- [ ] Glass morphism UI consistent throughout
- [ ] Trade analyzer providing valuable insights
- [ ] Weekly notifications sending correctly

---

## Additional Notes for Claude Code

### MCP Commands Reference

#### shadcn MCP Commands
```bash
# Component management
"Add shadcn [component-name] component"
"Create Glass[ComponentName] extending shadcn [component] with glass morphism"
"Build [FeatureName] using shadcn [components] with glass morphism styling"
"Update shadcn theme config for soft shadows and glass effects"
"Create [FormName] form using shadcn form components with validation"
"Generate data table with shadcn table including sort, filter, and pagination"
```

#### Playwright MCP Commands 🎭
```bash
# Web scraping
"Navigate to [URL] and extract [data]"
"Scrape NFL player stats from ESPN"
"Extract defensive coordinator data from Pro Football Reference"
"Get injury reports from NFL.com"

# League imports
"Automate ESPN Fantasy login and extract league data"
"Navigate to Yahoo Fantasy and download roster"
"Handle OAuth flow for [platform]"
"Take screenshot of imported data for verification"

# Testing
"Test user registration flow end-to-end"
"Verify drag-and-drop functionality"
"Test responsive design on mobile viewport"
"Generate visual regression test screenshots"
"Test glass morphism effects across browsers"

# Monitoring
"Check if [website] data has updated"
"Monitor for real-time score changes"
"Detect lineup lock times"
```

### Development Workflow with MCP
1. **UI Development**: Use shadcn MCP to rapidly create components
2. **Data Integration**: Use Playwright MCP to scrape and import data
3. **Testing**: Use Playwright MCP for comprehensive E2E testing
4. **Monitoring**: Use Playwright MCP to watch for data updates

### Development Notes
1. **Start Small**: Begin with Phase 1 and test each component before moving forward
2. **MCP First**: Always use MCPs (shadcn/Playwright) before writing from scratch
3. **Mock Data**: Use mock data initially to test UI before API integration
4. **Error Handling**: Implement comprehensive error handling at each step
5. **Type Safety**: Leverage TypeScript for all data models
6. **Component Library**: Build reusable components early using shadcn as base
7. **API Limits**: Implement rate limiting and caching to respect API limits
8. **Testing**: Write tests as you build, not after
9. **Screenshots**: Use Playwright MCP to document UI states and data imports

## Commands to Run
```bash
# After each phase, run:
npm run dev  # Test locally
npm run build  # Ensure builds succeed
npm run test  # Run test suite
npx prisma migrate dev  # Update database
```

This project is designed to be built incrementally. Each task builds upon the previous one, ensuring a stable foundation for this complex application.