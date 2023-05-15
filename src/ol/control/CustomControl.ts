import { Control } from "ol/control";

export type Options = {
  element: HTMLElement
  target: string | HTMLElement
} & ControlSetOptions

/**
 * controlSet는 ...
 */
export type ControlSetOptions =
  { useControlSet?: true; controlId: string; setId: string }
  | { useControlSet?: false }

class CustomControl extends Control {

  /**
   * 컨트롤 아아디
   */
  id_: string

  /**
   * 세트 아이디
   */
  setId_: string;

  useControlSet_ = false;

  constructor(options: Options) {
    super({
      element: document.createElement('div'),
      target: options.target,
    });

    if(options.useControlSet) {
      this.set('set', options.setId)
      this.set('id', options.controlId)
      this.useControlSet_ = options.useControlSet
      this.id_ = options.controlId
      this.setId_ = options.setId
    }
  }

  /**
   * 같은 컨트롤 세트 내에서
   * 현재 활성화된 컨트롤이 있는지 검사.
   * 자기 자신은 제외.
   */
  checkMultiple_() {
    let multiple = false;
    this.getMap().getControls().forEach((control) => {
      if(control instanceof Control) {
        if(control.get('set') === this.setId_ && control.get('id') !== this.id_) {
          if(control.get('active')) {
            return multiple = true
          }
        }
      }
    })

    return multiple;
  }
  
}

export default CustomControl