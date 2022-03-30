import './DataTable.css';
import React, {useState, useEffect, useCallback} from "react";
import sortIco from '../img/icons/sort.svg';
import socketIOClient from "socket.io-client";
import {formatDate} from '../utils';
const BACKEND_URL = "http://127.0.0.1:3001";


function DataTable(props) {
  const [sortingColumn, setSortingColumn] = useState('date');
  const [sortingDirection, setSortingDirection] = useState('desc');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(total / props.itemsPerPage);
  const [transactions, setTransactions] = useState([]);

  const headers = {
    date: 'Date & Time',
    crypto: 'Currency From',
    amountCrypto: 'Amount 1',
    currency: 'Currency To',
    amountCurrency: 'Amount 2',
    type: 'Type'
  };

  useEffect(() => {
    let query = `${sortingColumn}:${sortingDirection}?page=${page}&limit=${props.itemsPerPage}`;
    if (props.startDate) {
      query += `&start=${props.startDate.toISOString()}`;
    }    
    if (props.startDate) {
      query += `&end=${props.endDate.toISOString()}`;
    }
    fetch(`${BACKEND_URL}/transactions/${query}`)
    .then(res => res.json()).then(data => {
      setTransactions(data.transactions);
      setTotal(data.total);
    });
  }, [sortingColumn, sortingDirection, page, props.itemsPerPage, props.startDate, props.endDate]);
  
  const mapRates = (rates) => {
    return rates.map(rate => ({
        amountCrypto: 1,
        amountCurrency: rate.price_usd,
        crypto: rate.name,
        currency: 'USD',
        type: 'Live Price',
        date: new Date(rate.data_quote_end)
      })
      );
  }

  const cutTransactionsLength = useCallback((transactions) => {
    if (transactions.length > props.itemsPerPage) {
      return transactions.slice(0, props.itemsPerPage);
    }
    return transactions;
  }, [props.itemsPerPage]);

  const initSocket = useCallback(
    (socket) => {
      // connect to socket and listen for new data
      socket.on("msg", data => {
        console.log('SOCKET EVENT');
        console.log(data)
      });
      socket.on("saved_transaction", data => {
        console.log('SOCKET EVENT');
        console.log(data)
        // There could be tons of different ways to configure this. this approach has some bugs but it is just for demo
        setTotal(total + 1);
        if (page === 1) {
          setTransactions(cutTransactionsLength([data, ...transactions]));
        }
      });
      socket.on("updated_rates", data => {
        console.log('SOCKET EVENT');
        let newRows = mapRates(data);
        // There could be tons of different ways to configure this. this approach has some bugs but it is just for demo
        setTotal(total + newRows.length);
        if (page === 1) {
          setTransactions(cutTransactionsLength([...newRows, ...transactions]));
        }
      });
    },
    [transactions, cutTransactionsLength, total, page],
  )
  
  useEffect(() => {
    const socket = socketIOClient(BACKEND_URL);
    initSocket(socket);

    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
  }, [initSocket]);


  

const table = <div className="table">
  <table>
    <thead>
      <tr>
        {Object.keys(headers).map(key => (
          <th key={key} onClick={() => {
              if (sortingColumn === key) {
                setSortingDirection(sortingDirection === 'asc' ? 'desc' : 'asc');
              } else {
                setSortingColumn(key);
                setSortingDirection('asc');
              }
            }}>
            {sortingColumn === key && <img className={`sorting ${sortingDirection}`} src={sortIco} alt="sort" />}
            {headers[key]}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {transactions.map(transaction => (
        <tr key={transaction._id}>
          <td>{sortingColumn === 'date'} {formatDate(transaction.date)}</td>
          <td>{sortingColumn === 'crypto'} {transaction.crypto}</td>
          <td>{sortingColumn === 'amountCrypto'} {transaction.amountCrypto}</td>
          <td>{sortingColumn === 'currency'} {transaction.currency}</td>
          <td>{sortingColumn === 'amountCurrency'} {transaction.amountCurrency}</td>
          <td className={transaction.type === 'Exchanged' ? 'exchanged' : 'live-price'}>{transaction.type}</td>
        </tr>
      ))}
    </tbody>
  </table>
  {PaginationComponent(page, setPage, totalPages)}
</div>

  if (transactions.length === 0) {
    return <div className="loading">Loading...</div>
  } else {
    return table;
  }
}

export default DataTable;

function PaginationComponent(page, setPage, totalPages) {

  

  return <div className='pagination'>
    {page > 1 ? <button onClick={() => setPage(page - 1)} className='page-btn'>Previous</button> : <span className='placeholder'></span>}
    {/* dinamically crete page nums */}
    {Array.from(Array(totalPages).keys()).map(i => (
      <button key={i + 1} onClick={() => setPage(i + 1)}
        className={page === i + 1 ? 'page-btn pressed' : 'page-btn'}>{i + 1}</button>
    ))}
    {page < totalPages ? <button onClick={() => setPage(page + 1)} className='page-btn'>Next</button> : <span className='placeholder'></span>}
  </div>;
}
