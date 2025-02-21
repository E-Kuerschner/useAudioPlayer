# Change Log

All notable changes made to this project from v3.0.0 and up will be documented in this file. This project uses semver standards.

## 3.1.0 (2025-02-21)

### New Features

- deprecates `useGlobalAudioPlayer` in favor of new additions
- exports new component: `AudioPlayerProvider` and companion hook: `useAudioPlayerContext`
  - See GitHub [Discussion](https://github.com/E-Kuerschner/useAudioPlayer/discussions/157)

## 3.0.2 (2025-01-05)

### Fixes

- Repair broken file extensions in package.json exports

## 3.0.1 (2025-01-05)

### Fixes

- Update bundled README
- Cleanup yarn config

## 3.0.0 (2025-01-05)

This set of changes is intened to be non-breaking, but due to using a different bundler (tsup) I decided to release this as a major version as the exported files from the package have technically changed. 
Please report any issue using this new version.

### Refactors

- Replace unmaintained TSDX with modern tsup
- modernize project with monorepo setup for package and demo apps
- upgrade yarn to modern version
- modernize package.json (using exports key)
- switch to GH Actions instead of Circle CI
