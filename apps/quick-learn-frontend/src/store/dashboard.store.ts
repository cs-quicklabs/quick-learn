import { TContentRepositoryMetadata } from '@src/shared/types/contentRepository';
import { create } from 'zustand';

type State = {
  metadata: {
    contentRepository: TContentRepositoryMetadata;
  };
};

const initialState: State = {
  metadata: {
    contentRepository: {
      roadmap_categories: [],
      course_categories: [],
    },
  },
};

type Actions = {
  setContentRepositoryMetadata: (
    metadata: State['metadata']['contentRepository'],
  ) => void;
};

const useDashboardStore = create<State & Actions>((set) => ({
  metadata: initialState.metadata,
  setContentRepositoryMetadata: (
    metadata: State['metadata']['contentRepository'],
  ) =>
    set((state) => ({
      metadata: {
        ...state.metadata,
        contentRepository: {
          ...state.metadata.contentRepository,
          ...metadata,
        },
      },
    })),
}));

export default useDashboardStore;
