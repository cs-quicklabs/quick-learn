import { create } from 'zustand';
import { TContentRepositoryMetadata } from '@src/shared/types/contentRepository';

type State = {
  metadata: {
    contentRepository: TContentRepositoryMetadata;
  };
  hideNavbar: boolean;
};

const initialState: State = {
  metadata: {
    contentRepository: {
      roadmap_categories: [],
      course_categories: [],
    },
  },
  hideNavbar: false,
};

type Actions = {
  setContentRepositoryMetadata: (
    metadata: State['metadata']['contentRepository'],
  ) => void;
  setHideNavbar: (hideNavbar: State['hideNavbar']) => void;
};

const useDashboardStore = create<State & Actions>((set) => ({
  metadata: initialState.metadata,
  hideNavbar: initialState.hideNavbar,
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
  setHideNavbar: (hideNavbar: State['hideNavbar']) =>
    set((state) => ({
      ...state,
      hideNavbar,
    })),
}));

export default useDashboardStore;
