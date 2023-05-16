import { Control } from "ol/control";

export type Options = {
  element: HTMLElement
  target: string | HTMLElement
} & ControlSetOptions

/**
 * @classdesc CustomControl
 * @extends {Control}
 * 컨트롤 세트를 적용하려면 CustomControl을 상속 받아야 함.
 * 컨트롤 세트란 중복으로 활성화되면 안되는 컨트롤들을 세트로 묶어서 중복 활성화를 방지하는 것임
 * @example Example01
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