export const MY_MEDIA_ENTITY_TYPE = 'media';
export const MY_MEDIA_ROOT_ENTITY_TYPE = 'media-root';
export const MY_MEDIA_PLACEHOLDER_ENTITY_TYPE = 'umb-media-placeholder';

export type MyMediaEntityType = typeof MY_MEDIA_ENTITY_TYPE;
export type MyMediaRootEntityType = typeof MY_MEDIA_ROOT_ENTITY_TYPE;

export type MyMediaPlaceholderEntityType = typeof MY_MEDIA_PLACEHOLDER_ENTITY_TYPE;

export type MyMediaEntityTypeUnion = MyMediaEntityType | MyMediaRootEntityType;

// TODO: move this to a better location inside the media module
export const MY_MEDIA_PROPERTY_VALUE_ENTITY_TYPE = `${MY_MEDIA_ENTITY_TYPE}-property-value`;
export type MyMediaPropertyValueEntityType = typeof MY_MEDIA_PROPERTY_VALUE_ENTITY_TYPE;