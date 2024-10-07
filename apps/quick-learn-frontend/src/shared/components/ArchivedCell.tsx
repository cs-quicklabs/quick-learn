import React, { FC } from 'react';

interface Props {
  title: string;
  subtitle: string;
  deactivationDate: string;
  onClickRestore: () => void;
  onClickDelete: () => void;
}

const ArchivedCell: FC<Props> = () => {
  return <div>ArchivedCell</div>;
};

export default ArchivedCell;
