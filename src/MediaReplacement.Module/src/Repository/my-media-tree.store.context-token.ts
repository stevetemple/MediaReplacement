import type MyMediaTreeStore from './my-media-tree.store';
import { UmbContextToken } from '@umbraco-cms/backoffice/context-api';

export const MY_MEDIA_TREE_STORE_CONTEXT = new UmbContextToken<MyMediaTreeStore>('MyMediaTreeStore');