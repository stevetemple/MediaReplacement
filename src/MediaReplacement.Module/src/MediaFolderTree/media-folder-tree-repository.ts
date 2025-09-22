import { type UmbControllerHost } from "@umbraco-cms/backoffice/controller-api";
import { MediaFolderTreeDataSource, } from "./media-folder-tree.server.data-source.js";
import { UmbTreeRepositoryBase } from "@umbraco-cms/backoffice/tree";
import { UMB_MEDIA_ROOT_ENTITY_TYPE, UMB_MEDIA_TREE_STORE_CONTEXT, type UmbMediaTreeChildrenOfRequestArgs, type UmbMediaTreeItemModel, type UmbMediaTreeRootItemsRequestArgs, type UmbMediaTreeRootModel } from "@umbraco-cms/backoffice/media";
import type { UmbApi } from "@umbraco-cms/backoffice/extension-api";

export class MediaFolderTreeRespository extends UmbTreeRepositoryBase<
		UmbMediaTreeItemModel,
		UmbMediaTreeRootModel,
		UmbMediaTreeRootItemsRequestArgs,
		UmbMediaTreeChildrenOfRequestArgs>
	implements UmbApi {

    constructor(host: UmbControllerHost) {
	    super(host, MediaFolderTreeDataSource, UMB_MEDIA_TREE_STORE_CONTEXT);
    }
    
    async requestTreeRoot() {
        const { data: treeRootData } = await this._treeSource.getRootItems({ skip: 0, take: 1 });
        const hasChildren = treeRootData ? treeRootData.total > 0 : false;

        const data: UmbMediaTreeRootModel = {
            unique: null,
            entityType: UMB_MEDIA_ROOT_ENTITY_TYPE,
            name: '#treeHeaders_media',
            hasChildren,
            isFolder: true,
        };

        return { data };
    }
}

