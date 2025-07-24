import { css, customElement, html, nothing, property, repeat, state, when } from '@umbraco-cms/backoffice/external/lit';
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import type { UmbMediaTreeItemModel} from '@umbraco-cms/backoffice/media';
import { UmbMediaTreeRepository } from '@umbraco-cms/backoffice/media';

@customElement('umb-media-folder-thumbnails')
export class MediaFolderThumbnailsElement extends UmbLitElement {
    #mediaTreeRepository = new UmbMediaTreeRepository(this);

	/**
	 * The parent media item to get thumbnails for
	 */
	@property()
	folder : UmbMediaTreeItemModel | undefined;

    @property()
    datatype? : {unique : string}

    @property()
    children : any;

	/**
	 * The fallback icon for the thumbnail.
	 */
	@property()
	icon = 'icon-picture';

	/**
	 * The `loading` state of the thumbnail.
	 * @enum {'lazy' | 'eager'}
	 * @default 'lazy'
	 */
	@property()
	loading: (typeof HTMLImageElement)['prototype']['loading'] = 'lazy';

	@state()
	private _isLoading = true;

	#intersectionObserver?: IntersectionObserver;

	override render() {
		return html` ${this.#renderThumbnails()} ${when(this._isLoading, () => this.#renderLoading())} `;
	}

	override connectedCallback() {
		super.connectedCallback();

		if (this.loading === 'lazy') {
			this.#intersectionObserver = new IntersectionObserver((entries) => {
				if (entries[0].isIntersecting) {
					this.#loadChildren();
					this.#intersectionObserver?.disconnect();
				}
			});
			this.#intersectionObserver.observe(this);
		} else {
			this.#loadChildren();
		}
	}

	override disconnectedCallback() {
		super.disconnectedCallback();
		this.#intersectionObserver?.disconnect();
	}

	#renderLoading() {
		return html`<div id="loader"><uui-loader></uui-loader></div>`;
	}

	#renderThumbnails() {
		if (this._isLoading) return nothing;

        return html`<div class="thumbnails">${repeat(this.children, (item) => html`${this.#renderThumbnail(item)}`)}</div>`;
	}

    #renderThumbnail(item : any) { 
        return html`<umb-imaging-thumbnail class="tinyThumb"
					unique=${item.unique}
					alt=${item.name}
					icon=${item.mediaType.icon}
					height="30"
					width="30">
				</umb-imaging-thumbnail>`;
    }


    async #loadChildren() {

        const skip = 0;
        const take = 10;

        if(this.folder == undefined) 
        {
            return;
        }

		const { data } = await this.#mediaTreeRepository.requestTreeItemsOf({
			parent: {
				unique: this.folder?.unique,
				entityType: this.folder?.entityType,
			},
            foldersOnly: true,
            skip: skip,
            take: take
		});
        
		this.children = data?.items ?? [];
        this._isLoading = false;
	}

	static override styles = [
		UmbTextStyles,
		css`
			:host {
				display: block;
				position: relative;
				overflow: hidden;
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100%;
				height: 100%;
			}

			#loader {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 100%;
				width: 100%;
			}

			#figure {
				display: block;
				width: 100%;
				height: 100%;
				object-fit: cover;

				background-image: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill-opacity=".1"><path d="M50 0h50v50H50zM0 50h50v50H0z"/></svg>');
				background-size: 10px 10px;
				background-repeat: repeat;
			}

			#icon {
				width: 100%;
				height: 100%;
				font-size: var(--uui-size-8);
			}
			
			.thumbnails {
				flex-wrap:wrap;
				display:flex;
				width:100%;
				height:100%;
				margin:0;
				vertical-align:top;
				padding:2px;
			}

			.tinyThumb {
				width:30px;
				height:30px;
				margin: 8px 0 0 8px;
			}
		`,
	];
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-media-folder-thumbnails': MediaFolderThumbnailsElement;
	}
}

