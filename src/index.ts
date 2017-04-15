/// <reference path='./index.d.ts' />

import { Parser, DomHandler, DomUtils } from 'htmlparser2';
import { parse, Declaration, Node } from 'postcss';
import * as React from 'react';
import { taglike, join } from 'taghelper';

/**
 * Special object needed for adding `key` props to child React nodes.
 */
export interface IDzCounter {
    /**
     * Counter's value.
     */
    val : number;
}

/**
 * Converts HTML to `ReactNode`s array.
 * @param {string|string[]} html — input HTML or template strings array.
 * @param {Array} [rest] — template values array.
 * @returns {React.ReactNode[]} — resulting `ReactNode`s array.
 * @alias `dz`.
 */
export function dangerzone (html : TemplateStringsArray | string, ...rest : any[]) : React.ReactNode[] {
    if (taglike(html, rest)) {
        return domToReact(htmlToDom(join(html as TemplateStringsArray, rest)), { val : 0 });
    } else {
        return domToReact(htmlToDom(html as string), { val : 0 });
    }
}

export { dangerzone as dz };

/**
 * Converts HTML to `htmlparser2`'s DOM.
 * @param {string} html — input HTML.
 * @returns {HpDom} — resulting DOM.
 * @throws `htmlparser2`'s exception, if there is error while parsing HTML.
 * @throws `'Unknown HTML parsing error: Neither DOM nor Error returned'` if neither DOM nor error returned by parser.
 */
export function htmlToDom (html : string) : HpDom {
    let err : Error | undefined;
    let dom : HpDom | undefined;

    const dh = new DomHandler((dhErr, dhDom) => {
        err = dhErr;
        dom = dhDom;
    });

    const parser = new Parser(dh, {
        lowerCaseTags           : true,
        lowerCaseAttributeNames : true,
        decodeEntities          : true,
    });

    parser.write(html);
    parser.end();

    if (dom) {
        return dom;
    } else if (err) {
        throw err;
    } else {
        throw new Error('Unknown HTML parsing error: Neither DOM nor Error returned');
    }
}

/**
 * Converts `htmlparser2`'s DOM to `ReactNode`s array.
 * @param {HpDom} dom — `htmlparser2`'s DOM.
 * @param {IDzCounter} [counter={val:0}] — counter object needed for adding `key` props to child nodes.
 * @returns {React.ReactNode[]} — resulting `ReactNode`s array.
 */
export function domToReact (dom : HpDom, counter : IDzCounter = { val : 0 }) : React.ReactNode[] {
    const fragment : React.ReactNode[] = [];

    for (const node of dom) {
        switch (node.type) {
            case 'text':
                fragment.push((node.data).replace(/[ \t\r\n]+/g, ' '));
                break;
            case 'tag':
            case 'style':
                fragment.push(React.createElement(
                    (node).name,
                    attribsToReact(node, counter),
                    ...domToReact(node.children, counter),
                ));
                break;
        }
    }

    return fragment;
}

/**
 * Converts `htmlparser2`'s attributes to React's `DOMAttributes`.
 * @param {Tag|Style} node — `htmlparser2`'s `Tag` or `Style` node.
 * @param {IDzCounter} [counter={val:0}] — counter object needed for adding `key` props to child nodes.
 * @returns {React.DOMAttributes} — resulting React's `DOMAttributes` object.
 */
export function attribsToReact (node : HpATag, counter : IDzCounter = { val : 0 }) : React.DOMAttributes<Element> {
    const attribs = node.attribs as any;

    if (attribs.checked) {
        attribs.defaultChecked = true;
        delete attribs.checked;
    }

    if (attribs[ 'class' ]) {
        attribs.className = attribs[ 'class' ];
        delete attribs[ 'class' ];
    }

    if (attribs[ 'for' ]) {
        attribs.htmlFor = attribs[ 'for' ];
        delete attribs[ 'for' ];
    }

    if (attribs.style) {
        try {
            attribs.style = cssomToReact(cssToCssom(attribs.style));
        } catch (_) {
            delete attribs.style;
        }
    }

    if (attribs.contenteditable) {
        delete attribs.contenteditable;
    }

    if (attribs.value) {
        attribs.defaultValue = attribs.value;
        delete attribs.value;
    }

    if (node.name === 'textarea') {
        attribs.defaultValue = DomUtils.getInnerHTML(node);
        node.children        = [];
    }

    Object.keys(attribs).forEach(attr => {
        if (attr.startsWith('on')) {
            delete attribs[ attr ];
        }
    });

    attribs.key = counter.val++;

    return attribs;
}

/**
 * Converts CSS to `postcss`' nodes array.
 * @param {string} css — input CSS.
 * @returns {Declaration[]} — resulting `Declaration`s array.
 */
export function cssToCssom (css : string) : Declaration[] {
    return (parse(css).nodes as Node[]).filter(node => node.type === 'decl') as Declaration[];
}

/**
 * Converts `postcss`' declarations array to React's `CSSProperties`.
 * @param {Declaration[]} nodes — `postcss`' declarations array.
 * @returns {React.CSSProperties} — resulting React's style object.
 */
export function cssomToReact (nodes : Declaration[]) : React.CSSProperties {
    const props : React.CSSProperties = {};

    nodes.forEach(node => {
        props[ node.prop.replace(/-([a-z])/ig, (match, letter) => letter.toUpperCase()) ] = node.value;
    });

    return props;
}

// Shit for covering lack of typings for htmlparser2-related modules.

export type HpDom = Array<HpNode>;

export interface HpAttribs {
    [ key : string ] : string;
}

export type HpNode = HpATag | HpText | HpCdata | HpComment;

export interface HpANode {
    prev   : HpANode | null;
    next   : HpANode | null;
    parent : HpANode | null;
}

export type HpATag = HpTag | HpStyle | HpScript;

export interface HpTag extends HpANode {
    type     : 'tag';
    name     : string;
    attribs  : HpAttribs;
    children : HpDom;
}

export interface HpStyle extends HpANode {
    type     : 'style';
    name     : string;
    attribs  : HpAttribs;
    children : HpText[];
}

export interface HpScript extends HpANode {
    type     : 'script';
    name     : string;
    attribs  : HpAttribs;
    children : HpText[];
}

export interface HpText extends HpANode {
    type : 'text';
    data : string;
}

export interface HpCdata extends HpANode {
    type     : 'cdata';
    children : Array<{ type : 'text'; data : string }>;
}

export interface HpComment extends HpANode {
    type : 'comment';
    data : string;
}
