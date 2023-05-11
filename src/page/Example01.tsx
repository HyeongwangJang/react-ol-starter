import OSM from 'ol/source/OSM';

import Map from '../ol/map/Map';
import LayerContainer from '../ol/layer/LayerContainer';
import TileLayer from '../ol/layer/TileLayer';

import ControlContainer from '../ol/control/container/ControlContainer';
import FullScreenControl from '../ol/control/FullScreenControl';
import MeasurementControl from '../ol/control/MeasurementControl';

const Example01 = () => {
  
  return (
    <div>
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
        </LayerContainer>
        <ControlContainer>
          <FullScreenControl />
          <MeasurementControl options={{
            useTooltip: true,
          }} />
        </ControlContainer>
      </Map>
    </div>
  );
};

export default Example01;
