---
"marko-widgets": patch
"@marko/compat-utils": patch
"@marko/compat-v4": patch
---

Only skip directive migrations for specific tags that handle all attributes. Previously any migrated tag was not properly getting directives migrated.
