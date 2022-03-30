import { useState, useEffect } from 'react';
import './App.css';
import Exchange from './components/Exchange';
import DataTable from './components/DataTable';
import DatePicker from 'sassy-datepicker';
import { formatDate } from './utils';

const BACKEND_URL = 'http://localhost:3001';

function App() {
  // for the date picker
  const weekago = new Date() - 1000 * 60 * 60 * 24 * 7;
  const [startDate, setStartDate] = useState(new Date(weekago));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [showEndPicker, setShowEndPicker] = useState(false);

  // for the rates of conversion
  const [coins, setCoins] = useState({});
  const [err, setErr] = useState(false);

  useEffect(() => {
    // fetch data from backend
    fetchLatestRates();
  }, []);

  const fetchLatestRates = async () => {
    const response = await fetch(`${BACKEND_URL}/latest_rates`);
    const data = await response.json();
    setCoins(data);
  };

  const onSave = (crypto, amountCrypto, currency, amountCurrency) => {
    console.log('onSave');
    fetch(`${BACKEND_URL}/transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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

  // on date picker change
  const onChange = (newDate, start) => {
    start ? setStartDate(newDate) : setEndDate(newDate);
    start ? setShowStartPicker(false) : setShowEndPicker(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <Exchange coins={coins} onSave={onSave} err={err} />

        
        <div className="date-picker">
          <div onClick={() => setShowStartPicker(true)}>Start: {formatDate(startDate, false)}</div>
          <div onClick={() => setShowEndPicker(true)}>End: {formatDate(endDate, false)}</div>
        </div>
        {/* CHECK IF DATEPICKER AND WHICH IS SHOWN */}
        {showStartPicker && <DatePicker onChange={(e) => onChange(e, true)} selected={startDate} className={'hoverAbs'} />}
        {showEndPicker && <DatePicker onChange={(e) => onChange(e, false)} selected={endDate} className={'hoverAbs'} />}

        <DataTable err={err} itemsPerPage={5} startDate={startDate} endDate={endDate} />
      </header>
    </div>
  );
}

export default App;
