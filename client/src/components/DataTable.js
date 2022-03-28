import './DataTable.css';
import React, {useState, useEffect} from "react";
import sortIco from '../img/icons/sort.svg';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://127.0.0.1:3001";


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
    fetch(`http://localhost:3001/transactions/${sortingColumn}:${sortingDirection}?page=${page}&limit=${props.itemsPerPage}`)
    .then(res => res.json()).then(data => {
      setTransactions(data.transactions);
      setTotal(data.total);
    });
  }, [sortingColumn, sortingDirection, page, props.itemsPerPage]);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", data => {
      parseSocketEvent(data);
    });
  }, []);

  const parseSocketEvent = (data) => {
    console.log('SOCKET EVENT');
    console.log(data);
    setTransactions(transactions => [...transactions, data]);
  }

  const formatDate = (date) => {
    // format date to dd/mm/yyyy hh:mm
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();
    const hours = '' + d.getHours();
    const minutes = '' + d.getMinutes();
    return [day, month, year].join('/') + ' ' + [hours, minutes].join(':');
  }

  return (
    <div className="table">
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
      <div className='pagination'>
        {page > 1 ? <button onClick={() => setPage(page - 1)} className='page-btn'>Previous</button> : <span className='placeholder'></span>}
        {/* dinamically crete page nums */}
        {Array.from(Array(totalPages).keys()).map(i => (
          <button key={i + 1} onClick={() => setPage(i + 1)} 
          className={page === i + 1 ? 'page-btn pressed' : 'page-btn'}>{i + 1}</button>
        ))}
        {page < totalPages ? <button onClick={() => setPage(page + 1)} className='page-btn'>Next</button> : <span className='placeholder'></span>}
      </div>
    </div>
  );
}

export default DataTable;