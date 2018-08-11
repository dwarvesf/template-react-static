// https://sao.js.org/#/create?id=config-file

module.exports = {
  prompts: {
    name: {
      message: 'What is the name of the new project?',
      default: ':folderName:',
    },
    description: {
      message: 'How would you describe the new project?',
      default: 'my web project',
    },
  },
  move: {
    gitignore: '.gitignore',
  },
  showTip: true,
  gitInit: true,
  installDependencies: true,
};
