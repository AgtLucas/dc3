import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import jsonData from './data';
import './App.css';

const keys = jsonData.map(data => Object.keys(data));
const dietKeys = [...new Set(keys[0])].filter(x => x !== 'Entity' && x !== 'Year');
const countries = [...new Set(jsonData.map(data => data.Entity))];
const colours = ['#c6c670', '#29f2da', '#ea731b', '#2ad93f', '#20d5d6', '#d5da6e', '#96bc85', '#5b268f', '#ce3597', '#92d9c7'];

const App = () => {
  const [country, setCountry] = useState('United Kingdom');

  const getDataFromSpecificCountry = country => {
    return jsonData.filter(data => data.Entity === country);
  };

  const getData = () => {
    return getDataFromSpecificCountry(country).filter(c => {
      return { ...c, ...delete c.Entity }
    });
  };

  const handleSelectCountry = e => {
    setCountry(e.target.value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active) return null;

    return (
      <div className='tooltip'>
        <p>Year: <strong>{label}</strong></p>
        {payload.map((p, i) =>
          <p className='key' key={i}>
            {dietKeys[i].replace('(FAO (2017)) (kilocalories per person per day)', '')}: <strong>{p.value} Kcal</strong>
          </p>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Diet compositions by commodity categories - {country}</h1>
      <AreaChart
        width={1000}
        height={500}
        data={getData()}
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Year" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />

        {dietKeys.map((key, i) =>
          <Area key={i} type='monotone' dataKey={key} stackId='1' stroke={colours[i]} fill={colours[i]} />
        )}

      </AreaChart>
      <label>
        Country
        <select
          name='countries'
          id='countries'
          onChange={handleSelectCountry}
          value={country}
        >
          {countries.map((country, i) =>
            <option key={i} value={country}>{country}</option>
          )}
        </select>
      </label>
    </div>
  )
};

export default App;
