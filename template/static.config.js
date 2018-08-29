import Document from './src/Document'
import { siteRoot } from './src/config'
import webpack from './webpack.config'

export default {
  preact: true,
  siteRoot: siteRoot,
  bundleAnalyzer: !!process.env.BUNDLE_ANALYZE,
  Document,
  getRoutes: async () => {
    return [
      {
        path: '/',
        component: 'src/pages/home',
      },
      {
        is404: true,
        component: 'src/pages/404',
      },
    ]
  },
  webpack,
}
