# Welcome!

This is a yarn v4 monorepo that primarily manages the [**react-use-audio-player**](https://www.npmjs.com/package/react-use-audio-player) package, which helps React developers better control sound in their web applications.

![Version](https://img.shields.io/npm/v/react-use-audio-player)
![CI](https://github.com/E-Kuerschner/useAudioPlayer/actions/workflows/CI.yml/badge.svg)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-use-audio-player)
<a href="https://buymeacoffee.com/erichk" title="Donate to this project using Buy Me A Coffee"><img src="https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg" alt="Buy Me A Coffee donate button" /></a>

```bash
yarn add react-use-audio-player

npm install react-use-audio-player
```

#### For complete package documentation, see the [package README](/packages/react-use-audio-player/README.md)

## Monorepo Setup

In order to contribute to the project, build the package locally, or run the demo applications, you will need to make sure your environment is set up correctly.

I recommend using [NVM](https://github.com/nvm-sh/nvm) to make sure you use the correct NodeJS version.

The repo uses[ _modern_ Yarn](https://yarnpkg.com/getting-started/install) which requires one to enable _corepack_ on their NodeJS installation. 
This feature is only available on newer releases which is why it is important to use the established NodeJS version in the `.nvmrc` file.

1. `git clone` the repository
2. `cd useAudioPlayer`
3. `nvm use`
4. `corepack enable`
5. `yarn install`

## Examples

You can view example applications using the package in the [demos](https://github.com/E-Kuerschner/useAudioPlayer/tree/main/demos) directory. 
If you would like to run them yourself please following the following steps:

1. Complete the steps in **Monorepo Setup** above
2. Build the **react-use-audio-player** package locally with - `yarn g:build-package`
3. `cd` into any of the demo workspaces and run `yarn start`
4. or leverage `yarn workspace` commands - `yarn workspace [NAME OF DEMO FOLDER] start`
5. follow terminal output or the demo's README for further assistance

## Contributing

Please consider opening an Issue or Feature Request in Github and I will do my best to respond to these in a timely manner.
However, as a sole contributor, it can often be hard to set aside time to make meaningful changes to the project.
I will be happy to review and discuss pull requests with anyone who wants to help.