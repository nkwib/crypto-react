import './Exchange.css';
import CurrencyInput from "./CurrencyInput";
import React, {useState, useEffect, useCallback} from "react";

function Exchange(props) {

  const [amountCurrency, setAmountCurrency] = useState(1);
  const [amountCrypto, setAmountCrypto] = useState(1);
  const [currency, setCurrency] = useState('USD');
  const [crypto, setCrypto] = useState('Bitcoin');
  const [rates, setRates] = useState([]);
  const coins = props.coins;

  useEffect(() => {
    // mock data, It could be fetched from an external API
    setRates({
      EUR: 1.11,
      USD: 1,
      GBP: 0.84
    })
  }, []);

  function format(number, decimals = 2) {
    return number.toFixed(decimals);
  }

  function handleAmountCurrencyChange(amountCurrency) {
    setAmountCrypto(format(amountCurrency * rates[currency] / coins[crypto]), 5);
    setAmountCurrency(amountCurrency);
  }

  function handleCurrencyChange(currency) {
    setAmountCrypto(format(amountCurrency * rates[currency] / coins[crypto]), 5);
    setCurrency(currency);
  }

  function handleAmountCryptoChange(amountCrypto) {
    setAmountCurrency(format(amountCrypto * coins[crypto] / rates[currency]));
    setAmountCrypto(amountCrypto, 5);
  }

  const handleCryptoChange = (crypto) => {
    setAmountCurrency(format(amountCrypto * coins[crypto] / rates[currency]));
    setCrypto(crypto, 5);
  }
  
  const initInputs = useCallback(() => {
    setAmountCurrency(coins['Bitcoin'] / rates['USD'] || 1);
    setAmountCrypto( 1 );
    setCurrency('USD');
    setCrypto('Bitcoin');
  }, [ coins, rates ]);

  useEffect(() => {
    initInputs(1)
  }, [rates, initInputs]);


  let exchangeCmp = 
  <React.Fragment>
  <h1 className='title'>Exchange</h1>
  <div className='exchange-container'>
    <CurrencyInput
      labels={['Currency From', 'Amount']}
      onAmountChange={handleAmountCryptoChange}
      onCurrencyChange={handleCryptoChange}
      currencies={Object.keys(coins)}
      amount={amountCrypto}
      currency={crypto} />
    <div className='filler-divs'>
      <div>
      </div>
      <div>
        =
      </div>
    </div>
    <CurrencyInput
      labels={['Currency To', 'Amount']}
      onAmountChange={handleAmountCurrencyChange}
      onCurrencyChange={handleCurrencyChange}
      currencies={Object.keys(rates)}
      amount={amountCurrency}
      currency={currency} />
    <div className='filler-divs'>
      <div>
      </div>
      <button className='save-btn' onClick={() => props.onSave(crypto, amountCrypto, currency, amountCurrency)}>Save</button>
    </div>
  </div>
  </React.Fragment>

  if (coins.length === 0) {
    return <div>Loading...</div>
  } else {
    return exchangeCmp;
  }
}

export default Exchange;