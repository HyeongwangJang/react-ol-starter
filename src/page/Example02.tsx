import { createXYZ } from 'ol/tilegrid'
import MVT from 'ol/format/MVT'
import OSM from 'ol/source/OSM';

import VectorTileLayer from "ol-custom/layer/wrapper/VectorTileLayer";
import Map from "ol-custom/map/Map";
import VectorTileSource from "ol-custom/source/wrapper/VectorTileSource";
import LayerContainer from 'ol-custom/layer/wrapper/LayerContainer';
import TileLayer from 'ol-custom/layer/wrapper/TileLayer';
import ControlContainer from 'ol-custom/control/wrapper/ControlContainer';
import FullScreenControl from 'ol-custom/control/wrapper/FullScreenControl';
import MeasurementControl from 'ol-custom/control/wrapper/MeasurementControl';
import InquiryControl from 'ol-custom/control/wrapper/InquiryControl';

const Example02 = () => {
  return (
    <Map
      zoom={5}
      center={[50, 10]}
      useDrawLayer={true}
      useMeasurementLayer={true}
    >
      <LayerContainer>
        <TileLayer
          options={{
            source: new OSM(),
          }}
          id="osm-layer"
          zIndex={1}
        />
        <VectorTileLayer
          id="gas-base-layer"
          options={{}}
          zIndex={2}
        >
          <VectorTileSource
            layerId="gas-base-layer"
            options={{
              tileGrid: createXYZ(),
              format: new MVT(),
              url: 'http://192.168.0.81:8080/geoserver/gwc/service/tms/1.0.0/testGeoserver:BASE_SIGJ_AS@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
            }}
          />
        </VectorTileLayer>
        <VectorTileLayer
          id="gas-line-layer"
          options={{}}
          zIndex={3}
        >
          <VectorTileSource
            layerId="gas-line-layer"
            options={{
              tileGrid: createXYZ(),
              format: new MVT(),
              url: 'http://192.168.0.81:8080/geoserver/gwc/service/tms/1.0.0/testGeoserver:GAS_GAPI_LS@EPSG%3A900913@pbf/{z}/{x}/{-y}.pbf'
            }}
          />
        </VectorTileLayer>
      </LayerContainer>

      <ControlContainer>
        <FullScreenControl />
        <MeasurementControl options={{
          useTooltip: true,
          useControlSet: true,
          controlId: 'measurement-control',
          setId: 'set-1',
        }} />
        <InquiryControl options={{
          useTooltip: true,
          useControlSet: true,
          controlId: 'inquiry-control',
          setId: 'set-1',
        }} />
      </ControlContainer>
    </Map>
  );
};

export default Example02;
