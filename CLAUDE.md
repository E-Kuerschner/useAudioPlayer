# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Yarn v4 monorepo for the `react-use-audio-player` package, a React hook library for building custom audio playback controls. The package is built on top of Howler.js and provides React state synchronization with audio playback.

## Development Environment Setup

1. Use Node.js version specified in `.nvmrc` (v22.12.0)
2. Enable corepack: `corepack enable`
3. Install dependencies: `yarn install`
4. The project uses Yarn v4 with workspaces enabled

## Common Commands

### Building and Development
- `yarn g:build-package` - Build the react-use-audio-player package from anywhere in the monorepo
- `yarn workspace react-use-audio-player build` - Build the main package directly
- `yarn workspace react-use-audio-player build-watch` - Build in watch mode
- `yarn workspace react-use-audio-player lint` - TypeScript type checking (no ESLint, just `tsc`)

### Linting and Quality
- `yarn lint-all` - Run lint across all workspaces
- `yarn constraints` - Enforce Yarn workspace constraints

### Demo Applications
- `yarn workspace showcase start` - Run the showcase demo
- `yarn workspace global-audio start` - Run the global audio demo
- `yarn workspace remix-app dev` - Run the Remix demo

### Release
- `yarn workspace react-use-audio-player release` - Publish the package to npm

## Architecture

### Monorepo Structure
- `packages/react-use-audio-player/` - Main package source
- `demos/` - Example applications showcasing the package
  - `showcase/` - Comprehensive demo with multiple use cases
  - `global-audio/` - Global audio context example
  - `remix-app/` - Remix framework integration example

### Core Package Architecture

The main package (`packages/react-use-audio-player/`) has a simple but effective architecture:

- **`src/index.ts`** - Main export file
- **`src/useAudioPlayer.ts`** - Primary hook implementation
- **`src/AudioPlayerProvider.tsx`** - Context provider for shared audio instances
- **`src/HowlStore.ts`** - State management layer using React's `useSyncExternalStore`
- **`src/howlCache.ts`** - Caching mechanism for Howler.js instances
- **`src/types.ts`** - TypeScript type definitions

### Key Design Patterns

1. **State Synchronization**: Uses React's `useSyncExternalStore` to sync audio state with React components
2. **Hook Variants**: Two main usage patterns:
   - `useAudioPlayer()` - Component-scoped audio instances
   - `useAudioPlayerContext()` - Shared audio instance via React Context
3. **Howler.js Integration**: Built on top of Howler.js with escape hatch access to underlying `Howl` instances
4. **Caching**: Audio resources are cached to prevent redundant loading

### Build System

- Uses `tsup` for building ESM/CJS dual packages with TypeScript declarations
- TypeScript is used for type checking (not ESLint)
- Builds to `dist/` with source maps and minification

## Workspace Configuration

The monorepo enforces:
- Consistent dependency versions across workspaces (via yarn.config.cjs constraints)
- Workspace protocol usage for internal dependencies
- Pre-commit hooks run linting across all workspaces

## Package Dependencies

- **Runtime**: `howler` (audio engine), `react` (peer dependency)
- **Build**: `tsup`, `typescript`
- **Testing**: `cypress` (integration tests)

## Development Notes

- The package is side-effect free (`"sideEffects": false`)
- Supports React 18+ as peer dependency
- Built for ES6+ environments
- Uses modern Yarn features including constraints and workspace protocols