module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }], '@babel/preset-typescript'],

  plugins: [['module-resolver', { alias: { '@name_path': './src/path/path/name_path' } }]],

  ignore: []
}
