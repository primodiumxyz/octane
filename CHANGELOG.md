# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2024-03-XX

### Added
- New `.npmrc` configuration with `shamefully-hoist=true` and `strict-peer-dependencies=false`
- Added `returnSignature.type: "allowAll"` to config.json

### Changed
- Migrated package manager to pnpm
- Updated dependencies and build configuration

### Fixed
- Type safety improvement in `simulateRawTransaction.ts`: Modified `accounts.addresses` to always return string array
- Updated import in `simulateRawTransaction.ts`: Changed `Transaction` to `VersionedTransaction` from '@solana/web3.js'
- General build-related fixes

[0.0.1]: https://github.com/yourusername/your-repo/releases/tag/v0.0.1 