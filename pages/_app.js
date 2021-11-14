import Layout from '../components/Layout'
import '../styles/globals.css'

import SearchContextProvider from '../context/search-context'

function MyApp({ Component, pageProps }) {
  return (
    <SearchContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SearchContextProvider>
  )  
}

export default MyApp
