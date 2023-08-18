# @marko/compat-v4

## 1.0.4

### Patch Changes

- [`0044e93`](https://github.com/marko-js/compat/commit/0044e93d26febfa14d153e3cd0aebc084351ff44) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Fix issue where if directive migration was running on valid else tags

- [`c6b3b0b`](https://github.com/marko-js/compat/commit/c6b3b0b92db74abc02f9d8976b65dc5c6c73ae9c) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Migrate if attribute on else tag to an else-if tag.

## 1.0.3

### Patch Changes

- [#9](https://github.com/marko-js/compat/pull/9) [`705598e`](https://github.com/marko-js/compat/commit/705598ef6bb7d136c1d948d1639b7a14c2289f0c) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Ensure all tag migrations happen on exit so that directive migrations can run first.

- [#9](https://github.com/marko-js/compat/pull/9) [`705598e`](https://github.com/marko-js/compat/commit/705598ef6bb7d136c1d948d1639b7a14c2289f0c) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Only skip directive migrations for specific tags that handle all attributes. Previously any migrated tag was not properly getting directives migrated.

- [#9](https://github.com/marko-js/compat/pull/9) [`33b1d0d`](https://github.com/marko-js/compat/commit/33b1d0d723c82ade65f27a31910120a29f522417) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Migrate tags with arguments to regular attributes or spreads.

- Updated dependencies [[`705598e`](https://github.com/marko-js/compat/commit/705598ef6bb7d136c1d948d1639b7a14c2289f0c), [`33b1d0d`](https://github.com/marko-js/compat/commit/33b1d0d723c82ade65f27a31910120a29f522417)]:
  - @marko/compat-utils@1.0.1

## 1.0.2

### Patch Changes

- [#4](https://github.com/marko-js/compat/pull/4) [`ad02286`](https://github.com/marko-js/compat/commit/ad02286bf28b66acafa1156dc381e61213be1456) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Allow namespace native tag attributes.

## 1.0.1

### Patch Changes

- [#2](https://github.com/marko-js/compat/pull/2) [`008375a`](https://github.com/marko-js/compat/commit/008375ad1926976462e4dfa56a712a4e22ba6293) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Fix issue where body-only-if migrator was not revisiting arguments

## 1.0.0

### Major Changes

- [`7596527`](https://github.com/marko-js/compat/commit/759652785293c56649165a3862c83ed5f1389d8f) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Initial release.

### Patch Changes

- Updated dependencies [[`7596527`](https://github.com/marko-js/compat/commit/759652785293c56649165a3862c83ed5f1389d8f)]:
  - @marko/compat-utils@1.0.0
