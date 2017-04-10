declare module 'htmlparser2' {
    export * from '@types/htmlparser2';

    import { Handler, Options } from '@types/htmlparser2';

    export class DomHandler implements Handler {
        constructor (handler : (err : Error, dom : Dom) => void);
    }

    export type Dom = Array<Node>;
    export type Node = Tag | Text | Comment | Cdata | Style | Script;
    export type Tags = Tag | Style | Script;

    interface AbstractDomEntry {
        prev : AbstractDomEntry | null;
        next : AbstractDomEntry | null;
        parent : AbstractDomEntry | null;
    }

    export interface Tag extends AbstractDomEntry {
        type : 'tag';
        name : string;
        attribs : Attribs;
        children : Dom;
    }

    export interface Comment extends AbstractDomEntry {
        type : 'comment';
        data : string;
    }

    export interface Text extends AbstractDomEntry {
        type : 'text';
        data : string;
    }

    export interface Cdata extends AbstractDomEntry {
        type : 'cdata';
        children : Array<{ type : 'text'; data : string }>;
    }

    export interface Style extends AbstractDomEntry {
        type : 'style';
        name : string;
        attribs : Attribs;
        children : Text[];
    }

    export interface Script extends AbstractDomEntry {
        type : 'script';
        name : string;
        attribs : Attribs;
        children : Text[];
    }

    export interface Attribs {
        [ key : string ] : string;
    }

    export namespace DomUtils {
        function getInnerHTML (node : Node, opts? : Options) : string;
    }
}

// declare module 'react' {
//     import * as React from '@types/react';
//
//     interface ReactFragment extends Array<React.ReactNode> { }
//
//     export = React;
// }
