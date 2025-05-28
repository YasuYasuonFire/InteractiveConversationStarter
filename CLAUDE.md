# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js application that generates conversation starters for awkward meeting situations using OpenAI's API. The app allows users to select their relationship with another person (position, age group, proximity level) and generates appropriate conversation starters in Japanese.

## Common Commands

```bash
# Development
npm run dev           # Start development server on localhost:3000
npm run build         # Build for production
npm run start         # Start production server
npm run lint          # Run ESLint
```

## Architecture

### App Structure
- **Hybrid routing**: Uses both App Router (`src/app/`) and Pages Router (`pages/api/`) 
- **Main component**: `src/app/page.jsx` contains the UI form with position, age, and proximity selectors
- **API endpoint**: `pages/api/generate-conversation.js` handles OpenAI API calls
- **Styling**: TailwindCSS with custom purple theme colors (`#8B5CF6`, `#7C3AED`)

### Key Features
- Form with button selection for position (後輩/同僚/目上) and age groups (20s-50s+)
- Proximity slider from formal to casual (フォーマル to カジュアル)
- OpenAI integration using gpt-4o-mini model
- Japanese conversation starter generation with specific formatting requirements

### Environment Variables
- `OPENAI_API_KEY`: Required for the conversation generation API
- Environment variables are loaded via dotenv and exposed through next.config.js

### UI Patterns
- Button states with active/selected styling using purple theme
- Loading states with spinner icons (FontAwesome)
- Range slider with dynamic color gradients based on value
- Conversation output displayed in blue background container