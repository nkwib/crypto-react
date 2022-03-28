import React from "react";
import './CurrencyInput.css';

function CurrencyInput(props) {
  return (
    <div className="container">

      <div className="group">
        <label>{props.labels[0]}</label>
        <select value={props.currency} onChange={ev => props.onCurrencyChange(ev.target.value)}>
          {props.currencies.map((curr => (
            <option value={curr} key={curr}>
              {curr}
            </option>
          )))}
        </select>

      </div>
      <div className="group">
        <label>{props.labels[1]}</label>
        <input type="text" value={props.amount} onChange={ev => props.onAmountChange(ev.target.value)} />
      </div>
    </div>
  );
}

export default CurrencyInput;