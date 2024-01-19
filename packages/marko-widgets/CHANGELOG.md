# marko-widgets

## 8.0.11

### Patch Changes

- [#18](https://github.com/marko-js/compat/pull/18) [`08b6ee5`](https://github.com/marko-js/compat/commit/08b6ee58cbd51a6fee42a66df2180d92442e98f6) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Improve handling of non standard template literals when there are escape sequences.

- Updated dependencies [[`08b6ee5`](https://github.com/marko-js/compat/commit/08b6ee58cbd51a6fee42a66df2180d92442e98f6)]:
  - @marko/compat-v4@1.0.7

## 8.0.10

### Patch Changes

- [#16](https://github.com/marko-js/compat/pull/16) [`261aba9`](https://github.com/marko-js/compat/commit/261aba9185d8c7d13e67a1c015280296d9c19fc2) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Avoid circular references when registering widgets with defineComponent

## 8.0.9

### Patch Changes

- [`c042454`](https://github.com/marko-js/compat/commit/c0424540796edb2241575f333ff4d000a1dc7726) Thanks [@mlrawlings](https://github.com/mlrawlings)! - [#14](https://github.com/marko-js/compat/pull/14) avoid the nullish coalescing operator

- Updated dependencies [[`c042454`](https://github.com/marko-js/compat/commit/c0424540796edb2241575f333ff4d000a1dc7726)]:
  - @marko/compat-v4@1.0.6

## 8.0.8

### Patch Changes

- [`69c1d09`](https://github.com/marko-js/compat/commit/69c1d09af2047ec3c257f0caed24bcc54fb32727) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Fix issue where layout-put was not properly camelcasing dashed names

## 8.0.7

### Patch Changes

- [`85f920c`](https://github.com/marko-js/compat/commit/85f920c22323cb0cd3c6a6da51d3e07dc14824c1) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Fix issue where the if directive was not removed from an else tag.

- Updated dependencies [[`85f920c`](https://github.com/marko-js/compat/commit/85f920c22323cb0cd3c6a6da51d3e07dc14824c1)]:
  - @marko/compat-v4@1.0.5

## 8.0.6

### Patch Changes

- [`c9fc240`](https://github.com/marko-js/compat/commit/c9fc240f1579c90b27d279ab1da8365db42606f8) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Fix issue where layout-placeholder's were not properly being converted to camelCase.

- Updated dependencies [[`0044e93`](https://github.com/marko-js/compat/commit/0044e93d26febfa14d153e3cd0aebc084351ff44), [`c6b3b0b`](https://github.com/marko-js/compat/commit/c6b3b0b92db74abc02f9d8976b65dc5c6c73ae9c)]:
  - @marko/compat-v4@1.0.4

## 8.0.5

### Patch Changes

- [#9](https://github.com/marko-js/compat/pull/9) [`705598e`](https://github.com/marko-js/compat/commit/705598ef6bb7d136c1d948d1639b7a14c2289f0c) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Ensure all tag migrations happen on exit so that directive migrations can run first.

- [#9](https://github.com/marko-js/compat/pull/9) [`705598e`](https://github.com/marko-js/compat/commit/705598ef6bb7d136c1d948d1639b7a14c2289f0c) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Only skip directive migrations for specific tags that handle all attributes. Previously any migrated tag was not properly getting directives migrated.

- Updated dependencies [[`705598e`](https://github.com/marko-js/compat/commit/705598ef6bb7d136c1d948d1639b7a14c2289f0c), [`705598e`](https://github.com/marko-js/compat/commit/705598ef6bb7d136c1d948d1639b7a14c2289f0c), [`33b1d0d`](https://github.com/marko-js/compat/commit/33b1d0d723c82ade65f27a31910120a29f522417)]:
  - @marko/compat-v4@1.0.3
  - @marko/compat-utils@1.0.1

## 8.0.4

### Patch Changes

- [`dcc424d`](https://github.com/marko-js/compat/commit/dcc424d174a78eaee1278fe53fd26e074cb339d9) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Fix issue where a node was removed but the NodePath still exists while optimizing html.

## 8.0.3

### Patch Changes

- [#6](https://github.com/marko-js/compat/pull/6) [`dd221c1`](https://github.com/marko-js/compat/commit/dd221c1138ed7332301935b6195ccc9e91061372) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Fix issue where user provided id on an element with `w-bind` was being replaced.

## 8.0.2

### Patch Changes

- [#4](https://github.com/marko-js/compat/pull/4) [`ad02286`](https://github.com/marko-js/compat/commit/ad02286bf28b66acafa1156dc381e61213be1456) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Allow namespace native tag attributes.

- Updated dependencies [[`ad02286`](https://github.com/marko-js/compat/commit/ad02286bf28b66acafa1156dc381e61213be1456)]:
  - @marko/compat-v4@1.0.2

## 8.0.1

### Patch Changes

- [#2](https://github.com/marko-js/compat/pull/2) [`008375a`](https://github.com/marko-js/compat/commit/008375ad1926976462e4dfa56a712a4e22ba6293) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Fix issue where body-only-if migrator was not revisiting arguments

- Updated dependencies [[`008375a`](https://github.com/marko-js/compat/commit/008375ad1926976462e4dfa56a712a4e22ba6293)]:
  - @marko/compat-v4@1.0.1

## 8.0.0

### Major Changes

- [`7596527`](https://github.com/marko-js/compat/commit/759652785293c56649165a3862c83ed5f1389d8f) Thanks [@DylanPiercey](https://github.com/DylanPiercey)! - Initial release.

### Patch Changes

- Updated dependencies [[`7596527`](https://github.com/marko-js/compat/commit/759652785293c56649165a3862c83ed5f1389d8f)]:
  - @marko/compat-utils@1.0.0
  - @marko/compat-v4@1.0.0
