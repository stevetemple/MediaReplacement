import { umbExtensionsRegistry as e } from "@umbraco-cms/backoffice/extension-registry";
import { ContentMediaRespository } from "./ContentMedia/content-media-repository.js";
import { MediaFolderTreeRespository } from "./MediaFolderTree/media-folder-tree-repository.js";
import { MediaFolderTreeDataSource } from "./MediaFolderTree/media-folder-tree.server.data-source.js";
import { UmbMediaFolderTreeContext } from "./MediaFolderTree/media-folder-tree-context.js";

export * from './media-folder-thumbnails.element.js'

export const MEDIA_FOLDER_TREE_REPOSITORY_ALIAS = 'Media.Folder.Tree.Repository';
export const MEDIA_FOLDER_TREE_STORE_ALIAS = 'Media.Folder.Tree.Store';
export const MEDIA_FOLDER_TREE_ALIAS = 'Media.Folder.Tree';

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
  },
  {
    type: 'repository',
    alias: MEDIA_FOLDER_TREE_REPOSITORY_ALIAS,
    name: 'Media Folder Repository',
    api: MediaFolderTreeRespository
  },
  {
    type: 'treeStore',
    alias: MEDIA_FOLDER_TREE_STORE_ALIAS,
    name: 'Time tree Store',
    api: MediaFolderTreeDataSource
  },
  {
    type: 'tree',
    alias: MEDIA_FOLDER_TREE_ALIAS,
    name: 'Media Folder tree',
    meta: {
        repositoryAlias: MEDIA_FOLDER_TREE_REPOSITORY_ALIAS
    },
    api: UmbMediaFolderTreeContext
  }
], a = [
  ...o
];
export {
  a as manifests
};