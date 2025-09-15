import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'episodes/:collectionId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return the collectionId values you want to prerender
      // Replace with your actual collection IDs
      return [
        { collectionId: '124043755' },
        // Add more as needed
      ];
    }
  },
  {
    path: 'snipdefine/:trackId',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      // Return the trackId values you want to prerender
      return [
        { trackId: '1000725376358' },
        // Add more as needed
      ];
    }
  },
  {
    path: 'snips',
    renderMode: RenderMode.Prerender
  }
];
