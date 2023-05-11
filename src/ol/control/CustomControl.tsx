import { FC, MouseEvent, Dispatch, SetStateAction } from "react";

type Props = {
  id?: number
  text: string
  activeControl?: number
  setActiveControl: Dispatch<SetStateAction<number>>
}

const CustomControlButton: FC<Props> = (props) => {

  function onChangeHandler(e: any) {
    console.log('on change:', e);
  }

  function onClickHandler(e: MouseEvent<HTMLButtonElement>) {
    props.setActiveControl(parseInt(e.currentTarget.dataset.id as string))
  }

  return (
    <button data-id={props.id} onChange={onChangeHandler} onClick={onClickHandler}>
      {props.text}
      {props.activeControl == props.id && '00'}
    </button>
  );
};

export default CustomControlButton;