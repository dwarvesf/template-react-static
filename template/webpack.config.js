import path from 'path'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import tailwindcss from 'tailwindcss'

import PurgecssPlugin from './purgecss.config'

const getPostCSSLoader = ({ isDev = true }) => ({
  loader: 'postcss-loader',
  options: {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    sourceMap: isDev,
    plugins: () => [
      postcssFlexbugsFixes,
      autoprefixer({
        browsers: ['>0.25%', 'not ie 11', 'not op_mini all'],
        flexbox: 'no-2009',
      }),
      tailwindcss(path.resolve(__dirname, './tailwind.js')),
    ],
  },
})

function getLoaderTest({ isCssModules = false, lang = 'css' }) {
  if (isCssModules) {
    // return /\.module\.css$/
    return new RegExp(`\\.module\\.${lang}$`)
  }
  return filePath => {
    // must match ".css"
    if (!new RegExp(`\\.${lang}$`).test(filePath)) {
      return false
    }
    // and not match ".module.css"
    if (new RegExp(`\\.module\\.${lang}$`).test(filePath)) {
      return false
    }
    return true
  }
}

function getCSSLoader({
  stage,
  lang = 'css',
  modules = false,
  loaders: extraLoaders = [],
}) {
  const isDev = stage === 'dev'
  // loaders
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: isDev,
      minimize: !isDev,
      importLoaders: 1,
      modules,
      localIdentName: modules
        ? 'module__[local]___[hash:base64:5]'
        : '[hash:base64]',
    },
  }
  let loaders = [cssLoader, getPostCSSLoader({ isDev }), ...extraLoaders]
  if (stage === 'dev') {
    loaders = ['style-loader', ...loaders]
  } else if (stage === 'prod') {
    loaders = ExtractTextPlugin.extract({
      fallback: {
        loader: 'style-loader',
        options: {
          sourceMap: false,
          hmr: false,
        },
      },
      use: loaders,
    })
  }

  return {
    include: path.resolve(__dirname, './src'),
    test: getLoaderTest({ isCssModules: modules, lang }),
    use: loaders,
  }
}

function getSASSLoader({ stage, modules = false }) {
  return getCSSLoader({
    stage,
    modules,
    lang: 's(a|c)ss',
    loaders: [
      {
        loader: 'sass-loader',
        options: {
          includePaths: ['src/'],
        },
      },
    ],
  })
}

export default (config, { stage, defaultLoaders }) => {
  const cssLoader = getCSSLoader({ stage, lang: 'css', modules: false })
  const cssModulesLoader = getCSSLoader({ stage, lang: 'css', modules: true })
  const scssLoader = getSASSLoader({ stage, modules: false })
  const scssModulesLoader = getSASSLoader({ stage, modules: true })

  config.module.rules = [
    {
      oneOf: [
        defaultLoaders.jsLoader,
        scssLoader,
        scssModulesLoader,
        cssLoader,
        cssModulesLoader,
        defaultLoaders.fileLoader,
      ],
    },
  ]

  config.plugins.push(PurgecssPlugin)

  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.join(__dirname, 'src'),
  }

  return config
}
