import type { MyMediaEntityType, MyMediaRootEntityType } from './entity.js';
import type { UmbReferenceByUnique } from '@umbraco-cms/backoffice/models';
import type {
	UmbTreeChildrenOfRequestArgs,
	UmbTreeItemModel,
	UmbTreeRootItemsRequestArgs,
	UmbTreeRootModel,
} from '@umbraco-cms/backoffice/tree';

export interface MyMediaTreeItemModel extends UmbTreeItemModel {
	entityType: MyMediaEntityType;
	noAccess: boolean;
	isTrashed: boolean;
	mediaType: {
		unique: string;
		icon: string;
		collection: UmbReferenceByUnique | null;
	};
	variants: Array<MyMediaTreeItemVariantModel>;
	createDate: string;
}

export interface MyMediaTreeRootModel extends UmbTreeRootModel {
	entityType: MyMediaRootEntityType;
}

export interface MyMediaTreeItemVariantModel {
	name: string;
	culture: string | null;
}

export interface MyMediaTreeRootItemsRequestArgs extends UmbTreeRootItemsRequestArgs {
	dataType?: {
		unique: string;
	};
}

export interface MyMediaTreeChildrenOfRequestArgs extends UmbTreeChildrenOfRequestArgs {
	dataType?: {
		unique: string;
	};
}