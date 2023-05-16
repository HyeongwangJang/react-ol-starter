import OSM from 'ol/source/OSM';

import Map from 'ol-custom/map/Map';
import LayerContainer from 'ol-custom/layer/wrapper/LayerContainer';
import TileLayer from 'ol-custom/layer/wrapper/TileLayer';

import ControlContainer from 'ol-custom/control/wrapper/ControlContainer';
import FullScreenControl from 'ol-custom/control/wrapper/FullScreenControl';
import MeasurementControl from 'ol-custom/control/wrapper/MeasurementControl';
import InquiryControl from 'ol-custom/control/wrapper/InquiryControl';

const Example01 = () => {

  /**
   * Tip.
   * 레이어는 Layer Container 안에
   * 컨트롤은 Control Container 안에 넣어주세요.
   */
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
