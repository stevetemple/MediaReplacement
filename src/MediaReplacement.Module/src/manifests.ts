const o = [
  {
    name: "Media Picker Modal",
    alias: "Umb.Modal.ReplacementMediaPicker",
    type: "modal",
    overwrites: "Umb.Modal.MediaPicker",
    js: () => import('./media-picker-replacement.js') 
  },
], a = [
  ...o
];
export {
  a as manifests
};