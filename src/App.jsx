import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import "./css/app.css";
import "./css/main.css";

import Splash from "./component/Splash";
import Trip from "./component/Trip";
import Slider from "./component/Slider";
import AnimationFrame, { RenderLayers } from "./component/Simulator";

import { gql, useApolloClient, useQuery } from "@apollo/client";
import { TripsLayer } from "@deck.gl/geo-layers";
import { StaticMap } from "react-map-gl";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import DeckGL from "@deck.gl/react";
import HelloWorker from './hello.worker.js';

const viewState = undefined;
const mapStyle = "mapbox://styles/spear5306/ckzcz5m8w002814o2coz02sjc";

const MAPBOX_TOKEN = `pk.eyJ1Ijoic3BlYXI1MzA2IiwiYSI6ImNremN5Z2FrOTI0ZGgycm45Mzh3dDV6OWQifQ.kXGWHPRjnVAEHgVgLzXn2g`; // eslint-disable-line

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  position: [-74.05, 40.7, 8000],
});

const lightingEffect = new LightingEffect({ ambientLight, pointLight });

const material = {
  ambient: 0.1,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [60, 64, 70],
};

const DEFAULT_THEME = {
  buildingColor: [74, 80, 87],
  trailColor0: [253, 128, 93],
  trailColor1: [23, 184, 190],
  material,
  effects: [lightingEffect],
};

const INITIAL_VIEW_STATE = {
  longitude: 127,
  latitude: 37.55,
  zoom: 11,
  minZoom: 5,
  maxZoom: 16,
  pitch: 20,
  bearing: 0,
};

const ICON_MAPPING = {
  marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
};

const color = {
  tripColor0: [253, 128, 93],
  tripcolor1: [23, 184, 190],
};

const initLoadNum = 10;
const afterNum = 3;
const LoadNum = 1;

const minTime = 0;
const maxTime = 1440;

const animationSpeed = 1;

const setSecond = (time) => {
  return Math.floor(time);
};

const GET_TRIP = gql`
  query Base($second: Int!) {
    base(id: $second) {
      vendor {
        vendor
      }
      trip {
        trip
      }
      timestamp {
        timestamp
      }
    }
  }
`;




export default function App() {
  const client = useApolloClient();
  const [init, setInit] = useState(true);
  const [trip, setTrip] = useState([]);
  const [time, setTime] = useState(1);

  const [layers, setLayers] = useState("");

  const [timeList, setTimeList] = useState([]);

  const helloWorker = new HelloWorker();
  let messageCount = 0;

  const second = useMemo(() => {
    const floorTime = setSecond(time);
    if (!timeList.includes(floorTime)) {
      setTimeList((prev) => [...prev, floorTime]);
    }
    return floorTime;
  }, [time]);

  const requestData = useCallback(() => {
    client.query({
      query: GET_TRIP,
      variables: {
        second: second,
      }
    })
    .then((res) => {
      const { vendor, trip, timestamp } = res.data.base;
      const data = vendor.map((v, i) => {
        return {
          vendor: v.vendor,
          trip: JSON.parse(trip[i].trip),
          timestamp: JSON.parse(timestamp[i].timestamp)
        }
      });
      setTrip((prev) => [...prev, ...data]);
      setInit(true);
    });
  }, [init, second]);

  useEffect(() => {
    requestData();

    if (trip.length !== 0) {
      setTrip(prev => prev.filter(v => 
        v.timestamp[v.timestamp.length - 1] >= second
      ))
    }
    helloWorker.postMessage({ run: true });
  }, [second]);

  return (
    <div className="container">
      <Trip trip={trip} time={time} setTime={setTime} />
    </div>
  );
}
