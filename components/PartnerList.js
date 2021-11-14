import { useCallback, useEffect, useState, useContext } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import useSWR from 'swr'
import Skeleton from 'react-loading-skeleton'

import { providers } from 'near-api-js';

import 'react-loading-skeleton/dist/skeleton.css'
import styles from '../styles/PartnerList.module.css'
import { SearchContext } from "../context/search-context";

const fetcher = (url) => fetch(url).then((res) => res.json());

const PartnerList = ({partners, categories}) => {    
    const searchContext = useContext(SearchContext);

    const [period, setPeriod] = useState('24h')
    const [selectedCategory, setCategory] = useState('all')
    const [sortBy, setSortBy] = useState('transactions')
    const [sortOrder, setSortOrder] = useState('desc')
    const [partnerAcctData, setPartnerAcctData] = useState([])

    let transactions, users, tvt    

    switch(period) {
        case '24h': 
            transactions = useSWR('https://api.near-pulse.com/connect/result/5', fetcher)            
            users = useSWR('https://api.near-pulse.com/connect/result/9', fetcher)        
            tvt = useSWR('https://api.near-pulse.com/connect/result/13', fetcher)
            break;
        case '7d': 
            transactions = useSWR('https://api.near-pulse.com/connect/result/3', fetcher)
            users = useSWR('https://api.near-pulse.com/connect/result/8', fetcher)
            tvt = useSWR('https://api.near-pulse.com/connect/result/12', fetcher)
            break;
        case '30d': 
            transactions = useSWR('https://api.near-pulse.com/connect/result/2', fetcher)
            users = useSWR('https://api.near-pulse.com/connect/result/7', fetcher)
            tvt = useSWR('https://api.near-pulse.com/connect/result/11', fetcher)
            break;
        case 'all': 
            transactions = useSWR('https://api.near-pulse.com/connect/result/1', fetcher)
            users = useSWR('https://api.near-pulse.com/connect/result/6', fetcher)
            tvt = useSWR('https://api.near-pulse.com/connect/result/10', fetcher)            
            break;
    }
    const transactions_data = transactions.data ? JSON.parse(transactions.data.query_result) : null;    
    const users_data = users.data ? JSON.parse(users.data.query_result) : null;    
    const tvt_data = tvt.data ? JSON.parse(tvt.data.query_result) : null;

    const fiat = useSWR('https://helper.mainnet.near.org/fiat', fetcher)      

    const sortCallback = (column) => {
        if (column != sortBy) setSortBy(column);
        else setSortOrder(sortOrder == 'desc' ? 'asc' : 'desc');
    }        

    useEffect(() => {
        (async () => {
            const provider = new providers.JsonRpcProvider("https://rpc.mainnet.near.org");
            const data = []
            for (let i = 0; i < partners.length; i++) {       
                if (partners[i].contract) {      
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
            <div className={`flex flex-wrap p-8 my-12 ${styles.leaderboard}`}>
                <h2 className="pb-8 flex-none">NEAR dApps</h2>
                <ul className="flex-grow cursor-pointer inline-block text-center">
                    <li key="all" onClick={() => setCategory('all')} className={`${selectedCategory == 'all' ? styles.selected : ''} inline`}>All</li>
                    {
                        categories.filter((category) => category.filter).map((category) => {   
                            return <li key={category.slug} onClick={() => setCategory(category.slug)} className={`${selectedCategory == category.slug ? styles.selected : ''} inline-block sm:inline`}>{category.title}</li>
                        })
                    }                
                </ul>
                <ul className="flex-none cursor-pointer text-center sm:text-right inline-block mt-6 sm:mt-0 w-full sm:w-auto">
                    <li key="24h" onClick={() => setPeriod('24h')} className={`${period == '24h' ? styles.selected : ''} inline`}>24h</li>
                    <li key="7d"  onClick={() => setPeriod('7d')}  className={`${period == '7d'  ? styles.selected : ''} inline`}>7d</li>
                    <li key="30d" onClick={() => setPeriod('30d')} className={`${period == '30d' ? styles.selected : ''} inline`}>30d</li>
                    <li key="all" onClick={() => setPeriod('all')} className={`${period == 'all' ? styles.selected : ''} inline`}>All</li>
                </ul>
                <div className="w-full overflow-x-auto">
                    <table className='table-auto w-full mt-8 sm:mt-0'>
                        <thead>
                            <tr>
                                <th className="text-left uppercase">dApp</th>
                                <th className="uppercase" onClick={() => sortCallback('transactions')}>
                                    Transactions
                                    {
                                        sortBy == 'transactions' ? <i className={sortOrder == 'desc' ? styles.sortByDesc : styles.sortByAsc } /> : ''
                                    }
                                </th>
                                <th className="uppercase" onClick={() => sortCallback('users')}>
                                    Users
                                    {
                                        sortBy == 'users' ? <i className={sortOrder == 'desc' ? styles.sortByDesc : styles.sortByAsc } /> : ''
                                    }
                                </th>
                                <th className="uppercase" onClick={() => sortCallback('tvt')}>
                                    TVT
                                    {
                                        sortBy == 'tvt' ? <i className={sortOrder == 'desc' ? styles.sortByDesc : styles.sortByAsc } /> : ''
                                    }
                                </th>
                                <th className="uppercase" onClick={() => sortCallback('tvl')}>
                                    TVL
                                    {
                                        sortBy == 'tvl' ? <i className={sortOrder == 'desc' ? styles.sortByDesc : styles.sortByAsc } /> : ''
                                    }
                                </th>
                                <th className="uppercase" onClick={() => sortCallback('cap')}>
                                    CAP
                                    {
                                        sortBy == 'cap' ? <i className={sortOrder == 'desc' ? styles.sortByDesc : styles.sortByAsc } /> : ''
                                    }
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                partners
                                .filter((partner) => {
                                    if (searchContext.query != ''){
                                        return partner.title.toLowerCase().includes(searchContext.query);
                                    }
                                    return true;
                                })
                                .filter((partner) => {
                                    return selectedCategory == 'all' || partner.categories.includes(selectedCategory)
                                })
                                .sort((a,b) => {
                                    switch(sortBy){
                                        case 'transactions':
                                            if (transactions.data) {
                                                const a_transactions = transactions_data
                                                                        .filter(obj => a.contract && a.contract.includes(obj.receiver_account_id))
                                                                        .reduce((total, currentValue) => {
                                                                            return (total ?? 0) + +(currentValue.transactions_count ?? 0)
                                                                        }, 0);

                                                const b_transactions = transactions_data
                                                                        .filter(obj => b.contract && b.contract.includes(obj.receiver_account_id))
                                                                        .reduce((total, currentValue) => {
                                                                            return +(total ?? 0) + +(currentValue.transactions_count ?? 0)
                                                                        }, 0);
                                                return (a_transactions > b_transactions ? 1 : -1) * (sortOrder == 'desc' ? -1 : 1);
                                            }
                                            return -1;
                                            break;
                                        case 'users':
                                            if (users.data) {
                                                const a_transactions = users_data
                                                                        .filter(obj => a.contract && a.contract.includes(obj.receiver_account_id))
                                                                        .reduce((total, currentValue) => {
                                                                            return (total ?? 0) + +(currentValue.user_amount ?? 0)
                                                                        }, 0);

                                                const b_transactions = users_data
                                                                        .filter(obj => b.contract && b.contract.includes(obj.receiver_account_id))
                                                                        .reduce((total, currentValue) => {
                                                                            return +(total ?? 0) + +(currentValue.user_amount ?? 0)
                                                                        }, 0);
                                                return (a_transactions > b_transactions ? 1 : -1) * (sortOrder == 'desc' ? -1 : 1);
                                            }
                                            return -1;
                                            break;
                                        case 'tvt':
                                            if (tvt.data) {
                                                const a_transactions = tvt_data
                                                                        .filter(obj => a.contract && a.contract.includes(obj.receiver_account_id))
                                                                        .reduce((total, currentValue) => {
                                                                            return (total ?? 0) + +(currentValue.token_value ?? 0)
                                                                        }, 0);

                                                const b_transactions = tvt_data
                                                                        .filter(obj => b.contract && b.contract.includes(obj.receiver_account_id))
                                                                        .reduce((total, currentValue) => {
                                                                            return +(total ?? 0) + +(currentValue.token_value ?? 0)
                                                                        }, 0);
                                                return (a_transactions > b_transactions ? 1 : -1) * (sortOrder == 'desc' ? -1 : 1);
                                            }
                                            return -1;
                                            break;
                                        case 'tvl':
                                            if (partnerAcctData.length) {

                                                const a_transactions = partnerAcctData
                                                    .filter((acct) => a.contract && a.contract.includes(acct.account) )
                                                    .map(acct => +(acct.locked))
                                                    .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0), 0)  

                                                const b_transactions = partnerAcctData
                                                    .filter((acct) => b.contract && b.contract.includes(acct.account) )
                                                    .map(acct => +(acct.locked))
                                                    .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0), 0)


                                                return (a_transactions > b_transactions ? 1 : -1) * (sortOrder == 'desc' ? -1 : 1);
                                            }
                                            return -1;
                                            break;
                                        case 'cap':
                                            if (partnerAcctData.length) {

                                                const a_transactions = partnerAcctData
                                                    .filter((acct) => a.contract && a.contract.includes(acct.account) )
                                                    .map(acct => +(acct.amount) +(acct.locked))
                                                    .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0), 0)  

                                                const b_transactions = partnerAcctData
                                                    .filter((acct) => b.contract && b.contract.includes(acct.account) )
                                                    .map(acct => +(acct.amount) +(acct.locked))
                                                    .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0), 0)


                                                return (a_transactions > b_transactions ? 1 : -1) * (sortOrder == 'desc' ? -1 : 1);
                                            }
                                            return -1;
                                            break;
                                    }
                                    return -1;
                                })
                                .map((partner) => {        
                                    const filteredData_transactions = transactions.data && transactions_data.filter(obj => partner.contract && partner.contract.includes(obj.receiver_account_id));
                                    const filteredData_users = users.data && users_data.filter(obj => partner.contract && partner.contract.includes(obj.receiver_account_id));
                                    const filteredData_tvt = tvt.data && tvt_data.filter(obj => partner.contract && partner.contract.includes(obj.receiver_account_id));
                                    
                                    return <tr key={partner.slug}>
                                        <td>
                                            <Link href={`/profile/${encodeURIComponent(partner.slug)}`}>
                                                <a>
                                                    <div className={`float-none sm:float-left ${styles['pr-12px']}`}>
                                                        <Image src={partner.logo} alt={partner.title} title={partner.title} width="40" height="40" layout="fixed" className={`rounded float-left ${styles['icon']}`}  />
                                                    </div>
                                                    <h3>{partner.title}</h3>
                                                    <span className={styles.oneliner}>{partner.oneLiner.replace(/(.{52})..+/, "$1 ...")}</span>
                                                </a>
                                            </Link>
                                        </td>
                                        <td>
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
                                        </td>
                                        <td>
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
                                        </td>                                        
                                        <td>
                                            {
                                                /*
                                                TVT = Total Volume Transacted
                                                */
                                                tvt.error || !tvt.data ?
                                                <Skeleton /> :
                                                filteredData_tvt.length 
                                                    ? Math.round((filteredData_tvt
                                                        .map(obj => +(obj.token_value))
                                                        .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0)) ) / (1000000000000000000000000))
                                                        .toLocaleString('en-US')  
                                                    : '0'
                                            }
                                        </td>
                                        <td>                                             
                                            {
                                                partnerAcctData.length 
                                                ?
                                                partnerAcctData
                                                    .filter((acct) => partner.contract && partner.contract.includes(acct.account) )
                                                    .map(acct => +(acct.locked))
                                                    .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0), 0)  / (1000000000000000000000000)                                                       
                                                : <Skeleton /> 

                                                /*
                                                TVL = Total Value Locked
                                                TVL (Total Value Locked) = NEAR in validator in USD
                                                */
                                            }
                                        </td>
                                        <td> 
                                            {
                                                partnerAcctData.length 
                                                    ?
                                                    Math.round(partnerAcctData
                                                        .filter((acct) => partner.contract && partner.contract.includes(acct.account) )
                                                        .map(acct => +(acct.amount) + +(acct.locked))
                                                        .reduce((total, currentValue) => +(total ?? 0) + +(currentValue ?? 0), 0)  / (1000000000000000000000000) * (!fiat.error && fiat.data && false ? fiat.data.near.usd : 1))
                                                        .toLocaleString('en-US') + ((!fiat.error && fiat.data && false ? ' USD' : ' NEAR')) 
                                                    : <Skeleton /> 
                                                
                                                /*                                                
                                                CAP is TVT * that fiat value
                                                https://helper.mainnet.near.org/fiat

                                                Total Volume = TVT for all apps/accounts

                                                */
                                            }
                                        </td>
                                    </tr>
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default PartnerList
