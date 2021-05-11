# 2.2.0 (05-11-21)

- Upgraded the dependencies to address some security vulnerabilities. [#43](https://github.com/blackbaud/skyux-builder-stache-search/pull/43)
- Fixed the injected e2e script to work with TypeScript "strict" mode. [#43](https://github.com/blackbaud/skyux-builder-stache-search/pull/43)

# 2.1.0 (07-22-19)
- Updated scraping logic to separate internal only content from external content. [#34](https://github.com/blackbaud/skyux-builder-stache-search/pull/34)

# 2.0.0 (05-22-19)
- Updated import path for `SkyHostBrowser` from `@blackbaud/skyux-builder` to `@skyux-sdk/e2e`. [#35](https://github.com/blackbaud/skyux-builder-stache-search/pull/35)

# 1.7.0 (11-29-18)
- Added ability for users to omit content from Stache Search results. [#32](https://github.com/blackbaud/skyux-builder-stache-search/pull/32)

# 1.6.1 (6-20-18)
- Disabled waiting for Angular. [#30](https://github.com/blackbaud/skyux-builder-stache-search/pull/30)

# 1.6.0 (6-20-18)
- Added the ability to use Angular's router to navigate between routes. [#28](https://github.com/blackbaud/skyux-builder-stache-search/pull/28)

# 1.5.1 (3-20-18)
- Fixed an issue that caused whitespace to be added to the generated e2e files, causing builds to fail. [#26](https://github.com/blackbaud/skyux-builder-stache-search/pull/26)

# 1.5.0 (3-20-18)
- Added feature to disallow site to appear on the global search. [#22](https://github.com/blackbaud/skyux-builder-stache-search/pull/22)

# 1.4.4 (3-20-18)
- Updated timeout for e2e spec. [#23](https://github.com/blackbaud/skyux-builder-stache-search/pull/23)

# 1.4.3 (1-17-18)
- Fixed issue with missing stache directory check in e2e spec. [#19](https://github.com/blackbaud/skyux-builder-stache-search/pull/19)

# 1.4.2 (1-10-18)
- Fixed issue with logger and errorHandler[#17](https://github.com/blackbaud/skyux-builder-stache-search/pull/17)

# 1.4.1 (1-10-18)
- Fixed trailing whitespace in e2e template[#15](https://github.com/blackbaud/skyux-builder-stache-search/pull/15)

# 1.4.0 (1-10-18)
- Converted logging from console to Winston.[#13](https://github.com/blackbaud/skyux-builder-stache-search/pull/13)

# 1.3.3 (12-18-17)
- Updated e2e spec file to filter out pages with no text content.[#11](https://github.com/blackbaud/skyux-builder-stache-search/pull/11)

# 1.3.2 (12-15-17)
- Updated add e2e config to not add the file if it already exists. [#9](https://github.com/blackbaud/skyux-builder-stache-search/pull/9)

# 1.3.1 (11-30-17)
- Updated error handler to display error response from server. [#8](https://github.com/blackbaud/skyux-builder-stache-search/pull/8)

# 1.3.0 (11-29-17)
- Added changes to the e2e spec to publish the config. [#6](https://github.com/blackbaud/skyux-builder-stache-search/pull/6)

# 1.2.0 (10-31-17)
- Removed config check for release command. [#5](https://github.com/blackbaud/skyux-builder-stache-search/pull/5)
- Updated e2e config logic to remove auth key [#5](https://github.com/blackbaud/skyux-builder-stache-search/pull/5)
- Added Version command [#5](https://github.com/blackbaud/skyux-builder-stache-search/pull/5)
- Fixed issue with config not being found in non-spa contexts [#5](https://github.com/blackbaud/skyux-builder-stache-search/pull/5)

# 1.1.0 (10-17-17)
- Prefixed commands with 'stache' [#2](https://github.com/blackbaud/skyux-builder-stache-search/pull/2)
- Added new e2e commands [#2](https://github.com/blackbaud/skyux-builder-stache-search/pull/2)
- Retooled commands to use command arguments instead of environment variables [#2](https://github.com/blackbaud/skyux-builder-stache-search/pull/2)
- Split out the publish and release commands [#2](https://github.com/blackbaud/skyux-builder-stache-search/pull/2)
- Added new utils [#2](https://github.com/blackbaud/skyux-builder-stache-search/pull/2)
- Updated search spec logic [#2](https://github.com/blackbaud/skyux-builder-stache-search/pull/2)

# 1.0.0 (9-14-17)

- Initial release to NPM.
