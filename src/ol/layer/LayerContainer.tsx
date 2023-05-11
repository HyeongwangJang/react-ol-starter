import { FC, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const LayerContainer: FC<Props> = ({ children }) => {
  return <div>{children}</div>;
};

export default LayerContainer;
