import React, { useEffect, useState } from 'react';
import Trip from './Trip';
import '../css/main.css';
import Slider from '@mui/material/Slider';
import Splash from './Splash';

const axios = require('axios');

const initLoadNum = 10;
const afterNum = 3;
const LoadNum = 1;

const requestTripData = time => {
  const res = axios.get('http://localhost:8001', {
    params: {
      'time': time
    }
  });
  const data = res.then(r => r.data);
  return data;
};

const getTripData = async time => {
  const tripRes = await requestTripData(time);
  if (tripRes) {
    const data = tripRes.map(d => {
      return (
        {
          'vendor': d.vendor === 0 ? [253, 128, 93] : [23, 184, 190],
          'trip': JSON.parse(d.trip),
          'timestamp': JSON.parse(d.timestamp),
        }
      )
    });
    return data;
  };
};

// const getRestData = type => {
//   const res = axios.get(`https://raw.githubusercontent.com/HNU209/NewYork-visualization/main/src/data/rest_data/newyork_${type}.json`);
//   const result = res.then(r => r.data);
//   return result
// }

export default function Main() {
  const minTime = 0;
  const maxTime = 1440;

  const [load, setLoad] = useState(false);
  const [time, setTime] = useState(minTime);
  const [trip, setTrip] = useState([]);
  const empty = [];
  const ps = [];
  const [sec, setSec] = useState(0);

  const [timeLine, setTimeLine] = useState([]);

  const getFetchData = async (init, time, num) => {
    const timeTable1 = [...Array(num).keys()];
    const timeTable2 = [...Array(num).keys()].map(t => time + t);
    const arr = init ? timeTable1 : timeTable2
    
    const resArray = await Promise.all(
      arr.map(t => {
        setTimeLine(prev => [...prev, t]);
        const res = getTripData(t);
        return res;
      })
    );

    if (resArray) {
      const resFlattenArray = resArray.flat();
      if (init) {
        setTrip([...resFlattenArray]);
        setLoad(true);
        console.log(trip.length)
      } else {
        setTrip([...trip, ...resFlattenArray]);
      }
    };
  };

  const clearData = currSec => {
    if ((trip.length !== 0) && (currSec - sec === 1)) {
      setSec(currSec);
      const currTrip = trip.filter(v => {
        const end = v.timestamp[v.timestamp.length - 1];
        if (!(end < time)) return v;
      });
      setTrip([...currTrip]);
    }
  };

  useEffect(() => {
    let check = true;
    if (check) {
      getFetchData(true, 0, initLoadNum);
    }

    return () => {
      check = false;
    };
  }, [])

  useEffect(() => {
    let check = true;
    const t = Math.floor(time + afterNum);
    const currSec = parseInt(Math.floor(time) % 60);

    if (!(timeLine.includes(t))) {
      getFetchData(false, t, LoadNum)
    }
    
    if (check) {
      clearData(currSec);
      setSec(currSec);
    }

    return () => {
      check = false;
    }
  }, [time]);

  const SliderChange = value => {
    const time = value.target.value;
    setTrip([]);
    setTimeLine([]);
    setTime(time);
  };

  return (
    <div className="container">
      {
        load ? 
        <>
          <Trip trip={trip} empty={empty} ps={ps} minTime={minTime} maxTime={maxTime} time={time} setTime={setTime}></Trip>
          <Slider id="slider" value={time} min={minTime} max={maxTime} onChange={SliderChange} track="inverted"/>
        </>
        :
        <Splash></Splash>
      }
    </div>
  );
}