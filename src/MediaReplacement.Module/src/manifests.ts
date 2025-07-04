
import { umbExtensionsRegistry as e } from "@umbraco-cms/backoffice/extension-registry";
import MyMediaTreeRepository from './Repository/my-media-tree-repository.js';
import MyMediaTreeStore from './Repository/my-media-tree.store.js';
import { ContentMediaRespository } from "./ContentMedia/content-media-repository.js";

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
    alias: 'My.Media.Tree.Repository',
    name: 'My Media Tree Repository',
    api: MyMediaTreeRepository
  },
  {
    type: 'treeStore',
    alias: 'My.Media.Tree.Store',
    name: 'My Media Tree Store',
    api: MyMediaTreeStore
  },
  {
    type: 'repository',
    alias: 'ContentMediaRepository',
    name: 'Content Media Repository',
    api: ContentMediaRespository
  },
  {
    type: 'element',
    alias: 'Media.Folder.Thumbnails',
    name: "Media folder thumbnails element",
    js: () => import('./media-folder-thumbnails.element.js')
  }
], a = [
  ...o
];
export {
  a as manifests
};