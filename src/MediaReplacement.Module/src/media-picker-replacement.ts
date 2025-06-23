import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';
import { UMB_MEDIA_TREE_ALIAS } from '@umbraco-cms/backoffice/media';
import type { UmbDropzoneChangeEvent, UmbUploadableItem } from '@umbraco-cms/backoffice/dropzone';
import type { UUIInputEvent, UUIPaginationEvent } from '@umbraco-cms/backoffice/external/uui';
import { UmbMediaItemRepository, UMB_MEDIA_ROOT_ENTITY_TYPE, UmbMediaSearchProvider } from '@umbraco-cms/backoffice/media';

import type { UmbMediaPickerFolderPathElement, UmbMediaPickerModalData, UmbMediaPickerModalValue  } from '../node_modules/@umbraco-cms/backoffice/dist-cms/packages/media/media/modals';

import type { UmbMediaTreeItemModel, UmbMediaSearchItemModel, UmbMediaItemModel, UmbMediaPathModel, UmbDropzoneMediaElement } from '@umbraco-cms/backoffice/media';
import {
  	html,
	css,
	customElement,
	state,
	query,
	type PropertyValues,
	nothing,
	ifDefined,
	repeat
} from '@umbraco-cms/backoffice/external/lit';
import type { UmbEntityModel } from '@umbraco-cms/backoffice/entity';
import { debounce, UmbPaginationManager } from '@umbraco-cms/backoffice/utils';
import { isUmbracoFolder } from '@umbraco-cms/backoffice/media-type';
import MyMediaTreeRepository from './Repository/my-media-tree-repository';
import { UMB_CONTENT_PROPERTY_CONTEXT } from '@umbraco-cms/backoffice/content';
import { UMB_VARIANT_CONTEXT } from '@umbraco-cms/backoffice/variant';

const root: UmbMediaPathModel = { name: 'Media', unique: null, entityType: UMB_MEDIA_ROOT_ENTITY_TYPE };

@customElement('umb-media-picker-replacement-modal')
export class UmbMediaPickerReplacementModalElement extends UmbModalBaseElement<UmbMediaPickerModalData, UmbMediaPickerModalValue> {
	#mediaTreeRepository = new MyMediaTreeRepository(this);
	#mediaItemRepository = new UmbMediaItemRepository(this);
	#mediaSearchProvider = new UmbMediaSearchProvider(this);

	#dataType?: { unique: string };
	#contextCulture?: string | null;

	@state()
	private _selectableFilter: (item: UmbMediaTreeItemModel | UmbMediaSearchItemModel) => boolean = () => true;

	@state()
	private _activeTabId?: string | null | undefined;

	@state()
	private _currentChildren: Array<UmbMediaTreeItemModel> = [];

	@state()
	private _currentPage = 1;

	@state()
	private _currentTotalPages = 0;

	@state()
	private _searchResult: Array<UmbMediaSearchItemModel> = [];

	@state()
	private _searchFrom: UmbEntityModel | undefined;

	@state()
	private _searchQuery = '';
	
	@state()
	private _isSelectionMode = false;

	@state()
	private _currentMediaEntity: UmbMediaPathModel = root;
	
	@state()
	private _startNode: UmbMediaItemModel | undefined;

	@query('#dropzone')
	private _dropzone!: UmbDropzoneMediaElement;

	@query('#mediaTree')
	private _mediaTree! : any;
	
	@state()
	_searching: boolean = false;

	#pagingMap = new Map<string, UmbPaginationManager>();

	constructor() {
		super();
		this.consumeContext(UMB_CONTENT_PROPERTY_CONTEXT , (context) => {
			this.observe(context?.dataType, (dataType) => {
				this.#dataType = dataType;
				
			});
		});

		this.consumeContext(UMB_VARIANT_CONTEXT, (context) => {
			this.observe(context?.culture, (culture) => {
				this.#contextCulture = culture;
			});
		});
	}

	protected override async firstUpdated(_changedProperties: PropertyValues): Promise<void> {
		super.firstUpdated(_changedProperties);

		const startNode = this.data?.startNode;

		this.#setTab("upload");

		if (startNode) {
			const { data } = await this.#mediaItemRepository.requestItems([startNode.unique]);
			this._startNode = data?.[0];

			if (this._startNode) {
				this._currentMediaEntity = {
					name: this._startNode.name,
					unique: this._startNode.unique,
					entityType: this._startNode.entityType,
				};

				this._searchFrom = { unique: this._startNode.unique, entityType: this._startNode.entityType };
			}
		}

		this.#loadChildrenOfCurrentMediaItem();
	}

	async #loadChildrenOfCurrentMediaItem(selectedItems?: Array<UmbUploadableItem>) {
		const key = this._currentMediaEntity.entityType + this._currentMediaEntity.unique;
		let paginationManager = this.#pagingMap.get(key);

		if (!paginationManager) {
			paginationManager = new UmbPaginationManager();
			paginationManager.setPageSize(100);
			this.#pagingMap.set(key, paginationManager);
		}

		const skip = paginationManager.getSkip();
		const take = paginationManager.getPageSize();

		const { data } = await this.#mediaTreeRepository.requestTreeItemsOf({
			parent: {
				unique: this._currentMediaEntity.unique,
				entityType: this._currentMediaEntity.entityType,
			},
			dataType: this.#dataType,
			skip,
			take,
		});
		console.log(data);

		this._currentChildren = data?.items ?? [];
		paginationManager.setTotalItems(data?.total ?? 0);
		this._currentPage = paginationManager.getCurrentPageNumber();
		this._currentTotalPages = paginationManager.getTotalPages();

		if (selectedItems?.length) {
			const selectedItem = this._currentChildren.find((x) => x.unique == selectedItems[0].unique);
			if (selectedItem) {
				this.#onSelected(selectedItem);
			}
		}
	}

	#onDropzoneChange(evt: UmbDropzoneChangeEvent) {
		const target = evt.target as UmbDropzoneMediaElement;
		this.#loadChildrenOfCurrentMediaItem(target.value);
	}

	#onOpen(item: UmbMediaTreeItemModel | UmbMediaSearchItemModel) {
		this.#clearSearch();

		this._currentMediaEntity = {
			name: item.name,
			unique: item.unique,
			entityType: UMB_MEDIA_ROOT_ENTITY_TYPE,
		};

		// If the user has navigated into an item, we default to search only within that item.
		this._searchFrom = this._currentMediaEntity.unique
			? { unique: this._currentMediaEntity.unique, entityType: this._currentMediaEntity.entityType }
			: undefined;

		this.#loadChildrenOfCurrentMediaItem();
	}

	#onSelected(item: UmbMediaTreeItemModel | UmbMediaSearchItemModel) {
		const selection = this.data?.multiple ? [...this.value.selection, item.unique!] : [item.unique!];
		this._isSelectionMode = selection.length > 0;
		this.modalContext?.setValue({ selection });
	}

	#onDeselected(item: UmbMediaTreeItemModel | UmbMediaSearchItemModel) {
		const selection = this.value.selection.filter((value) => value !== item.unique);
		this._isSelectionMode = selection.length > 0;
		this.modalContext?.setValue({ selection });
	}

	#clearSearch() {
		this._searchQuery = '';
		this._searchResult = [];
	}

	async #searchMedia() {
		if (!this._searchQuery) {
			this.#clearSearch();
			this._searching = false;
			return;
		}

		const query = this._searchQuery;
		const { data } = await this.#mediaSearchProvider.search({
			query,
			searchFrom: this._searchFrom,
			culture: this.#contextCulture,
			...this.data?.search?.queryParams,
		});

		if (!data) {
			// No search results.
			this._searchResult = [];
			this._searching = false;
			return;
		}

		// Map urls for search results as we are going to show for all folders (as long they aren't trashed).
		this._searchResult = data.items;
		this._searching = false;
	}

	#debouncedSearch = debounce(() => {
		this.#searchMedia();
	}, 500);

	#onSearch(e: UUIInputEvent) {
		this._searchQuery = (e.target.value as string).toLocaleLowerCase();
		this._searching = true;
		this.#debouncedSearch();
	}
	
	#onPathChange(e: CustomEvent) {
		const newPath = e.target as UmbMediaPickerFolderPathElement;

		if (newPath.currentMedia) {
			this._currentMediaEntity = newPath.currentMedia;
		} else if (this._startNode) {
			this._currentMediaEntity = {
				name: this._startNode.name,
				unique: this._startNode.unique,
				entityType: this._startNode.entityType,
			};
		} else {
			this._currentMediaEntity = root;
		}

		if (this._currentMediaEntity.unique) {
			this._searchFrom = { unique: this._currentMediaEntity.unique, entityType: this._currentMediaEntity.entityType };
		} else {
			this._searchFrom = undefined;
		}

		this.#loadChildrenOfCurrentMediaItem();
	}


	#onPageChange(event: UUIPaginationEvent) {
		event.stopPropagation();
		const key = this._currentMediaEntity.entityType + this._currentMediaEntity.unique;

		const paginationManager = this.#pagingMap.get(key);

		if (!paginationManager) {
			throw new Error('Pagination manager not found');
		}

		paginationManager.setCurrentPageNumber(event.target.current);
		this.#pagingMap.set(key, paginationManager);

		this.#loadChildrenOfCurrentMediaItem();
	}

	#allowNavigateToMedia(item: UmbMediaTreeItemModel | UmbMediaSearchItemModel): boolean {
		return isUmbracoFolder(item.mediaType.unique) || item.hasChildren;
	}

	#onSearchFromChange(e: CustomEvent) {
		const checked = (e.target as HTMLInputElement).checked;

		if (checked) {
			this._searchFrom = { unique: this._currentMediaEntity.unique, entityType: this._currentMediaEntity.entityType };
		} else {
			this._searchFrom = undefined;
		}
	}

	#onSaveInMediaLibraryChange(e: CustomEvent) { 
		const checked = (e.target as HTMLInputElement).checked;
		if(checked) {
			this._mediaTree.style.display = "";
		} else {
			this._mediaTree.style.display = "none";	
		}
	}

  	override render() {
		return html`
			<umb-body-layout headline=${this.localize.term('defaultdialogs_chooseMedia')}>
				${this.#renderBody()} ${this.#renderBreadcrumb()}
				<div slot="actions">
					<uui-button label=${this.localize.term('general_close')} @click=${this._rejectModal}></uui-button>
					<uui-button
						label=${this.localize.term('general_choose')}
						look="primary"
						color="positive"
						@click=${this._submitModal}></uui-button>
				</div>
				
			</umb-body-layout>
		`;
	}

  	#renderBody() {
		return html`
			<uui-box>
				<uui-tab-group slot="header">
					<uui-tab .active=${this._activeTabId === "upload"} @click=${() => this.#setTab("upload")}>
						Upload new
					</uui-tab>
					<uui-tab .active=${this._activeTabId === "medialibrary"} @click=${() => this.#setTab("medialibrary")}>
						Media library
					</uui-tab>
					<uui-tab .active=${this._activeTabId === "content"} @click=${() => this.#setTab("content")}>
						Find by content
					</uui-tab>
				</uui-tab-group>
				${this._activeTabId === "upload"
					? html`${this.#renderUploadTab()}`
					: nothing}
				${this._activeTabId === "medialibrary" 
					? html`${this.#renderExistingTab()}`
					: nothing}
				${this._activeTabId === "content" 
					? html`${this.#renderContentTab()}`
					: nothing}
			</uui-box>
		`;
	}

	#renderUploadTab() {
		return html`
			<div class="dropzone" @click=${() => this._dropzone.browse()}>
				<uui-symbol-file-dropzone></uui-symbol-file-dropzone>
				<umb-dropzone-media
					id="dropzone"
					multiple
					@change=${this.#onDropzoneChange}
					.parentUnique=${this._currentMediaEntity.unique}>
				</umb-dropzone-media>
				<uui-button
					@click=${() => this._dropzone.browse()}
					id="clickToUploadButton">
					Click to upload
				</uui-button>
			</div>
				

			<div style="padding-top:10px;padding-bottom:10px">
				<uui-checkbox label="Save in media library for reuse"
					id="saveinmedialibrary"
					@change=${this.#onSaveInMediaLibraryChange}>
					Save in media library for reuse
				</uui-checkbox>
			</div>

			<div id="mediaTree" style="display:none" style="border:1px solid lightgrey">
				<umb-tree .alias="${UMB_MEDIA_TREE_ALIAS}"></umb-tree>
			</div>
		`;
	}

	#renderExistingTab() {
		return html`${this.#renderToolbar()} 
			${this._searchQuery ? this.#renderSearchResult() : this.#renderCurrentChildren()}`;

	}

	#renderContentTab() {
		return html`<umb-tree alias="Umb.Tree.Document"></umb-tree>`
	}

	#renderSearchResult() {
		return html`
			${!this._searchResult.length && !this._searching
				? html`<div class="container"><p>${this.localize.term('content_listViewNoItems')}</p></div>`
				: html`<div id="media-grid">
						${repeat(
							this._searchResult,
							(item) => item.unique,
							(item) => this.#renderCard(item),
						)}
					</div>`}
		`;
	}

	#renderCurrentChildren() {
		return html`
			${!this._currentChildren.length
				? html`<div class="container"><p>${this.localize.term('content_listViewNoItems')}</p></div>`
				: html`<div id="media-grid">
							${repeat(
								this._currentChildren,
								(item) => item.unique,
								(item) => this.#renderCard(item),
							)}
						</div>
						${this._currentTotalPages > 1
							? html`<uui-pagination
										.current=${this._currentPage}
										.total=${this._currentTotalPages}
										firstlabel=${this.localize.term('general_first')}
										previouslabel=${this.localize.term('general_previous')}
										nextlabel=${this.localize.term('general_next')}
										lastlabel=${this.localize.term('general_last')}
										@change=${this.#onPageChange}>
									</uui-pagination>`
							: nothing}`}
		`;
	}

	#renderToolbar() {
		/**<umb-media-picker-create-item .node=${this._currentMediaEntity.unique}></umb-media-picker-create-item>
		 * We cannot route to a workspace without the media picker modal is a routeable. Using regular upload button for now... */
		return html`
			<div id="toolbar">
				<div id="search">
					<uui-input
						label=${this.localize.term('general_search')}
						placeholder=${this.localize.term('placeholders_search')}
						@input=${this.#onSearch}
						value=${this._searchQuery}>
						<div slot="prepend">
							${this._searching
								? html`<uui-loader-circle id="searching-indicator"></uui-loader-circle>`
								: html`&nbsp;<uui-icon name="search"></uui-icon>`}
						</div>
					</uui-input>

					${this._currentMediaEntity.unique && this._currentMediaEntity.unique !== this._startNode?.unique
						? html`<uui-checkbox
								?checked=${this._searchFrom?.unique === this._currentMediaEntity.unique}
								@change=${this.#onSearchFromChange}
								label="Search only in ${this._currentMediaEntity.name}"></uui-checkbox>`
						: nothing}
				</div>
			</div>
		`;
	}

	#renderCard(item: UmbMediaTreeItemModel | UmbMediaSearchItemModel) {
		const canNavigate = this.#allowNavigateToMedia(item);
		const selectable = this._selectableFilter(item);
		const disabled = !(selectable || canNavigate);
		console.log(item.unique)
		return html`
			<uui-card-media
				class=${ifDefined(disabled ? 'not-allowed' : undefined)}
				.name=${item.name}
				data-mark="${item.entityType}:${item.unique}"
				@open=${() => this.#onOpen(item)}
				@selected=${() => this.#onSelected(item)}
				@deselected=${() => this.#onDeselected(item)}
				?selected=${this.value?.selection?.find((value) => value === item.unique)}
				?selectable=${selectable}
				?select-only=${this._isSelectionMode || canNavigate === false}>
				${item.hasChildren ? html`<umb-media-folder-thumbnails
					.folder=${item}
					.datatype=${this.#dataType}
				>`: nothing}
				</umb-media-folder-thumbnails>
				${!item.hasChildren ? html`<umb-imaging-thumbnail
					unique=${item.unique}
					alt=${item.name}
					icon=${item.mediaType.icon}>
				</umb-imaging-thumbnail>` : nothing}
			</uui-card-media>
		`;
	}

	#renderBreadcrumb() {
		// hide the breadcrumb when doing a global search within another item
		// We do this to avoid confusion that the current search result is within the item shown in the breadcrumb.
		if (this._searchQuery && this._currentMediaEntity.unique && !this._searchFrom) {
			return nothing;
		}

		const startNode: UmbMediaPathModel | undefined = this._startNode
			? {
					entityType: this._startNode.entityType,
					unique: this._startNode.unique,
					name: this._startNode.name,
				}
			: undefined;

		return html`
			<umb-media-picker-folder-path
				slot="footer-info"
				.currentMedia=${this._currentMediaEntity}
				.startNode=${startNode}
				@change=${this.#onPathChange}>
			</umb-media-picker-folder-path>
		`;
	}



	#setTab(tabId: string | null | undefined) {
		this._activeTabId = tabId;
	}


	static override styles = [
		css`
			#toolbar {
				display: flex;
				gap: var(--uui-size-6);
				align-items: flex-start;
				margin-bottom: var(--uui-size-3);
			}
			#search {
				flex: 1;
			}

			#search uui-input {
				width: 100%;
				margin-bottom: var(--uui-size-3);
			}
			#search uui-input [slot='prepend'] {
				display: flex;
				align-items: center;
			}

			#searching-indicator {
				margin-left: 7px;
				margin-top: 4px;
			}

			#media-grid {
				display: grid;
				gap: var(--uui-size-space-5);
				grid-template-columns: repeat(auto-fill, minmax(var(--umb-card-medium-min-width), 1fr));
				grid-auto-rows: var(--umb-card-medium-min-width);
				padding-bottom: 5px; /** The modal is a bit jumpy due to the img card focus/hover border. This fixes the issue. */
			}

			umb-icon {
				font-size: var(--uui-size-8);
			}

			img {
				background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".1"><path d="M50 0h50v50H50zM0 50h50v50H0z"/></svg>');
				background-size: 10px 10px;
				background-repeat: repeat;
			}

			#actions {
				max-width: 100%;
			}

			.not-allowed {
				cursor: not-allowed;
				opacity: 0.5;
			}

			uui-pagination {
				display: block;
				margin-top: var(--uui-size-layout-1);
			}

			.dropzone {
				padding:20px;
				border: 1px solid lightgray;
				margin-bottom: 10px;
				cursor: pointer;
			}

			#clickToUploadButton {
				color: lightgrey;
				margin-left:270px;
			}
		`,
	];
}


export default UmbMediaPickerReplacementModalElement;