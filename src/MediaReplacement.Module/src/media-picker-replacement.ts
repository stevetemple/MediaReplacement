import {
	html,
	customElement,
	nothing,
	state,
} from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';

@customElement('umb-media-picker-replacement-modal')
export class UmbMediaPickerReplacementModalElement extends UmbModalBaseElement {
	
	#uploadTabId : string = "upload";
	#existingTabId : string = "existing";

	@state()
	private _activeTabId?: string = "upload";

	public override render() {
		return html`
			<umb-body-layout headline=${this.localize.term('defaultdialogs_chooseMedia')}>
				${this.#renderBody()}
			</umb-body-layout>
		`;
	}

	#renderBody() {
		return html`
			<uui-box>
				<uui-tab-group slot="header">
					<uui-tab .active=${this._activeTabId === this.#uploadTabId} @click=${() => this.#setTab(this.#uploadTabId)}>
						Upload new
					</uui-tab>
					<uui-tab .active=${this._activeTabId === this.#existingTabId} @click=${() => this.#setTab(this.#existingTabId)}>
						Select existing
					</uui-tab>
				</uui-tab-group>
				${this._activeTabId === this.#uploadTabId
					? html`${this.#renderUploadTab()}`
					: nothing
				}
				${this._activeTabId === this.#existingTabId
					? html`${this.#renderExistingTab()}`
					: nothing
				}
			</uui-box>
		`;
	}

	#renderUploadTab() {
		return html`Upload tab`;
	}

	#renderExistingTab() {
		return html`Existing tab`
	}

	#setTab(tabName : string) {
		this._activeTabId = tabName;
	}
}

export default UmbMediaPickerReplacementModalElement;