import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const ControlContainer: FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default ControlContainer;
