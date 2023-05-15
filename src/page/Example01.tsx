import OSM from 'ol/source/OSM';

import Map from '../ol/map/Map';
import LayerContainer from '../ol/layer/wrapper/LayerContainer';
import TileLayer from '../ol/layer/wrapper/TileLayer';

import ControlContainer from '../ol/control/wrapper/ControlContainer';
import FullScreenControl from '../ol/control/wrapper/FullScreenControl';
import MeasurementControl from '../ol/control/wrapper/MeasurementControl';
import InquiryControl from '../ol/control/wrapper/InquiryControl';

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
    </div>
  );
};

export default Example01;
