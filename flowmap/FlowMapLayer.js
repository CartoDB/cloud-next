/*
 * Copyright 2018 Teralytics
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { CompositeLayer } from '@deck.gl/core';
import { GeoJsonLayer } from '@deck.gl/layers';
import AnimatedFlowLinesLayer from './AnimatedFlowLinesLayer/AnimatedFlowLinesLayer';
import FlowCirclesLayer from './FlowCirclesLayer/FlowCirclesLayer';
import FlowLinesLayer from './FlowLinesLayer/FlowLinesLayer';
import Selectors from './Selectors';
import { isFeatureCollection, PickingType, } from './types';
var LayerKind;
(function (LayerKind) {
    LayerKind["LOCATIONS"] = "LOCATIONS";
    LayerKind["LOCATION_AREAS"] = "LOCATION_AREAS";
    LayerKind["LOCATION_AREAS_OUTLINES"] = "LOCATION_AREAS_OUTLINES";
    LayerKind["LOCATION_AREAS_SELECTED_AND_HIGHLIGHTED"] = "LOCATION_AREAS_SELECTED_AND_HIGHLIGHTED";
    LayerKind["FLOWS"] = "FLOWS";
    LayerKind["LOCATIONS_HIGHLIGHTED"] = "LOCATIONS_HIGHLIGHTED";
    LayerKind["FLOWS_HIGHLIGHTED"] = "FLOWS_HIGHLIGHTED";
})(LayerKind || (LayerKind = {}));
const LAYER_ID_SEPARATOR = ':::';
function getLayerId(baseLayerId, layerKind) {
    return `${baseLayerId}${LAYER_ID_SEPARATOR}${layerKind.valueOf()}`;
}
function getLayerKind(id) {
    const kind = id.substr(id.lastIndexOf(LAYER_ID_SEPARATOR) + LAYER_ID_SEPARATOR.length);
    return LayerKind[kind];
}
function getPickType({ id }) {
    switch (getLayerKind(id)) {
        case LayerKind.FLOWS:
        case LayerKind.FLOWS_HIGHLIGHTED:
            return PickingType.FLOW;
        case LayerKind.LOCATIONS:
        case LayerKind.LOCATIONS_HIGHLIGHTED:
            return PickingType.LOCATION;
        case LayerKind.LOCATION_AREAS:
            return PickingType.LOCATION_AREA;
        default:
            return undefined;
    }
}
export default class FlowMapLayer extends CompositeLayer {
    constructor(props) {
        super(props);
    }
    initializeState() {
        const { getLocationTotalIn, getLocationTotalOut, getLocationTotalWithin, getLocationId, getLocationCentroid, getFlowOriginId, getFlowDestId, getFlowMagnitude, getFlowColor, } = this.props;
        const selectors = new Selectors({
            getLocationId: getLocationId,
            getLocationCentroid: getLocationCentroid,
            getLocationTotalIn,
            getLocationTotalOut,
            getLocationTotalWithin,
            getFlowOriginId: getFlowOriginId,
            getFlowDestId: getFlowDestId,
            getFlowMagnitude: getFlowMagnitude,
            getFlowColor,
        });
        this.setState({ selectors });
    }
    updateState(params) {
        super.updateState(params);
        const { props, changeFlags } = params;
        if (changeFlags.propsChanged) {
            const { getLocationTotalIn, getLocationTotalOut, getLocationTotalWithin, getLocationId, getLocationCentroid, getFlowOriginId, getFlowDestId, getFlowMagnitude, getFlowColor, } = props;
            this.state.selectors.setInputAccessors({
                getLocationId,
                getLocationCentroid,
                getLocationTotalIn,
                getLocationTotalOut,
                getLocationTotalWithin,
                getFlowOriginId,
                getFlowDestId,
                getFlowMagnitude,
                getFlowColor,
            });
        }
    }
    getPickingInfo(params) {
        const type = getPickType(params.sourceLayer);
        if (!type) {
            return params.info;
        }
        const info = Object.assign(Object.assign({}, params.info), { type });
        const { selectors } = this.state;
        if (type === PickingType.FLOW) {
            const getLocationById = selectors.getLocationByIdGetter(this.props);
            const { getFlowOriginId, getFlowDestId } = selectors.getInputAccessors();
            const flow = info.object;
            return Object.assign(Object.assign({}, info), (flow && {
                origin: getLocationById(getFlowOriginId(flow)),
                dest: getLocationById(getFlowDestId(flow)),
            }));
        }
        if (type === PickingType.LOCATION || type === PickingType.LOCATION_AREA) {
            const location = type === PickingType.LOCATION ? info.object && info.object.location : info.object;
            const getLocationTotalIn = selectors.getLocationTotalInGetter(this.props);
            const getLocationTotalOut = selectors.getLocationTotalOutGetter(this.props);
            const getLocationTotalWithin = selectors.getLocationTotalWithinGetter(this.props);
            const getLocationCircleRadius = selectors.getLocationCircleRadiusGetter(this.props);
            return Object.assign(Object.assign({}, info), (location && {
                object: location,
                totalIn: getLocationTotalIn(location),
                totalOut: getLocationTotalOut(location),
                totalWithin: getLocationTotalWithin(location),
                circleRadius: getLocationCircleRadius({ location, type: "outer" /* OUTER */ }),
            }));
        }
        return info;
    }
    renderLayers() {
        const { showLocationAreas, locations, highlightedLocationId } = this.props;
        const { selectors } = this.state;
        const topFlows = selectors.getTopFlows(this.props);
        const highlightedFlows = selectors.getHighlightedFlows(this.props);
        const isLocationHighlighted = highlightedLocationId != null;
        const locationCircles = selectors.getLocationCircles(this.props);
        const layers = [];
        if (showLocationAreas && isFeatureCollection(locations)) {
            layers.push(this.getLocationAreasLayer(getLayerId(this.props.id, LayerKind.LOCATION_AREAS), false));
        }
        layers.push(this.getFlowLinesLayer(getLayerId(this.props.id, LayerKind.FLOWS), topFlows, false, isLocationHighlighted));
        if (showLocationAreas && isFeatureCollection(locations)) {
            layers.push(this.getHighlightedLocationAreasLayer(getLayerId(this.props.id, LayerKind.LOCATION_AREAS_SELECTED_AND_HIGHLIGHTED)));
        }
        if (highlightedFlows) {
            layers.push(this.getFlowLinesLayer(getLayerId(this.props.id, LayerKind.FLOWS_HIGHLIGHTED), highlightedFlows, true, false));
        }
        layers.push(this.getLocationCirclesLayer(getLayerId(this.props.id, LayerKind.LOCATIONS), locationCircles, false));
        if (isLocationHighlighted) {
            const highlightedLocationCircles = selectors.getHighlightedLocationCircles(this.props);
            layers.push(this.getLocationCirclesLayer(getLayerId(this.props.id, LayerKind.LOCATIONS_HIGHLIGHTED), highlightedLocationCircles, true));
        }
        if (showLocationAreas && isFeatureCollection(locations)) {
            layers.push(this.getLocationAreasLayer(getLayerId(this.props.id, LayerKind.LOCATION_AREAS_OUTLINES), true));
        }
        return layers;
    }
    getLocationAreasLayer(id, outline) {
        const { locations, selectedLocationIds, highlightedLocationId, highlightedFlow, updateTriggers } = this.props;
        const { selectors } = this.state;
        const colors = selectors.getColors(this.props);
        return new GeoJsonLayer(this.getSubLayerProps(Object.assign(Object.assign({ id, getFillColor: selectors.getLocationAreaFillColorGetter(this.props), getLineColor: colors.locationAreas.outline, lineJointRounded: true, data: locations, stroked: outline, filled: !outline }, (outline && { pickable: false })), { lineWidthMinPixels: 1, pointRadiusMinPixels: 1, updateTriggers: {
                getFillColor: Object.assign(Object.assign({ colors }, (outline && { selectedLocationIds, highlightedLocationId, highlightedFlow })), updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getLocationAreasFillColor),
                getLineColor: Object.assign({ colors }, updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getLocationAreasLineColor),
            } })));
    }
    getHighlightedLocationAreasLayer(id) {
        const { selectors } = this.state;
        const { highlightedLocationId, highlightedLocationAreaId, updateTriggers } = this.props;
        const colors = selectors.getColors(this.props);
        const getLocationById = selectors.getLocationByIdGetter(this.props);
        return new GeoJsonLayer(this.getSubLayerProps({
            id,
            getFillColor: () => colors.locationAreas.highlighted,
            getLineColor: colors.locationAreas.outline,
            lineJointRounded: true,
            data: highlightedLocationId
                ? getLocationById(highlightedLocationId)
                : highlightedLocationAreaId
                    ? getLocationById(highlightedLocationAreaId)
                    : undefined,
            stroked: false,
            filled: true,
            pickable: false,
            lineWidthMinPixels: 5,
            updateTriggers: {
                getFillColor: Object.assign({ colors }, updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getLocationAreasFillColor),
                getLineColor: Object.assign({ colors }, updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getLocationAreasLineColor),
            },
        }));
    }
    getFlowLinesLayer(id, flows, highlighted, dimmed) {
        const { getFlowOriginId, getFlowDestId, getFlowMagnitude, getLocationCentroid, getAnimatedFlowLineStaggering, showTotals, maxLocationCircleSize, outlineThickness, minPickableFlowThickness, maxFlowThickness, flowMagnitudeExtent, locationTotalsExtent, updateTriggers, } = this.props;
        const { selectors } = this.state;
        const endpointOffsets = [(maxLocationCircleSize || 0) + 1, (maxLocationCircleSize || 0) + 1];
        const getLocationRadius = selectors.getLocationCircleRadiusGetter(this.props);
        const getLocationById = selectors.getLocationByIdGetter(this.props);
        const flowThicknessScale = selectors.getFlowThicknessScale(this.props);
        const getSourcePosition = (flow, info) => getLocationCentroid(getLocationById(getFlowOriginId(flow, info)));
        const getTargetPosition = (flow, info) => getLocationCentroid(getLocationById(getFlowDestId(flow, info)));
        const getThickness = (flow, info) => flowThicknessScale(getFlowMagnitude(flow, info));
        const getEndpointOffsets = (flow, info) => {
            if (!showTotals) {
                return endpointOffsets;
            }
            return [
                getLocationRadius({
                    location: getLocationById(getFlowOriginId(flow, info)),
                    type: "outline" /* OUTLINE */,
                }),
                getLocationRadius({
                    location: getLocationById(getFlowDestId(flow, info)),
                    type: "outline" /* OUTLINE */,
                }),
            ];
        };
        const flowColorScale = selectors.getFlowColorScale(this.props);
        const colors = selectors.getColors(this.props);
        const getColor = selectors.getFlowLinesColorGetter(colors, flowColorScale, highlighted, dimmed);
        const { animate } = this.props;
        const thicknessUnit = maxFlowThickness != null ? maxFlowThickness : FlowLinesLayer.defaultProps.thicknessUnit;
        const baseProps = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({ id,
            getSourcePosition,
            getTargetPosition,
            getThickness,
            getEndpointOffsets,
            getColor, data: flows }, (highlighted && { pickable: false })), { drawOutline: !dimmed, updateTriggers: {
                getSourcePosition: updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getFlowLinesSourcePosition,
                getTargetPosition: updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getFlowLinesTargetPosition,
                getThickness: Object.assign({ flowMagnitudeExtent,
                    maxFlowThickness }, updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getFlowLinesThickness),
                getColor: Object.assign({ colors,
                    dimmed }, updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getFlowLinesColor),
                getEndpointOffsets: Object.assign({ showTotals,
                    locationTotalsExtent }, updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getFlowLinesEndpointOffsets),
            }, thicknessUnit, outlineColor: colors.outlineColor }), (outlineThickness && { outlineThickness })), (minPickableFlowThickness != null && {
            getPickable: (f) => (thicknessUnit * getThickness(f) >= minPickableFlowThickness ? 1.0 : 0.0),
        })), { parameters: Object.assign(Object.assign({}, this.props.parameters), { depthTest: false }) });
        if (animate) {
            return new AnimatedFlowLinesLayer(this.getSubLayerProps(Object.assign(Object.assign(Object.assign(Object.assign({}, baseProps), { currentTime: this.props.animationCurrentTime }), (this.props.animationTailLength != null && {
                animationTailLength: this.props.animationTailLength,
            })), (getAnimatedFlowLineStaggering && {
                getStaggering: getAnimatedFlowLineStaggering,
            }))));
        }
        else {
            return new FlowLinesLayer(this.getSubLayerProps(baseProps));
        }
    }
    getLocationCirclesLayer(id, circles, highlighted) {
        const { highlightedLocationId, selectedLocationIds, getLocationCentroid, flows, showTotals, updateTriggers, maxLocationCircleSize, locationTotalsExtent, } = this.props;
        const { selectors } = this.state;
        const getRadius = showTotals ? selectors.getLocationCircleRadiusGetter(this.props) : () => maxLocationCircleSize;
        const colors = selectors.getColors(this.props);
        const getColor = selectors.getLocationCircleColorGetter(this.props);
        const getPosition = locCircle => getLocationCentroid(locCircle.location);
        return new FlowCirclesLayer(this.getSubLayerProps({
            id,
            getColor,
            getPosition,
            getRadius,
            data: circles,
            updateTriggers: {
                getRadius: Object.assign({ showTotals,
                    selectedLocationIds,
                    maxLocationCircleSize,
                    locationTotalsExtent,
                    flows }, updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getCirclesRadius),
                getColor: Object.assign({ colors,
                    highlightedLocationId,
                    selectedLocationIds,
                    flows }, updateTriggers === null || updateTriggers === void 0 ? void 0 : updateTriggers.getCirclesColor),
            },
            parameters: Object.assign(Object.assign({}, this.props.parameters), { depthTest: false }),
        }));
    }
}
FlowMapLayer.layerName = 'FlowMapLayer';
FlowMapLayer.defaultProps = {
    getLocationId: { type: 'accessor', value: (l) => l.id || l.properties.id },
    getLocationCentroid: { type: 'accessor', value: (l) => l.properties.centroid },
    getFlowOriginId: { type: 'accessor', value: (f) => f.origin },
    getFlowDestId: { type: 'accessor', value: (f) => f.dest },
    getFlowMagnitude: { type: 'accessor', value: (f) => f.count },
    showTotals: true,
    maxLocationCircleSize: 15,
    outlineThickness: 1,
    showLocationAreas: true,
    animationTailLength: 0.7,
};
//# sourceMappingURL=FlowMapLayer.js.map