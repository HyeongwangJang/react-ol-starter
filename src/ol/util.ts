import Map from 'ol/Map';
import { Group } from 'ol/layer';
import BaseLayer from 'ol/layer/Base';

export function getLayerById<T extends BaseLayer>(
  map: Map,
  layerId: string
): T {
  let layer: T;

  map.getLayers().forEach((l) => {
    if (l.get('id') === layerId) {
      layer = l as T;
    } else if (l instanceof Group) {
      const childLayers = (l as Group).getLayers();
      childLayers.forEach((ll) => {
        if (ll.get('id') == layerId) {
          layer = ll as T;
        }
      });
    }
  });

  // @ts-ignore
  return layer as T;
}
