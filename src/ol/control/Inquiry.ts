import { Map, Overlay, MapBrowserEvent } from 'ol'
import { DoubleClickZoom } from 'ol/interaction';
import EventType from 'ol/events/EventType'
import { CLASS_CONTROL, CLASS_UNSELECTABLE } from 'ol/css';

import Temp from '../interaction/Temp';
import CustomControl, { ControlSetOptions } from './CustomControl';

export type Options = {
  className?: string
  piClassName?: string
  aiClassName?: string
  piLabel?: string | Text | HTMLElement
  aiLabel?: string | Text | HTMLElement
  piTipLabel?: string
  aiTipLabel?: string
  target?: HTMLElement | string
  source?: HTMLElement | string
  usePoint?: boolean
  useArea?: boolean
  useTooltip?: boolean
  map?: Map
  stopClick?: boolean
} & ControlSetOptions

/**
 * @classdesc
 * 참고1: pi = point inquiry / ai = area inquiry의 약자임
 */
class Inquiry extends CustomControl {

  // inquiryEvent: Subject<number>;

  // private id_: string;

  private usePoint_: boolean;

  private useArea_: boolean;

  private useTooltip_: boolean;

  private piButton_: HTMLElement;

  private aiButton_: HTMLElement;

  private helpTooltipElement_: HTMLDivElement;

  private helpTooltip_: Overlay;

  private interaction_: Temp;

  private status_: 'point_inquirying' | 'area_inquirying' | 'none'

  /**
   * 지역 조회 사용 시,
   * draw가 끝난 후 dbclickzoom이 발생하여 임의로 비활성화 했다가
   * 다시 추가해주어야 한다.
   */
  private dbclickzoom_: DoubleClickZoom;

  constructor(options: Options) {
    options = options ? options : {};

    super({
      element: document.createElement('div'),
      target: options.target,
      useControlSet: options.useControlSet,
      controlId: options.useControlSet && options.controlId,
      setId: options.useControlSet && options.setId,
    });

    this.usePoint_ =
      options.usePoint !== undefined ? options.usePoint : true;
    this.useArea_ =
      options.useArea !== undefined ? options.useArea : true;
    this.useTooltip_ =
      options.useTooltip !== undefined ? options.useTooltip : false;

    const className =
      options.className !== undefined ? options.className : 'ol-inquiry';
    const piClassName = 
      options.piClassName !== undefined ? options.piClassName : 'ol-inquiry-point';
    const aiClassName = 
      options.aiClassName !== undefined ? options.aiClassName : 'ol-inquiry-area';
    
    /** 
     * Tip. 아이콘 변경
     */
    const piLabel =
      options.piLabel !== undefined ? options.piLabel : '\u203A';
    const aiLabel =
      options.aiLabel !== undefined ? options.aiLabel : '\u00BB';

    /**
     * Tip. 툴팁 변경
     */
    const piTipLabel =
      options.piTipLabel !== undefined ? options.piTipLabel : '포인트 조회';
    const aiTipLabel =
      options.aiTipLabel !== undefined ? options.aiTipLabel : '지역 조회';

    const piLabelNode =
      typeof piLabel === 'string' ? document.createTextNode(piLabel) : piLabel;
    const aiLabelNode =
      typeof aiLabel === 'string' ? document.createTextNode(aiLabel) : aiLabel;

    if(this.usePoint_) {
      this.piButton_ = document.createElement('button');
      this.piButton_.title = piTipLabel;
      this.piButton_.className = piClassName;
      this.piButton_.setAttribute('type', 'button');
      this.piButton_.appendChild(piLabelNode)
      // @ts-ignore
      this.piButton_.addEventListener(
        EventType.CLICK,
        this.handlePiClick_.bind(this),
        false
      )
    }
    if(this.useArea_) {
      this.aiButton_ = document.createElement('button');
      this.aiButton_.title = aiTipLabel;
      this.aiButton_.className = aiClassName;
      this.aiButton_.setAttribute('type', 'button');
      this.aiButton_.appendChild(aiLabelNode)
      // @ts-ignore
      this.aiButton_.addEventListener(
        EventType.CLICK,
        this.handleAiClick_.bind(this),
        false
      )
    }

    const cssClasses =
      className + ' ' + CLASS_UNSELECTABLE + ' ' + CLASS_CONTROL;
    const element = this.element;

    element.className = cssClasses;
    this.usePoint_ && element.appendChild(this.piButton_);
    this.useArea_ && element.appendChild(this.aiButton_);

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
  }

  /**
   * Handle pointer move.
   */
  private pointerMoveHandler_(evt: MapBrowserEvent<UIEvent>) {    
    if (evt.dragging || !this.helpTooltipElement_) {
      return;
    }
    const helpMsg = '조회 할 대상을 선택하세요';

    this.helpTooltipElement_.innerHTML = helpMsg;
    this.helpTooltip_.setPosition(evt.coordinate);

    this.helpTooltipElement_.classList.remove('hidden');
  };

  /**
   * 포인트 조회 클릭
   */
  private handlePiClick_(event: MouseEvent) {
    event.preventDefault();

    if(this.useControlSet_) {
      const multiple = this.checkMultiple_();
      if(multiple) return;
    }

    this.getMap().removeInteraction(this.interaction_?.draw);
    this.getMap().removeInteraction(this.interaction_);

    if(this.status_ === 'point_inquirying') {
      this.status_ = 'none';
      this.helpTooltipElement_.parentNode.removeChild(this.helpTooltipElement_);
      this.helpTooltipElement_ = null;
      this.piButton_.classList.remove('active')
      this.set('active', false)
      return;
    }
    this.addInteraction_('point');
    this.status_ = 'point_inquirying';
    this.aiButton_.classList.remove('active')
    this.piButton_.classList.add('active')
    this.set('active', true)

    this.getMap().getInteractions().forEach((interaction) => {
      if(interaction instanceof DoubleClickZoom) {
        this.dbclickzoom_ = interaction
      }
    })
    if(this.dbclickzoom_) {
      this.getMap().removeInteraction(this.dbclickzoom_)
    }
  }

  /**
   * 영역 조회 클릭
   */
  private handleAiClick_(event: MouseEvent) {
    event.preventDefault();

    if(this.useControlSet_) {
      const multiple = this.checkMultiple_();
      if(multiple) return;
    }

    this.getMap().removeInteraction(this.interaction_?.draw);
    this.getMap().removeInteraction(this.interaction_);
    
    if(this.status_ === 'area_inquirying') {
      this.status_ = 'none';
      this.helpTooltipElement_.parentNode.removeChild(this.helpTooltipElement_);
      this.helpTooltipElement_ = null;
      this.aiButton_.classList.remove('active')
      this.set('active', false)
      return;
    }
    this.addInteraction_('area');
    this.status_ = 'area_inquirying';
    this.piButton_.classList.remove('active')
    this.aiButton_.classList.add('active')
    this.set('active', true)

    this.getMap().getInteractions().forEach((interaction) => {
      if(interaction instanceof DoubleClickZoom) {
        this.dbclickzoom_ = interaction
      }
    })
    if(this.dbclickzoom_) {
      this.getMap().removeInteraction(this.dbclickzoom_)
    }
  }

  private addInteraction_(type: 'point' | 'area') {
    const self = this;

    this.interaction_ = new Temp({
      type: type,
    })
    this.getMap().addInteraction(this.interaction_);

    this.useTooltip_ && this.createHelpTooltip_();

    this.interaction_.on('tempend', function(evt) {
      // console.log('temp end event::', evt)
      self.status_ = 'none';
      self.helpTooltipElement_.parentNode.removeChild(self.helpTooltipElement_);
      self.helpTooltipElement_ = null;
      self.getMap().removeInteraction(self.interaction_)
      self.set('active', false)
      self.aiButton_.classList.remove('active');
      self.piButton_.classList.remove('active');
      if(self.dbclickzoom_) {
        setTimeout(function() {
          self.getMap().addInteraction(self.dbclickzoom_)
        });
      }
    })
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

}

export default Inquiry