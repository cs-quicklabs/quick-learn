import { TContentRepositoryMetadata } from '@src/shared/types/contentRepository';

export interface MetadataState {
  metadata: {
    contentRepository: TContentRepositoryMetadata;
  };
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface UIState {
  hideNavbar: boolean;
}
