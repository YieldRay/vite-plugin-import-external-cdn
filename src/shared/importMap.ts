export type SpecifierMap = Record<string, string>;

export type ScopesMap = Record<string, SpecifierMap>;

/**
 * https://developer.mozilla.org/docs/Web/HTML/Element/script/type/importmap
 */
export interface ImportMap {
    imports?: SpecifierMap;
    scopes?: ScopesMap;
}
