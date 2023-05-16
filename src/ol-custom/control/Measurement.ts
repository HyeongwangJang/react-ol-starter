

import { Feature, Map } from 'ol';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import Overlay from 'ol/Overlay'
import { EventsKey } from 'ol/events'
import { LineString, Polygon } from 'ol/geom'
import { getArea, getLength } from 'ol/sphere';
import { unByKey } from 'ol/Observable';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { CLASS_UNSELECTABLE, CLASS_CONTROL } from 'ol/css'
import Draw from 'ol/interaction/Draw'
import EventType from 'ol/events/EventType'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector';

import { getLayerById } from 'ol-custom/util';
import { LAYER } from 'ol-custom/constants';
import CustomControl, { ControlSetOptions } from 'ol-custom/control/CustomControl';

export type Options = {
  className?: string
  mdClassName?: string
  maClassName?: string
  eraserClassName?: string
  mdLabel?: string | Text | HTMLElement
  maLabel?: string | Text | HTMLElement
  eraserLabel?: string | Text | HTMLElement
  mdTipLabel?: string
  maTipLabel?: string
  eraserTipLabel?: string
  target?: HTMLElement | string
  source?: HTMLElement | string
  useDistance?: boolean
  useArea?: boolean
  useEraser?: boolean
  useTooltip?: boolean
  map?: Map
} & ControlSetOptions

/**
 * @classdesc
 * 
 * 참고1: md = measure distance의 약자 / ma = measure area의 약자
 * 참고2: Measurement class는 ol/control/Zoom class를 참고로 작성
 */
class Measurement extends CustomControl {

  private mdButton_: HTMLElement;

  private maButton_: HTMLElement;

  private eraserButton_: HTMLElement;

  private useDistance_: boolean;

  private useArea_: boolean;

  private useEraser_: boolean;

  private useTooltip_: boolean;

  /**
   * Currently drawn feature.
   */
  private sketch_: Feature

  /**
   * The help tooltip element.
   */
  private helpTooltipElement_: HTMLElement;

  /**
   * Overlay to show the help messages.
   */
  private helpTooltip_: Overlay;

  /**
   * The measure tooltip element.
   */
  private measureTooltipElement_: HTMLElement;

  /**
   * Overlay to show the measurement.
   */
  private measureTooltip_: Overlay;

  /**
   * Message to show when the user is drawing a polygon.
   */
  private continuePolygonMsg_ = 'Click to continue drawing the polygon';

  /**
   * Message to show when the user is drawing a line.
   */
  private continueLineMsg_ = 'Click to continue drawing the line';

  private draw_: Draw

  private status_: 'distance_measureing' | 'area_measureing' | 'none';

  constructor(options: Options) {
    options = options ? options : {};    
    
    super({
      element: document.createElement('div'),
      target: options.target,
      useControlSet: options.useControlSet,
      controlId: options.useControlSet && options.controlId,
      setId: options.useControlSet && options.setId,
    })

    this.useDistance_ =
      options.useDistance !== undefined ? options.useDistance : true;
    this.useArea_ =
      options.useArea !== undefined ? options.useArea : true;
    this.useEraser_ =
      options.useEraser !== undefined ? options.useEraser : true;
    this.useTooltip_ =
      options.useTooltip !== undefined ? options.useTooltip : false;

    const className =
      options.className !== undefined ? options.className : 'ol-measurement';

    const mdClassName =
      options.mdClassName !== undefined ? options.mdClassName : className + '-distance';

    const maClassName =
      options.maClassName !== undefined ? options.maClassName : className + '-area';

    const eraserClassName =
      options.eraserClassName !== undefined ? options.eraserClassName : className + '-eraser';

    const mdLabel = options.mdLabel !== undefined ? options.mdLabel : '\u003D';
    const maLabel = options.maLabel !== undefined ? options.maLabel : '\u2260';
    const eraserLabel = options.eraserLabel !== undefined ? options.eraserLabel : '\u00D7';

    const mdTipLabel = options.mdTipLabel ? options.mdTipLabel : 'Measure distance';
    const maTipLabel = options.maTipLabel ? options.maTipLabel : 'Measure area';
    const eraserTipLabel = options.eraserTipLabel ? options.eraserTipLabel : 'Erase measurements';

    const mdLabelNode =
      typeof mdLabel === 'string' ? document.createTextNode(mdLabel) : mdLabel;
    const maLabelNode =
      typeof maLabel === 'string' ? document.createTextNode(maLabel) : maLabel;
    const eraserLabelNode =
      typeof eraserLabel === 'string' ? document.createTextNode(eraserLabel) : eraserLabel;

    if(this.useDistance_) {
      this.mdButton_ = document.createElement('button');
      this.mdButton_.title = mdTipLabel;
      this.mdButton_.className = mdClassName;
      this.mdButton_.setAttribute('type', 'button');
      this.mdButton_.appendChild(mdLabelNode);
      // @ts-ignore
      this.mdButton_.addEventListener(
        EventType.CLICK,
        this.handleMdClick_.bind(this),
        false
      )
    }

    if(this.useArea_) {
      this.maButton_ = document.createElement('button');
      this.maButton_.title = maTipLabel;
      this.maButton_.className = maClassName;
      this.maButton_.setAttribute('type', 'button');
      this.maButton_.appendChild(maLabelNode);
      // @ts-ignore
      this.maButton_.addEventListener(
        EventType.CLICK,
        this.handleMaClick_.bind(this),
        false
      )
    }

    if(this.useEraser_) {
      this.eraserButton_ = document.createElement('button');
      this.eraserButton_.title = eraserTipLabel;
      this.eraserButton_.className = eraserClassName;
      this.eraserButton_.setAttribute('type', 'button');
      this.eraserButton_.appendChild(eraserLabelNode);
      // @ts-ignore
      this.eraserButton_.addEventListener(
        EventType.CLICK,
        this.handleEraserClick_.bind(this),
        false
      )
    }

    const cssClasses =
      className + ' ' + CLASS_UNSELECTABLE + ' ' + CLASS_CONTROL;
    const element = this.element;

    element.className = cssClasses;
    this.useDistance_ && element.appendChild(this.mdButton_);
    this.useArea_ && element.appendChild(this.maButton_);
    this.useEraser_ && element.appendChild(this.eraserButton_);

    if(options.useTooltip) {
      this.helpTooltipElement_ = document.createElement('div');
      this.helpTooltipElement_.className = 'ol-tooltip hidden';
      this.helpTooltip_ = new Overlay({
        element: this.helpTooltipElement_,
        offset: [15, 0],
        positioning: 'center-left',
      });

      options.map.on('pointermove', this.pointerMoveHandler_.bind(this));

      options.map.getViewport().addEventListener('mouseout', () => {
        this.helpTooltipElement_
          && this.helpTooltipElement_.classList.add('hidden');
      });
    }

    if(options.useControlSet) {
      this.set('set', options.setId);
      this.set('id', options.controlId)
      this.useControlSet_ = options.useControlSet
      this.id_ = options.controlId;
      this.setId_ = options.setId
    }
  }

  /**
   * 거리 측정 버튼 클릭
   */
  private handleMdClick_(event: MouseEvent) {
    event.preventDefault();

    if(this.useControlSet_) {
      const multiple = this.checkMultiple_();
      if(multiple) return;
    }
    
    this.getMap().removeInteraction(this.draw_);

    if(this.status_ === 'distance_measureing') {
      this.status_ = 'none';
      this.helpTooltipElement_.parentNode.removeChild(this.helpTooltipElement_);
      this.helpTooltipElement_ = null;
      this.mdButton_.classList.remove('active')
      this.set('active', false)
      return;
    }
    
    this.addInteraction_('distance');
    this.status_ = 'distance_measureing'
    this.set('active', true);
    this.maButton_.classList.remove('active')
    this.mdButton_.classList.add('active')
  }
  
  /**
   * 면적 측정 버튼 클릭
   */
  private handleMaClick_(event: MouseEvent) {
    event.preventDefault();

    if(this.useControlSet_) {
      const multiple = this.checkMultiple_();
      if(multiple) return;
    }
    
    this.getMap().removeInteraction(this.draw_);
    
    // 
    if(this.status_ === 'area_measureing') {
      this.status_ = 'none';
      this.maButton_.classList.remove('active')
      this.helpTooltipElement_.parentNode.removeChild(this.helpTooltipElement_);
      this.helpTooltipElement_ = null;
      this.set('active', false)
      return;
    }

    this.addInteraction_('area');
    this.status_ = 'area_measureing'
    this.mdButton_.classList.remove('active')
    this.maButton_.classList.add('active')
    this.set('active', true)
  }

  /**
   * 지우개 버튼 클릭
   */
  private handleEraserClick_() {
    // erase features
    const layer = getLayerById<VectorLayer<VectorSource>>(this.getMap(), LAYER.measurement)
    const features = layer.getSource().getFeatures();
    features.forEach(fe => {
      layer.getSource().removeFeature(fe)
    });

    // erase static tooltip
    const tooltips = document.querySelectorAll('.ol-tooltip-static');
    
    tooltips.forEach(tooltip => {
      tooltip.parentNode.removeChild(tooltip)
    })
  }

  /**
   * Handle pointer move.
   */
  private pointerMoveHandler_(evt: MapBrowserEvent<UIEvent>) {    
    if (evt.dragging || !this.helpTooltipElement_) {
      return;
    }
    let helpMsg = 'Click to start drawing';

    if (this.sketch_) {
      const geom = this.sketch_.getGeometry();
      if (geom instanceof Polygon) {
        helpMsg = this.continuePolygonMsg_;
      } else if (geom instanceof LineString) {
        helpMsg = this.continueLineMsg_;
      }
    }

    this.helpTooltipElement_.innerHTML = helpMsg;
    this.helpTooltip_.setPosition(evt.coordinate);

    this.helpTooltipElement_.classList.remove('hidden');
  };

  /**
   * Format length output.
   */
  private formatLength_(line: LineString) {
    const length = getLength(line);
    let output;
    if (length > 100) {
      output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
      output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
  };

  /**
   * Format area output.
   */
  private formatArea_(polygon: Polygon) {
    const area = getArea(polygon);
    let output;
    if (area > 10000) {
      output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
      output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
  };

  private addInteraction_(measureType: 'distance' | 'area') {
    const self = this;
    const type = measureType === 'area' ? 'Polygon' : 'LineString';
    const map = this.getMap();
    const source = 
      getLayerById<VectorLayer<VectorSource>>(map, LAYER.measurement)
      .getSource();

    this.draw_ = new Draw({
      source: source,
      type: type,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: 'rgba(0, 0, 0, 0.5)',
          lineDash: [10, 10],
          width: 2,
        }),
        image: new CircleStyle({
          radius: 5,
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
          }),
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
        }),
      }),
    });
    map.addInteraction(this.draw_);
  
    this.createMeasureTooltip_();
    this.useTooltip_ && this.createHelpTooltip_();
  
    let listener: EventsKey;
    this.draw_.on('drawstart', function (evt) {
      // set sketch
      self.sketch_ = evt.feature;
  
      // @ts-ignore
      let tooltipCoord: Coordinate = evt.coordinate;
  
      listener = self.sketch_.getGeometry().on('change',function (evt) {
        const geom = evt.target;
        let output;
        if (geom instanceof Polygon) {
          output = self.formatArea_(geom);
          tooltipCoord = geom.getInteriorPoint().getCoordinates();
        } else if (geom instanceof LineString) {
          output = self.formatLength_(geom);
          tooltipCoord = geom.getLastCoordinate();
        }
        self.measureTooltipElement_.innerHTML = output;
        self.measureTooltip_.setPosition(tooltipCoord);
      });
    });

    this.draw_.on('drawend', function () {
      self.measureTooltipElement_.className = 'ol-tooltip ol-tooltip-static';
      self.measureTooltip_.setOffset([0, -7]);
      // unset sketch
      self.sketch_ = null;
      // unset tooltip so that a new one can be created
      self.measureTooltipElement_ = null;
      self.createMeasureTooltip_();
      unByKey(listener);
    });
  }

  /**
   * Creates a new help tooltip
   */
  private createHelpTooltip_() {
    if (this.helpTooltipElement_) {
      this.helpTooltipElement_.parentNode.removeChild(this.helpTooltipElement_);
    }
    this.helpTooltipElement_ = document.createElement('div');
    this.helpTooltipElement_.className = 'ol-tooltip hidden';
    this.helpTooltip_ = new Overlay({
      element: this.helpTooltipElement_,
      offset: [15, 0],
      positioning: 'center-left',
    });
    this.getMap().addOverlay(this.helpTooltip_);
  }
  
  /**
   * Creates a new measure tooltip
  */
 private createMeasureTooltip_() {
   if (this.measureTooltipElement_) {
      this.measureTooltipElement_.parentNode.removeChild(this.measureTooltipElement_);
    }
    this.measureTooltipElement_ = document.createElement('div');
    this.measureTooltipElement_.className = 'ol-tooltip ol-tooltip-measure';
    this.measureTooltip_ = new Overlay({
      element: this.measureTooltipElement_,
      offset: [0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false,
    });
    this.getMap().addOverlay(this.measureTooltip_);
  }
}

export default Measurement