import { useState } from 'react';
import './App.css';
import Exchange from './components/Exchange';
import DataTable from './components/DataTable';

function App() {
  const [coins, setCoins] = useState({
    Bitcoin: 50000,
    Ethereum: 3000,
    Litecoin: 50,
    Ripple: 0.1,
    Cardano: 0.1,
    Monero: 0.1,
    Dash: 0.1,
    NEO: 0.1,
    EOS: 0.1,
  });
  const [err, setErr] = useState(false);

  const fetchCoins = () => {
    fetch('http://localhost:3001')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if (data.length > 0) {
          setErr(false);
          setCoins(data)
        } else {
          setErr('No coins found')
        }
      })
      .catch(err => setErr('Impossible To fetch data') && console.log(err));
  }

  const onSave = (crypto, amountCrypto, currency, amountCurrency) => {
    console.log('onSave');
    console.log(crypto, amountCrypto, currency, amountCurrency);
    // post transaction
    fetch('http://localhost:3001/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        crypto,
        amountCrypto,
        currency,
        amountCurrency,
        date: new Date(),
        type: 'Exchanged'
      })
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <Exchange coins={coins} fetchCoins={fetchCoins} onSave={onSave} err={err}/>
        <DataTable err={err} itemsPerPage={5}/>
        {/* <button onClick={fetchCoins}>
          AGGIORNA
        </button>
        {!err && Object.keys(coins).map(coin => <div key={coin}>{coin} - ${coins[coin]}</div>)}
        {err && <div>{err}</div>} */}
      </header>
    </div>
  );
}

export default App;
