
import { umbExtensionsRegistry as e } from "@umbraco-cms/backoffice/extension-registry";

e.unregister("Umb.Modal.MediaPicker");
const o = [
  {
    name: "Media Picker Modal",
    alias: "Umb.Modal.MediaPicker",
    type: "modal",
    js: () => import('./media-picker-replacement.js') 
  }
], a = [
  ...o
];
export {
  a as manifests
};