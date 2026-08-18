# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres
to [Semantic Versioning](https://semver.org/).

Entries before `1.0.1` are not itemized individually due to the volume of early
history; that baseline is summarized as the initial tracked release.

## [Unreleased]

### Added

- New `header-surface` semantic color token, plus dedicated `--e-schedule-header-bg`
  and `--e-schedule-hour-bg` tokens so the schedule header strip and hour column can
  be themed independently from the body surface.
- Stacked button examples in the playground.

### Changed

- Increased the `stacked` and `fab` button height scale (`$stacked-height`,
  `$fab-height`); both are now expressed in `rem` with a `4.5rem` (72px) default.
- Renamed the internal CSS variable `--schedule-local-event-bg` to
  `--schedule-local-event-accent` for clarity (no visual/behavior change).

### Fixed

- Form validation and button state issues; schedule style and test refinements.

### Security

- Resolved dependency vulnerabilities (`nanoid`, `postcss`, `brace-expansion`,
  `esbuild`, `fast-uri`, `immutable`, `js-cookie`, `lodash`, `shell-quote`, `vite`,
  `vitest`, `ws`) via `npm audit fix`.

## [1.0.4] - 2026-08-17

### Fixed

- Added the missing `license` field (`MIT`) to `package.json` — the npm registry
  was showing the package as unlicensed despite the `LICENSE` file being present.

### Added

- `release` npm script (`scripts/release.mjs`) to automate version bump, publish,
  and tag push.

## [1.0.3] - 2026-08-17

### Added

- `MIT` `LICENSE` file, sponsorship info (`SPONSORING.md`), and issue templates.
- Expanded README with product highlights and clearer install instructions.

### Changed

- Toolbar/field style max-width adjustments.

## [1.0.2] - 2026-08-12

### Fixed

- Forwarded `href` and `to` props on tabs.

## [1.0.1] - 2026-08-12

### Added

- Initial tracked release of the component library baseline (Button, Card,
  Checkbox, Chip, Date Picker, Dialog, Drawer, Form, Grid, Icon, List, Menu,
  Progress, Radio, Schedule, Select, Switch, Tab, Textarea, Textfield, Window)
  with docs and playground scaffolding.

[Unreleased]: https://github.com/everleandro/nuvex-ui/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/everleandro/nuvex-ui/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/everleandro/nuvex-ui/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/everleandro/nuvex-ui/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/everleandro/nuvex-ui/releases/tag/v1.0.1
