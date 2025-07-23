import {
	html,
	customElement,
	nothing,
} from '@umbraco-cms/backoffice/external/lit';
import { UmbModalBaseElement } from '@umbraco-cms/backoffice/modal';

@customElement('umb-media-picker-replacement-modal')
export class UmbMediaPickerReplacementModalElement extends UmbModalBaseElement {

	_activeTabId : string = "upload";

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
					<uui-tab .active=${this._activeTabId === "upload"} @click=${() => this.#setTab("upload")}>
						Upload new
					</uui-tab>
					<uui-tab .active=${this._activeTabId === "existing"} @click=${() => this.#setTab("existing")}>
						Select existing
					</uui-tab>
				</uui-tab-group>
				${this._activeTabId === "upload"
					? html`${this.#renderUploadTab()}`
					: nothing
				}
				${this._activeTabId === "existing"
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