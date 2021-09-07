import FlowmapLayer from './flowmap';
import DeferredLoadLayer from './deferredLoadLayer';
import Blending from './blending';
import {flows, locations} from '../data/od_texas';

const flowmapStyle = {
  animate: true,
  colors: {
    flows: {
      scheme: [
        'rgb(253, 230, 219)',
        'rgb(248, 163, 171)',
        'rgb(241, 77, 143)',
        'rgb(182, 0, 119)',
        'rgb(101, 0, 100)'
      ]
    },
    locationCircles: {outgoing: '#fff'},
    outlineColor: 'rgba(255, 255, 255, 0.5)'
  },
  locationTotalsExtent: [12004, 1568915],
  maxFlowThickness: 16,
  maxLocationCircleSize: 15,
  showOnlyTopFlows: 5000,
  showTotals: true,
  diffMode: false
};

const _TrafficFlowLayer = DeferredLoadLayer(() => {
  return new FlowmapLayer({
    locations,
    flows,
    ...flowmapStyle,
    getFlowMagnitude: flow => flow.count || 0,
    getFlowOriginId: flow => flow.origin,
    getFlowDestId: flow => flow.dest,
    getLocationId: loc => loc.id,
    getLocationCentroid: loc => [loc.lon, loc.lat]
  });
});

export const TrafficFlowLayer = new _TrafficFlowLayer({
  id: 'traffic-flow'
});
