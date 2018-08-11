import React from 'react'
import { Router, Route } from 'react-static'
import Routes from 'react-static-routes'

import '@/css/tailwind.scss'
import '@/utils/loading'

// renderer for `<Routes>`
const RenderRoutes = ({ getComponentForPath }) => (
  // The default renderer uses a catch all route to recieve the pathname
  <Route
    path="*"
    render={props => {
      // The pathname is used to retrieve the component for that path
      let Comp = getComponentForPath(props.location.pathname)
      // The component is rendered!
      return <Comp key={props.location.pathname} {...props} />
    }}
  />
)

const App = () => (
  <main className="font-sans font-normal text-black leading-normal">
    <Router>
      <Routes>{RenderRoutes}</Routes>
    </Router>
  </main>
)

export default App
