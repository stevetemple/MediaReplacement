import { umbExtensionsRegistry as e } from "@umbraco-cms/backoffice/extension-registry";
import { ContentMediaRespository } from "./ContentMedia/content-media-repository.js";
import { MediaFolderThumbnailsElement } from './media-folder-thumbnails.element'; 

e.unregister("Umb.Modal.MediaPicker");
const o = [
  {
    name: "Media Picker Modal",
    alias: "Umb.Modal.MediaPicker",
    type: "modal",
    js: () => import('./media-picker-replacement.js') 
  },
  {
    type: 'repository',
    alias: 'ContentMediaRepository',
    name: 'Content Media Repository',
    api: ContentMediaRespository
  }
], a = [
  ...o
];
export {
  a as manifests
};