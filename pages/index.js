import Link from 'next/link'
import PartnerList from '../components/PartnerList'
import Stats from '../components/Stats'

export default function Home({ partners, categories }) {  
  return (
    <>
      <div className="h-20"></div>
      <h1>Explore the NEAR network</h1>
      <p className="max-w-prose py-6">NEAR is an open source platform that enables creators, communities, and financial markets. Create your wallet and begin your journey on NEAR</p>
      <Link href="https://wallet.near.org/"><a className="button">Create Wallet</a></Link>
      <Stats partners={partners} />
      <PartnerList partners={partners} categories={categories} />
    </>
  )
}

export const getStaticProps = async () => {
  const partners = await import('../data/partners.json')
  const categories = await import('../data/categories.json')
  return {
      props: {
        partners: partners.default,
        categories: categories.default,
      }
  }
}
