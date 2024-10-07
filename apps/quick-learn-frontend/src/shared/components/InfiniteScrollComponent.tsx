import React, { FC, ReactNode } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

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
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {items}
    </InfiniteScroll>
  );
};

export default InfiniteScrollComponent;
