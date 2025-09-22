import { UMB_PROPERTY_TYPE_BASED_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/content';
import { UmbDefaultTreeContext } from '@umbraco-cms/backoffice/tree';
import type { UmbControllerHost } from '@umbraco-cms/backoffice/controller-api';
import type { UmbMediaTreeItemModel, UmbMediaTreeRootItemsRequestArgs, UmbMediaTreeRootModel } from '@umbraco-cms/backoffice/media';

export class UmbMediaFolderTreeContext extends UmbDefaultTreeContext<
	UmbMediaTreeItemModel,
	UmbMediaTreeRootModel,
	UmbMediaTreeRootItemsRequestArgs> {
        
	constructor(host: UmbControllerHost) {
		super(host);

		this.consumeContext(UMB_PROPERTY_TYPE_BASED_PROPERTY_CONTEXT, (context) => {
			this.observe(context?.dataType, (value) => {
				this.updateAdditionalRequestArgs({ dataType: value });
			});
		});
	}
}