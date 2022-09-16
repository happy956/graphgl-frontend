import { useState, useRef, useEffect } from "react";

// import { PolygonLayer, ScatterplotLayer, IconLayer } from '@deck.gl/layers';
import { TripsLayer } from '@deck.gl/geo-layers';
// import '../css/trip.css';
// import legend from '../img/legend.png';

const AnimationFrame = callback => {
    const frame = useRef();

    const animate = t => {
        callback();
        frame.current = requestAnimationFrame(animate);
    };
    
    useEffect(() => {
        frame.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame.current);
    }, []);
}

export const RenderLayers = props => {
    const { trip, time } = props;

    return new TripsLayer({
        id: 'trip',
        data: trip,
        getColor: d => d.vendor,
        getPath: d => d.trip,
        getTimestamp: d => d.timestamp,
        opacity: 0.3,
        widthMinPixels: 5,
        lineJointRounded: false,
        trailLength: 0.1,
        currentTime: time,
        shadowEnabled: false,
    })
}
export default AnimationFrame;