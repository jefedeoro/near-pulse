import { React, useState, useContext } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'

import styles from '../styles/Layout.module.css'

import partners from "../data/partners.json"
import categories from "../data/categories.json"

import { SearchContext } from "../context/search-context";

const fetcher = (url) => fetch(url).then((res) => res.json());

const Layout = ({ children }) => {
    
    const searchContext = useContext(SearchContext);

    const searchQueryHandler = (val) => {
      searchContext.searchHandler(val);
    };

    /*
    const transactions = useSWR('https://api.near-pulse.com/connect/result/3', fetcher)    
    if (transactions.data && !transactions.error) {
    }
    */

    return (
        <>
            <Head>
                <title>Near Pulse</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />            
                <link rel='stylesheet' href='https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&#038;display=swap' type='text/css' media='all' />
                <link rel='stylesheet' href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&#038;display=swap" type='text/css' media='all' /> 
            </Head>
            <div className="flex flex-col min-h-screen">
                <header className="sticky top-0 relative bg-background z-10">
                    <div className="container h-12 md:h-20 flex items-center">
                        <Link href="/">
                            <a className="flex items-center">
                                <svg className="inline mr-2" width="24" height="24" viewBox="0 0 24 24" fill="#5C2EDE" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.6707 1.51836L13.8066 8.75947C13.7278 8.86398 13.6914 8.99456 13.7046 9.12493C13.7179 9.25531 13.7799 9.37581 13.8781 9.4622C13.9763 9.54859 14.1035 9.59446 14.2341 9.59059C14.3647 9.58671 14.489 9.53338 14.582 9.44132L19.3685 5.29317C19.3961 5.26779 19.4306 5.25108 19.4675 5.24514C19.5045 5.23919 19.5424 5.24426 19.5765 5.25972C19.6107 5.27518 19.6395 5.30035 19.6595 5.33211C19.6795 5.36386 19.6898 5.4008 19.689 5.43836V18.4765C19.6886 18.5161 19.6762 18.5546 19.6534 18.5869C19.6306 18.6192 19.5985 18.6438 19.5614 18.6573C19.5244 18.6709 19.484 18.6727 19.4459 18.6626C19.4077 18.6526 19.3735 18.631 19.3479 18.6009L4.87444 1.23058C4.64339 0.951716 4.35432 0.726924 4.0275 0.571965C3.70069 0.417006 3.34404 0.335631 2.98256 0.333545H2.47857C1.82122 0.333545 1.19078 0.595493 0.725958 1.06176C0.261135 1.52803 0 2.16043 0 2.81984V21.1806C0 21.84 0.261135 22.4724 0.725958 22.9387C1.19078 23.4049 1.82122 23.6669 2.47857 23.6669C2.90213 23.6668 3.31861 23.5579 3.68827 23.3505C4.05793 23.1431 4.36843 22.8441 4.59014 22.4821L9.45425 15.2409C9.53307 15.1364 9.56951 15.0059 9.55625 14.8755C9.54299 14.7451 9.481 14.6246 9.38277 14.5382C9.28453 14.4518 9.15732 14.406 9.02673 14.4098C8.89615 14.4137 8.77187 14.467 8.67889 14.5591L3.89232 18.7072C3.86472 18.7326 3.8303 18.7493 3.79333 18.7553C3.75636 18.7612 3.71846 18.7562 3.68434 18.7407C3.65021 18.7252 3.62136 18.7001 3.60136 18.6683C3.58136 18.6366 3.5711 18.5996 3.57184 18.5621V5.53688C3.57222 5.49729 3.58465 5.45877 3.60745 5.42646C3.63025 5.39415 3.66234 5.36959 3.69942 5.35606C3.73651 5.34253 3.77683 5.34068 3.81499 5.35075C3.85316 5.36083 3.88735 5.38234 3.91299 5.41243L18.3864 22.7828C18.6192 23.0592 18.9094 23.2812 19.2366 23.4335C19.5638 23.5857 19.9202 23.6645 20.2809 23.6643H20.7978C21.1233 23.6643 21.4456 23.6 21.7463 23.475C22.047 23.3501 22.3203 23.1669 22.5504 22.9361C22.7806 22.7052 22.9631 22.4311 23.0877 22.1294C23.2123 21.8278 23.2764 21.5045 23.2764 21.178V2.81984C23.2764 2.49202 23.2118 2.16744 23.0862 1.86477C22.9607 1.5621 22.7767 1.28732 22.5449 1.05624C22.3131 0.825163 22.0381 0.642349 21.7356 0.51832C21.4331 0.39429 21.1091 0.331494 20.7823 0.333545C20.3587 0.333596 19.9423 0.442527 19.5726 0.649944C19.2029 0.857361 18.8924 1.15634 18.6707 1.51836Z" fill="#5C2EDE"/>
                                </svg>
                                <span className="logo hidden sm:inline">Pulse</span>
                                <span className="sr-only">NEAR Pulse</span>
                            </a>
                        </Link>
                        <div className="flex sm:flex-grow mx-2 sm:mx-8 pr-4 pl-4 search items-center relative">
                            <i className="search-icon"></i>
                            <input type="text" className="ml-4 sm:flex-grow w-1/2 sm:w-auto" onChange={(e) => { searchQueryHandler(e.target.value); }} />
                            <ul className={`absolute p-6 pt-2 ${styles['search-results']} ${ searchContext.query == '' ? 'hidden' : ''}`}>
                                {

                                    partners
                                    .filter((partner) => {
                                        return searchContext.query == '' ? false : partner.title.toLowerCase().includes(searchContext.query);
                                    }).map((partner) => {  

                                        const tags = partner.categories.map((category) => {
                                            const title = categories.filter((cat) => {
                                                return cat.slug == category
                                            }).map((cat) => cat.title);
                                            return <span className={styles.tag}>{title}</span>
                                        });

                                        return <li key={partner.slug}>
                                                <Link href={`/profile/${encodeURIComponent(partner.slug)}`}>
                                                    <a className="flex items-center">
                                                        <div className={`flex-none ${styles['pr-12px']}`} style={{paddingTop:'5px'}}>
                                                            <Image src={partner.logo} alt={partner.title} title={partner.title} width="40" height="40" layout="fixed" className={`rounded float-left ${styles['icon']}`}  />
                                                        </div>
                                                        <div className="flex-grow">
                                                            <h3>{partner.title}</h3>
                                                            <span className={styles.oneliner}>{partner.oneLiner.replace(/(.{45})..+/, "$1 ...")}</span>
                                                        </div>
                                                        <div className="flex-none hidden sm:block">
                                                            { tags }
                                                        </div>
                                                    </a>
                                                </Link>
                                            </li>
                                    })
                                }
                            </ul>
                        </div>
                        <Link href="https://airtable.com/shrTwgwpPawADJ5O0">
                            <a className="flex-none link whitespace-nowrap text-right sm:text-left">Register dApp</a>
                        </Link>
                    </div>
                </header>
                <main className="relative flex-grow">
                    <div className="container">
                        <div className="content">                            
                            {children}
                        </div>
                    </div>
                </main>
                <footer className="relative py-12 md:py-24">
                    <div className="container">		
                        <div className="hero p-10 flex-none sm:flex">
                            <div className="flex-grow">
                                <h2>Want to become a partner?</h2>
                                <p className="max-w-prose pt-6" style={{fontSize:'14px', fontWeight: 400}}>NEAR is an open source platform that enables creators, communities, and financial markets. Create your wallet and begin your journey on NEAR</p>                            
                            </div>
                            <div>
                                <Link href="https://airtable.com/shrTwgwpPawADJ5O0">
                                    <a className="button mt-8 sm:mt-4" style={{backgroundColor:'#6B6EF9',padding:'15px 32px'}}>Apply Here</a>
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    )
}  

export default Layout
