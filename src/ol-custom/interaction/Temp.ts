import { Feature, MapBrowserEvent } from "ol";
import { ObjectEvent } from 'ol/Object'
import { EventsKey } from 'ol/events';
import { CombinedOnSignature, EventTypes, OnSignature } from 'ol/Observable';
import { Types } from 'ol/ObjectEventType'
import Event from 'ol/events/Event';
import PointerInteraction, { Options as PointerOptions } from 'ol/interaction/Pointer';
import { Draw } from "ol/interaction";

enum TempEventType {
  TEMPSTART = 'tempstart',
  TEMPEND = 'tempend',
  TEMPABORT = 'tempabort',
}
/**
 * @classdesc TempEvent
 * @extends {Event}
 * 이벤트의 리턴 타입 중 feature에 임시로 any 추가해놨음.
 * 추후 수정 필요
 */
export class TempEvent extends Event {

  feature: Feature;

  constructor(type: TempEventType, feature: Feature | any) {
    super(type);

    /**
     * 
     */
    this.feature = feature;
  }
}

type TempSignature<Return> = OnSignature<EventTypes, Event, Return>
  & OnSignature<Types | 'change:active', ObjectEvent, Return>
  & OnSignature<'tempstart' | 'tempend' | 'tempabort', TempEvent, Return>
  & CombinedOnSignature<EventTypes | Types | 'change:active' | 'tempstart' | 'tempend' | 'tempabort', Return>;

type TempOptions = {
  type: 'point' | 'area'
}

class Temp extends PointerInteraction {

  private type_: 'Point' | 'Polygon'

  draw: Draw;

  private freehand_ = true;

  declare on: TempSignature<EventsKey>;

  declare once: TempSignature<EventsKey>;

  declare un: TempSignature<void>;

  constructor(options: TempOptions) {
    super(options as PointerOptions);

    this.type_ = options.type === 'point' ? 'Point' : 'Polygon'
  }

  handleEvent(evt: MapBrowserEvent<any>) {
    if (this.freehand_) {
      this.freehand_ = false;

      const self = this;

      this.draw = new Draw({
        type: this.type_,
      })
      this.getMap().addInteraction(this.draw);

      this.draw.on('drawend', function (drawEvt) {
        if (self.type_ === 'Point') {

          self.getMap().removeInteraction(self.draw);

          self.dispatchEvent(
            new TempEvent(TempEventType.TEMPEND, '포인트 선택')
          );
        } else {
          const polygon = drawEvt.feature.getGeometry();
          const extent = polygon.getExtent();

          console.log('POLYGON::', polygon);
          console.log('EXTENT::', extent);

          self.getMap().removeInteraction(self.draw);

          self.dispatchEvent(
            new TempEvent(TempEventType.TEMPEND, '면적 선택')
          );
        }

        self.freehand_ = true;
      });
    }

    return true
  }

}

export default Temp