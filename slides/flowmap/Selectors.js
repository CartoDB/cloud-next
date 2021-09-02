// tslint:disable:member-ordering
import { ascending, extent, max } from 'd3-array';
import { nest } from 'd3-collection';
import { scaleLinear, scalePow } from 'd3-scale';
import { createSelector } from 'reselect';
import { colorAsRgba, createFlowColorScale, getColorsRGBA, getDiffColorsRGBA, getDimmedCircleColor, getDimmedCircleOutlineColor, getDimmedColor, isDiffColorsRGBA, } from './colors';
import FlowMapLayer from './FlowMapLayer';
import { isFeatureCollection, } from './types';
const CIRCLE_OUTLINE_THICKNESS = 1;
const getDiffMode = (props) => props.diffMode;
const getColorsProp = (props) => props.colors;
const getAnimate = (props) => props.animate;
const getLocationFeatures = (props) => isFeatureCollection(props.locations) ? props.locations.features : props.locations;
const getFlows = (props) => props.flows;
const getHighlightedFlow = (props) => props.highlightedFlow;
const getHighlightedLocationId = (props) => props.highlightedLocationId;
const getSelectedLocationIds = (props) => props.selectedLocationIds;
const getShowOnlyTopFlows = (props) => props.showOnlyTopFlows;
const getMaxLocationCircleSize = (props) => props.maxLocationCircleSize != null ? props.maxLocationCircleSize : FlowMapLayer.defaultProps.maxLocationCircleSize;
class Selectors {
    constructor(inputAccessors) {
        this.inputAccessors = inputAccessors;
        this.getColors = createSelector([getColorsProp, getDiffMode], (colors, diffMode) => {
            if (diffMode) {
                return getDiffColorsRGBA(colors);
            }
            return getColorsRGBA(colors);
        });
        this.getLocationByIdGetter = createSelector([getLocationFeatures], locations => {
            const locationsById = nest()
                .key(this.inputAccessors.getLocationId)
                .rollup(([d]) => d)
                .object(locations);
            return (id) => {
                const location = locationsById[id];
                if (!location) {
                    console.warn(`No location found for id '${id}'`);
                }
                return location;
            };
        });
        this.getFilteredFlows = createSelector([getFlows, getSelectedLocationIds], (flows, selectedLocationIds) => {
            const { getFlowOriginId, getFlowDestId } = this.inputAccessors;
            if (selectedLocationIds) {
                return flows.filter(flow => selectedLocationIds.indexOf(getFlowOriginId(flow)) >= 0 ||
                    selectedLocationIds.indexOf(getFlowDestId(flow)) >= 0);
            }
            return flows;
        });
        this.getNonSelfFlows = createSelector([this.getFilteredFlows], flows => {
            const { getFlowOriginId, getFlowDestId } = this.inputAccessors;
            return flows.filter(flow => getFlowOriginId(flow) !== getFlowDestId(flow));
        });
        this.getSortedNonSelfFlows = createSelector([this.getNonSelfFlows], flows => {
            const comparator = (f1, f2) => Math.abs(this.inputAccessors.getFlowMagnitude(f1)) - Math.abs(this.inputAccessors.getFlowMagnitude(f2));
            return flows.slice().sort(comparator);
        });
        this.getTopFlows = createSelector([this.getSortedNonSelfFlows, getShowOnlyTopFlows], (flows, showOnlyTopFlows) => {
            if (showOnlyTopFlows != null && showOnlyTopFlows > 0 && flows.length > showOnlyTopFlows) {
                return flows.slice(flows.length - showOnlyTopFlows, flows.length);
            }
            return flows;
        });
        this.getHighlightedFlows = createSelector([this.getSortedNonSelfFlows, getHighlightedFlow, getHighlightedLocationId], (flows, highlightedFlow, highlightedLocationId) => {
            const { getFlowOriginId, getFlowDestId } = this.inputAccessors;
            if (highlightedFlow) {
                return [highlightedFlow];
            }
            if (highlightedLocationId) {
                return flows.filter(flow => getFlowOriginId(flow) === highlightedLocationId || getFlowDestId(flow) === highlightedLocationId);
            }
            return undefined;
        });
        this.getFlowMagnitudeExtent = createSelector([this.getNonSelfFlows, props => props.flowMagnitudeExtent], (flows, flowMagnitudeExtent) => {
            if (flowMagnitudeExtent != null)
                return flowMagnitudeExtent;
            return extent(flows, f => this.inputAccessors.getFlowMagnitude(f));
        });
        this.getFlowThicknessScale = createSelector([this.getFlowMagnitudeExtent], ([minMagnitude, maxMagnitude]) => {
            const scale = scaleLinear()
                .range([0.05, 0.5])
                .domain([0, Math.max(Math.abs(minMagnitude || 0), Math.abs(maxMagnitude || 0))]);
            return (magnitude) => scale(Math.abs(magnitude));
        });
        this.getFlowColorScale = createSelector([this.getColors, this.getFlowMagnitudeExtent, getAnimate], (colors, [minMagnitude, maxMagnitude], animate) => {
            if (isDiffColorsRGBA(colors)) {
                const posScale = createFlowColorScale([0, maxMagnitude || 0], colors.positive.flows.scheme, animate);
                const negScale = createFlowColorScale([0, minMagnitude || 0], colors.negative.flows.scheme, animate);
                return (magnitude) => (magnitude >= 0 ? posScale(magnitude) : negScale(magnitude));
            }
            const scale = createFlowColorScale([0, maxMagnitude || 0], colors.flows.scheme, animate);
            return (magnitude) => scale(magnitude);
        });
        this.getLocationTotals = createSelector([getLocationFeatures, this.getFilteredFlows], (locations, flows) => {
            const { getFlowOriginId, getFlowDestId, getFlowMagnitude } = this.inputAccessors;
            return flows.reduce((acc, curr) => {
                const originId = getFlowOriginId(curr);
                const destId = getFlowDestId(curr);
                const magnitude = getFlowMagnitude(curr);
                if (originId === destId) {
                    acc.within[originId] = (acc.within[originId] || 0) + magnitude;
                }
                else {
                    acc.outgoing[originId] = (acc.outgoing[originId] || 0) + magnitude;
                    acc.incoming[destId] = (acc.incoming[destId] || 0) + magnitude;
                }
                return acc;
            }, { incoming: {}, outgoing: {}, within: {} });
        });
        this.getHighlightedLocationCircles = createSelector([this.getLocationByIdGetter, getHighlightedLocationId], (getLocationById, highlightedLocationId) => {
            if (highlightedLocationId) {
                const location = getLocationById(highlightedLocationId);
                if (!location) {
                    return undefined;
                }
                return [
                    { location, type: "outline" /* OUTLINE */ },
                    { location, type: "outer" /* OUTER */ },
                    { location, type: "inner" /* INNER */ },
                ];
            }
            return undefined;
        });
        this.getLocationTotalInGetter = (props) => {
            const { getLocationTotalIn, getLocationId } = this.inputAccessors;
            if (getLocationTotalIn) {
                return getLocationTotalIn;
            }
            const { incoming } = this.getLocationTotals(props);
            return (location) => incoming[getLocationId(location)] || 0;
        };
        this.getLocationTotalOutGetter = (props) => {
            const { getLocationTotalOut, getLocationId } = this.inputAccessors;
            if (getLocationTotalOut) {
                return getLocationTotalOut;
            }
            const { outgoing } = this.getLocationTotals(props);
            return (location) => outgoing[getLocationId(location)] || 0;
        };
        this.getLocationTotalWithinGetter = (props) => {
            const { getLocationTotalWithin, getLocationId } = this.inputAccessors;
            if (getLocationTotalWithin) {
                return getLocationTotalWithin;
            }
            const { within } = this.getLocationTotals(props);
            return (location) => within[getLocationId(location)] || 0;
        };
        this.getLocationMaxAbsTotalGetter = createSelector([
            getLocationFeatures,
            this.getLocationTotalInGetter,
            this.getLocationTotalOutGetter,
            this.getLocationTotalWithinGetter,
        ], (locations, getLocationTotalIn, getLocationTotalOut, getLocationTotalWithin) => {
            return (location) => Math.max(Math.abs(getLocationTotalIn(location) + getLocationTotalWithin(location)), Math.abs(getLocationTotalOut(location) + getLocationTotalWithin(location)));
        });
        this.getMaxLocationMaxAbsTotal = createSelector([getLocationFeatures, this.getLocationMaxAbsTotalGetter, props => props.locationTotalsExtent], (locations, getLocationMaxAbsTotal, locationTotalsExtent) => {
            if (locationTotalsExtent != null) {
                return max(locationTotalsExtent, Math.abs) || 0;
            }
            return max(locations, getLocationMaxAbsTotal) || 0;
        });
        this.getLocationCircles = createSelector([getLocationFeatures, this.getLocationMaxAbsTotalGetter], (locations, getLocationMaxAbsTotalGetter) => {
            const circles = [];
            const sorted = locations
                .slice()
                .sort((a, b) => ascending(getLocationMaxAbsTotalGetter(a), getLocationMaxAbsTotalGetter(b)));
            for (const location of sorted) {
                circles.push({
                    location,
                    type: "outline" /* OUTLINE */,
                });
                circles.push({
                    location,
                    type: "outer" /* OUTER */,
                });
                circles.push({
                    location,
                    type: "inner" /* INNER */,
                });
            }
            return circles;
        });
        this.getSizeScale = createSelector([getMaxLocationCircleSize, this.getMaxLocationMaxAbsTotal], (maxLocationCircleSize, maxTotal) => {
            const scale = scalePow()
                .exponent(1 / 2)
                .domain([0, maxTotal])
                .range([0, maxTotal > 0 ? maxLocationCircleSize : 1]);
            return (v) => scale(Math.abs(v)) || 0;
        });
        this.getLocationCircleRadiusGetter = createSelector([
            this.getSizeScale,
            this.getLocationTotalInGetter,
            this.getLocationTotalOutGetter,
            this.getLocationTotalWithinGetter,
        ], (sizeScale, getLocationTotalIn, getLocationTotalOut, getLocationTotalWithin) => {
            return ({ location, type }) => {
                const getSide = type === "inner" /* INNER */ ? Math.min : Math.max;
                const totalIn = getLocationTotalIn(location);
                const totalOut = getLocationTotalOut(location);
                const totalWithin = getLocationTotalWithin(location);
                const r = sizeScale(getSide(Math.abs(totalIn + totalWithin), Math.abs(totalOut + totalWithin)));
                if (type === "outline" /* OUTLINE */) {
                    return r + CIRCLE_OUTLINE_THICKNESS;
                }
                return r;
            };
        });
        this.getLocationCircleColorGetter = createSelector([
            this.getColors,
            getHighlightedLocationId,
            this.getLocationTotalInGetter,
            this.getLocationTotalOutGetter,
            this.getLocationTotalWithinGetter,
        ], (colors, highlightedLocationId, getLocationTotalIn, getLocationTotalOut, getLocationTotalWithin) => {
            const { getLocationId } = this.inputAccessors;
            return ({ location, type }) => {
                const isHighlighted = highlightedLocationId && highlightedLocationId === getLocationId(location);
                const isDimmed = highlightedLocationId && highlightedLocationId !== getLocationId(location);
                const totalWithin = getLocationTotalWithin(location);
                const totalIn = getLocationTotalIn(location) + totalWithin;
                const totalOut = getLocationTotalOut(location) + totalWithin;
                const isIncoming = type === "outer" /* OUTER */ && Math.abs(totalIn) > Math.abs(totalOut);
                const isPositive = (isIncoming === true && totalIn >= 0) || totalOut >= 0;
                const circleColors = (isDiffColorsRGBA(colors) ? (isPositive ? colors.positive : colors.negative) : colors)
                    .locationCircles;
                if (isHighlighted && type === "outline" /* OUTLINE */) {
                    return circleColors.highlighted;
                }
                if (isDimmed) {
                    if (type === "outline" /* OUTLINE */) {
                        return getDimmedCircleOutlineColor(colors.outlineColor, colors.dimmedOpacity);
                    }
                    return getDimmedCircleColor(circleColors.inner, colors.dimmedOpacity);
                }
                if (type === "outline" /* OUTLINE */) {
                    return isIncoming ? circleColors.incoming : circleColors.inner;
                }
                if (type === "inner" /* INNER */) {
                    return circleColors.inner;
                }
                if (isIncoming === true) {
                    return circleColors.incoming;
                }
                return circleColors.outgoing;
            };
        });
        this.isLocationConnectedGetter = createSelector([this.getFilteredFlows, getHighlightedLocationId, getHighlightedFlow, getSelectedLocationIds], (flows, highlightedLocationId, highlightedFlow, selectedLocationIds) => {
            const { getFlowOriginId, getFlowDestId } = this.inputAccessors;
            if (highlightedLocationId) {
                const isRelated = (flow) => {
                    const originId = getFlowOriginId(flow);
                    const destId = getFlowDestId(flow);
                    return (originId === highlightedLocationId ||
                        (selectedLocationIds && selectedLocationIds.indexOf(originId) >= 0) ||
                        destId === highlightedLocationId ||
                        (selectedLocationIds && selectedLocationIds.indexOf(destId) >= 0));
                };
                const locations = new Set();
                for (const flow of flows) {
                    if (isRelated(flow)) {
                        locations.add(getFlowOriginId(flow));
                        locations.add(getFlowDestId(flow));
                    }
                }
                return (id) => locations.has(id);
            }
            return () => false;
        });
        this.getLocationAreaFillColorGetter = createSelector([this.getColors, getSelectedLocationIds, this.isLocationConnectedGetter], (colors, selectedLocationIds, isLocationConnected) => {
            return (location) => {
                const locationId = this.inputAccessors.getLocationId(location);
                if (selectedLocationIds && selectedLocationIds.indexOf(locationId) >= 0) {
                    return colors.locationAreas.selected;
                }
                if (isLocationConnected(locationId)) {
                    return colors.locationAreas.connected;
                }
                return colors.locationAreas.normal;
            };
        });
    }
    getFlowLinesColorGetter(colors, flowColorScale, highlighted, dimmed) {
        const { getFlowMagnitude, getFlowColor } = this.inputAccessors;
        return (flow) => {
            if (getFlowColor) {
                const color = getFlowColor(flow);
                if (color) {
                    return colorAsRgba(color);
                }
            }
            if (highlighted) {
                if (isDiffColorsRGBA(colors)) {
                    const positiveColor = colors.positive.flows.highlighted;
                    const negativeColor = colors.negative.flows.highlighted;
                    const magnitude = getFlowMagnitude(flow);
                    return magnitude >= 0 ? positiveColor : negativeColor;
                }
                else {
                    return colors.flows.highlighted;
                }
            }
            else {
                const magnitude = getFlowMagnitude(flow);
                const color = flowColorScale(magnitude);
                if (dimmed) {
                    return getDimmedColor(color, colors.dimmedOpacity);
                }
                return color;
            }
        };
    }
    setInputAccessors(inputAccessors) {
        this.inputAccessors = inputAccessors;
    }
    getInputAccessors() {
        return this.inputAccessors;
    }
}
export default Selectors;
//# sourceMappingURL=Selectors.js.map