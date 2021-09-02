import DeferredLoadLayer from './deferredLoadLayer';
import FlowmapLayer from './flowmap';
import {flows, locations} from '../data/od_texas';

const flowmapStyle = {
  animate: true,
  colors: {
    flows: {
      scheme: [
        'rgb(255, 255, 176)',
        'rgb(253, 247, 140)',
        'rgb(255, 231, 107)',
        'rgb(255, 214, 86)',
        'rgb(255, 195, 76)',
        'rgb(255, 177, 74)',
        'rgb(255, 160, 78)',
        'rgb(255, 144, 88)',
        'rgb(255, 130, 101)',
        'rgb(247, 117, 114)',
        'rgb(230, 105, 125)',
        'rgb(210, 95, 135)',
        'rgb(187, 85, 141)',
        'rgb(165, 74, 144)',
        'rgb(141, 63, 143)',
        'rgb(118, 52, 138)',
        'rgb(93, 40, 127)',
        'rgb(64, 31, 105)',
        'rgb(37, 24, 71)',
        'rgb(17, 16, 34)',
        'rgb(0, 0, 4)'
      ]
    },
    locationCircles: {outgoing: '#fff'},
    outlineColor: 'rgba(255, 255, 255, 0.5)'
  },
  locationTotalsExtent: [124, 1568915],
  maxFlowThickness: 18,
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
