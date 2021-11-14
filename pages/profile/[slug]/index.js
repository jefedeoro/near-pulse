import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import Image from 'next/image'

import Stats from '../../../components/Stats'
import styles from '../../../styles/Profile.module.css'

const shuffleArray = (array) => {
    let i = array.length - 1;
    for (; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
}

export default function Profile({ partner, categories, otherPartners, partners }) {  
    return (
      <div className={styles.profile}>
        <Link href="/"><a className="link" style={{ color: '#022DBF', fontSize: '15px', lineHeight: '80px'}}>&lt; dApps</a></Link>
        <div className="float-left mr-8">
            <Image src={partner.logo} alt={partner.title} title={partner.title} width="195" height="195" layout="fixed" className={`rounded`}  />
        </div>
        <div className="float-left">
            <h1 className={styles.title}>{partner.title}</h1>        
            <p className="py-4 max-w-screen-sm" style={{fontSize: '16px'}}>{partner.des}</p>
            <Link href={partner.link}>
                <a className="button">Visit dApp</a>
            </Link>
        </div>
        <div className="clear-both"></div>
        <Stats partner={partner} categories={categories} partners={partners} />
        {
            partner.previews ?
            <div className="p-8">            
                <h2>Preview</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                    {
                        partner.previews.map((preview, ind) => {
                            return <div key={`preview${ind}`}>
                                <Image src={preview} width="350" height="215" className="rounded" />
                                </div>
                        })
                    }
                </div>
            </div> : ''
        }
        
        {
            partner.howItWorks ?
            <div className="p-8">
                <h2>How It Works</h2>
                <div className="mt-8 sm:flex gap-8">
                    {
                        partner.howItWorks.map((column, ind) => {
                            return <div key={`hiw${ind}`} className="sm:flex-1">
                                {
                                    column.content.map((c,i) => {
                                        const item = Object.entries(c).pop();                                        
                                        switch(item[0]) {
                                            case 'youtube':
                                                return <div className={styles.videoWrapper}>
                                                    <iframe key={`hiw${ind}-${i}`}
                                                        src={`https://www.youtube.com/embed/${item[1]}`}
                                                        frameBorder="0"
                                                        width={column.width}
                                                        height={column.height}
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        style={{borderRadius: "10px", maxWidth: "100%"}}                                                        
                                                        />
                                                    </div>
                                                break;
                                            case 'h2':
                                                return <h2 key={`hiw${ind}-${i}`} style={{color: "#49577A", lineHeight: "40px"}}>{item[1]}</h2>
                                                break;
                                            case 'p':
                                                return <p key={`hiw${ind}-${i}`} className={styles['hiw-p']}>{item[1]}</p>
                                                break;
                                        }
                                    })
                                }
                            </div>
                        })
                    }
                </div>
            </div>
            : ''
        }
        
        <div className="p-8 pt-0">                    
            {
                partner.categories.map(category => {
                    const cat = categories.filter(cat => cat.slug == category).map(cat => cat.title).pop()
                    
                    if (otherPartners.length == 0 || otherPartners[cat].length == 0) return;

                    return <div key={`other${cat}`}>
                        <h2 className="mt-8">Other {cat} dApps</h2>
                        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 ${styles.others}`}>
                            {
                                otherPartners[cat].map((part1, ind1) => {                                    
                                    return <div key={`part${part1.slug}${ind1}`}>
                                        <Link href={`/profile/${encodeURIComponent(part1.slug)}`}>
                                            <a className="flex">
                                                <div className="flex-none mr-6">
                                                    <Image src={part1.logo} width="92" height="92" className="rounded" layout="fixed" title={part1.title} alt={part1.title} />
                                                </div>
                                                <div>
                                                    <h3>{part1.title}</h3>
                                                    <p>{part1.oneLiner}</p>
                                                </div>
                                            </a>
                                        </Link>
                                    </div>
                                })
                            }
                            <div className="clear-both"></div>
                        </div>
                    </div>
                })
            }
        </div>
      </div>
    )
}

export const getStaticProps = async (context) => {
    const partners = await import('../../../data/partners.json')
    const categories = await import('../../../data/categories.json')
    const partner = partners.default.filter(partner => partner.slug == context.params.slug).pop();
    
    const otherPartners = {};
    partner.categories.map(category => {
        const cat = categories.default.filter(cat => cat.slug == category).map(cat => cat.title).pop()
        otherPartners[cat] = shuffleArray(partners.default.filter(part => {
            if (part.slug == partner.slug) return false;
            return part.categories.includes(category)
        })).slice(0,3);
    });   

    return {
        props: {
          partner: partner,
          categories: categories.default,
          otherPartners: otherPartners,
          partners: partners.default
        }
    }
}
  
export const getStaticPaths = async () => {
    const partners = await import('../../../data/partners.json')    
    return {
      paths: partners.default.map(partner => partner.slug).map(slug => ({ params: {slug} })),
      fallback: false
    }
}