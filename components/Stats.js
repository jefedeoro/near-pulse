import { useState, useEffect } from 'react'
import useSWR from 'swr'
import Skeleton from 'react-loading-skeleton'

import { providers } from 'near-api-js';

import 'react-loading-skeleton/dist/skeleton.css'
import styles from '../styles/Stats.module.css'

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Stats({ partner, categories, assets, partners }) {  

    const [period, setPeriod] = useState('24h')
    const [partnerAcctData, setPartnerAcctData] = useState([])

    let transactions, users, tvt
    switch(period) {
        case '24h': 
            transactions = useSWR('https://api.near-pulse.com/connect/result/5', fetcher, { refreshInterval: 5000 })
            users = useSWR('https://api.near-pulse.com/connect/result/9', fetcher, { refreshInterval: 5000 })
            tvt = useSWR('https://api.near-pulse.com/connect/result/13', fetcher, { refreshInterval: 5000 })
            break;
        case '7d': 
            transactions = useSWR('https://api.near-pulse.com/connect/result/3', fetcher, { refreshInterval: 5000 })
            users = useSWR('https://api.near-pulse.com/connect/result/8', fetcher, { refreshInterval: 5000 })
            tvt = useSWR('https://api.near-pulse.com/connect/result/12', fetcher, { refreshInterval: 5000 })
            break;
        case '30d': 
            transactions = useSWR('https://api.near-pulse.com/connect/result/2', fetcher, { refreshInterval: 5000 })
            users = useSWR('https://api.near-pulse.com/connect/result/7', fetcher, { refreshInterval: 5000 })
            tvt = useSWR('https://api.near-pulse.com/connect/result/11', fetcher, { refreshInterval: 5000 })
            break;
        case 'all': 
            transactions = useSWR('https://api.near-pulse.com/connect/result/1', fetcher, { refreshInterval: 5000 })
            users = useSWR('https://api.near-pulse.com/connect/result/6', fetcher, { refreshInterval: 5000 })
            tvt = useSWR('https://api.near-pulse.com/connect/result/10', fetcher, { refreshInterval: 5000 })
            break;
    }
    const transactions_data = transactions.data ? JSON.parse(transactions.data.query_result) : null;    
    const users_data = users.data ? JSON.parse(users.data.query_result) : null;    
    const tvt_data = tvt.data ? JSON.parse(tvt.data.query_result) : null;    

    const filteredData_transactions = transactions.data && transactions_data.filter(obj => partner ? partner.contract && partner.contract.includes(obj.receiver_account_id) : true );
    const filteredData_users = users.data && users_data.filter(obj => partner ? partner.contract && partner.contract.includes(obj.receiver_account_id) : true);
    const filteredData_tvt = tvt.data && tvt_data.filter(obj => partner ? partner.contract && partner.contract.includes(obj.receiver_account_id) : true);

    useEffect(() => {
        (async () => {            
            const provider = new providers.JsonRpcProvider("https://rpc.mainnet.near.org");
            const data = []
            for (let i = 0; i < partners.length; i++) {       
                if ((!partner && partners[i].contract) || (partner && partners[i].slug == partner.slug && partners[i].contract)) {      
                    for (let ii = 0; ii < partners[i].contract.length; ii++) {       
                        const response = await provider.query({
                            request_type: 'view_account',
                            finality: 'optimistic',
                            account_id: partners[i].contract[ii]
                        });
                        data.push({ ...response, account: partners[i].contract[ii] });                        
                    }
                }
            }            
            setPartnerAcctData(data)
        })();
    }, [])   

    return (
      <>
        <div className={styles.stats}>            
            <div className="sm:flex">                
                <h2 className="inline mr-2 sm:mr-6">Stats</h2>
                <div className="float-right sm:float-none">
                    {
                        !partner 
                            ? '' 
                            : partner.categories.map((category) => {
                                const title = categories.filter((cat) => {
                                    return cat.slug == category
                                }).map((cat) => cat.title).reduce((cat) => cat.title);
                                return <span key={category} className={styles.tag}>{title}</span>
                            })
                        
                    }
                </div>
                <ul className="cursor-pointer text-center sm:text-right flex-grow mt-6 sm:mt-0">
                    <li key="24h" onClick={() => setPeriod('24h')} className={`${period == '24h' ? styles.selected : ''} inline`}>24h</li>
                    <li key="7d"  onClick={() => setPeriod('7d')}  className={`${period == '7d'  ? styles.selected : ''} inline`}>7d</li>
                    <li key="30d" onClick={() => setPeriod('30d')} className={`${period == '30d' ? styles.selected : ''} inline`}>30d</li>
                    <li key="all" onClick={() => setPeriod('all')} className={`${period == 'all' ? styles.selected : ''} inline`}>All</li>
                </ul>
            </div>
            <div className="clear-both grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                <div className={`pt-6 ${styles.stat}`}>
                    Transactions
                    <div>
                        {                                        
                            transactions.error || !transactions.data ?
                            <Skeleton /> :
                            filteredData_transactions.length 
                                ? filteredData_transactions
                                    .map(obj => +(obj.transactions_count))
                                    .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0))
                                    .toLocaleString('en-US') 
                                : '0'
                        }
                    </div>
                </div>
                <div className={`pt-6 ${styles.stat}`}>
                    Users
                    <div>
                        {
                            users.error || !users.data ?
                            <Skeleton /> :
                            filteredData_users.length 
                                ? filteredData_users
                                    .map(obj => +(obj.user_amount))
                                    .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0))
                                    .toLocaleString('en-US')  
                                : '0'
                        }
                    </div>
                </div>
                <div className={`pt-6 ${styles.stat}`}>
                    Volume
                    <div>
                        {
                            tvt.error || !tvt.data ?
                            <Skeleton /> :
                            filteredData_tvt.length 
                                ? Math.round(filteredData_tvt
                                    .map(obj => +(obj.token_value))
                                    .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0)) / (1000000000000000000000000))
                                    .toLocaleString('en-US')  
                                : '0'
                        }
                    </div>
                </div>
                <div className={`pt-6 ${styles.stat}`}>
                    Assets
                    <div>
                        {
                            /*partnerAcctData.length  
                                ? Math.round(partnerAcctData
                                    .filter((acct) => !partner || (partner && partner.contract && partner.contract.includes(acct.account)) )
                                    .map(acct => +(acct.amount) + +(acct.locked))
                                    .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0), 0)  / (1000000000000000000000000) )
                                    .toLocaleString('en-US') + ' NEAR' 
                                :*/ <Skeleton enableAnimation={false} baseColor="rgba(243, 246, 249, 0.4)" />
                        }
                    </div>
                </div>
            </div>
        </div>        
      </>
    )
}
