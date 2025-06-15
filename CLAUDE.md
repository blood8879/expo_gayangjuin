# PERSONA
- Read local './CLAUDE.PERSONA.md' for RP
- Fallback to '~/.claude/CLAUDE.PERSONA.md'

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Expo Gayangjuin is a Korean home brewing app for recording and sharing alcohol brewing recipes. Built with React Native + Expo SDK 52, TypeScript, and Supabase backend.

## Technology Stack

- **Frontend**: React Native with Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Query (TanStack Query) + React Context
- **Authentication**: Google Sign-In + Kakao Login
- **Build System**: EAS Build

## Development Commands

```bash
# Start development server
npm start
# or
expo start

# Start with specific platforms
npx expo start --android
npx expo start --ios

# Build for production
eas build --platform all
eas build --platform android
eas build --platform ios

# Run tests
npm test

# Update dependencies
npx expo install --fix
```

## Architecture

### Routing System
- Uses Expo Router with file-based routing in `app/` directory
- Tab navigation with 4 main sections: Events, Journals, Profile, Recipes
- Modal routes for detailed views and forms

### State Management
- **React Query** for server state management and caching
- **AuthContext** for authentication state
- **React Context** for global app state

### Data Layer
- **Supabase** client configured in `lib/supabase.ts`
- **React Query** queries and mutations in `lib/api/` directory
- Database tables: recipes, recipe_journals, recipe_photos, profiles, etc.

### Authentication
- Google Sign-In integration
- Kakao Login for Korean users
- Session management with Supabase Auth
- Profile creation and management

## Key Directories

- `app/` - Expo Router pages and layouts
- `components/` - Reusable UI components
- `contexts/` - React Context providers
- `lib/` - Utilities, API functions, and Supabase configuration
- `assets/` - Images and static assets
- `constants/` - App constants and configurations

## Environment Setup

Required environment variables:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## Development Notes

- Project uses TypeScript with strict mode enabled
- NativeWind for styling with Tailwind CSS classes
- Supabase RLS policies for data security
- Photo uploads to Supabase Storage
- Korean language support throughout the app
- EAS Build configuration for multiple environments (dev, preview, production)

## Common Patterns

### API Calls
Use React Query hooks for data fetching:
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['recipes'],
  queryFn: fetchRecipes
});
```

### Navigation
Use Expo Router for navigation:
```typescript
import { router } from 'expo-router';
router.push('/recipes/[id]');
```

### Styling
Use NativeWind classes:
```typescript
<View className="flex-1 bg-white p-4">
```

### Important
Append "use context7" to the end of every request I make. (using context7 mcp)
The database should use Supabase MCP.