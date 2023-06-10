import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import Layout from '../modules/sound-mgmt/infrastructure/ui/components/Layout';

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <Toaster  />
    </Layout>
  )

}

export default MyApp
