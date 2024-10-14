'use client';
import { getArchivedRoadmaps } from '@src/apiServices/archivedService';
import ArchivedCell from '@src/shared/components/ArchivedCell';
import SearchBox from '@src/shared/components/SearchBox';
import { Loader } from '@src/shared/components/UIElements';
import { TRoadmapCategories } from '@src/shared/types/accountTypes';
import { TRoadmap } from '@src/shared/types/contentRepository';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const ArchivedRoadmaps = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [roadmapsList, setRoadmapslist] = useState<TRoadmapCategories[]>([]);
  useEffect(() => {
    getArchivedRoadmaps().then((res) => {
      console.log(res.data.categories);
      setRoadmapslist(res.data.categories);
    });
  }, []);
  return (
    <div className="max-w-xl px-4 pb-12 lg:col-span-8">
      <h1 className="text-lg leading-6 font-medium text-gray-900">
        Archived Roadmaps
      </h1>
      <p className="text-gray-500 text-sm mb-6">
        Following roadmaps have been archived.
      </p>
      <SearchBox value={searchValue} setValue={setSearchValue} />
      <div className="flex">
        <InfiniteScroll
          dataLength={roadmapsList.length} //This is important field to render the next data
          next={() => {
            console.log('dsasa');
          }}
          hasMore={true}
          loader={<Loader />}
        >
          {roadmapsList.map((item) => (
            <ArchivedCell
              key={item.id}
              title={item.name}
              subtitle={item.roadmaps[0].description}
              deactivatedBy="Aasish Dhawan"
              deactivationDate={'dewq'}
              onClickDelete={() => console.log(item.id)}
              onClickRestore={() => console.log(item)}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default ArchivedRoadmaps;
