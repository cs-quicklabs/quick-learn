import React, { FC, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader } from './UIElements';

interface Props {
  items: ReactNode[];
  fetchData: () => void;
}

const InfiniteScrollComponent: FC<Props> = ({ items, fetchData }) => {
  return (
    <InfiniteScroll
      dataLength={items.length} //This is important field to render the next data
      next={fetchData}
      hasMore={true}
      loader={<Loader />}
    >
      {items}
    </InfiniteScroll>
  );
};

export default InfiniteScrollComponent;
