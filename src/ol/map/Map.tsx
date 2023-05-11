import { ReactNode, useRef, useState, useEffect, FC } from 'react';

import OLMap from 'ol/Map';
import OLView from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { Coordinate } from 'ol/coordinate';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

import './Map.css';
import OLContext from '../OLContext';

type Props = {
  children: ReactNode;
  zoom: number;
  center: Coordinate;
  useMeasurementLayer: boolean;
  useDrawLayer: boolean;
};

const Map: FC<Props> = (props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<OLMap>();

  // on component mount
  useEffect(() => {
    if (!mapRef.current) return;

    const layers = [];

    if (props.useMeasurementLayer) {
      const source = new VectorSource({
        features: [],
        wrapX: false,
      });
      const measurementLayer = new VectorLayer({
        source: source,
        zIndex: 99,
      });
      measurementLayer.set('id', 'measurement-layer');
      layers.push(measurementLayer);
    }
    if (props.useDrawLayer) {
      const source = new VectorSource({
        features: [],
        wrapX: false,
      });
      const drawLayer = new VectorLayer({
        source: source,
        zIndex: 98,
      });
      drawLayer.set('id', 'draw-layer');
      layers.push(drawLayer);
    }

    const options = {
      view: new OLView({
        zoom: props.zoom,
        center: props.center,
      }),
      layers: layers,
      controls: defaultControls(),
      overlays: [],
    };

    const mapObject = new OLMap(options);
    mapObject.setTarget(mapRef.current);
    setMap(mapObject);

    return () => mapObject.setTarget(undefined);
  }, []);

  // zoom change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setZoom(props.zoom);
  }, [props.zoom, map]);

  // center change handler
  useEffect(() => {
    if (!map) return;
    map.getView().setCenter(props.center);
  }, [props.center, map]);

  return (
    <OLContext.Provider value={{ map }}>
      <div ref={mapRef} className="ol-map">
        {props.children}
      </div>
    </OLContext.Provider>
  );
};
export default Map;
