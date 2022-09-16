import React from 'react';
import Slide from '@mui/material/Slider';

export default function Slider() {
    // value={time} min={minTime} max={maxTime} onChange={SliderChange}
    return (
      <Slide id="slider" track="inverted"/>
    );
}