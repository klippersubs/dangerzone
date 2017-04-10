# dangerzone

 >  Seamlessly use raw HTML in React without `dangerouslySetInnerHTML`.

## Install

````bash
npm install --save dangerzone
````

## Examples

````jsx harmony
function WithHtmlLiteral () {
    return <div>{dz`<em>Yeah!</em>`}</div>;
}
````

````jsx harmony
function WithHtmlVariable (props) {
    return <div>{dz(props.html)}</div>;
}
````

## Notes

 1. Dangerzone removes all `on*` attributes.
 2. Dangerzone replaces `checked` attribute with `defaultChecked`.
 3. Dangerzone replaces `value` attribute with `defaultValue`.
 4. Dangerzone removes `<script>` tags.

## API

### `dangerzone`

Converts HTML to `ReactNode`s array.

Arguments (if called as template string tag):

 1. `html : TemplateStringsArray` — template strings array.
 2. `...rest : any[]` — template values array.

Arguments (if called as regular function):

 1. `html : string` — input HTML.

Returns: `ReactNode[]` — resulting `ReactNode`s array.

Alias: `dz`.

### `htmlToDom`

Converts HTML to `htmlparser2`'s DOM.

Arguments:

 1. `html : string` — input HTML.

Returns: `Dom` — resulting DOM.

Throws:

 *  `htmlparser2`'s exception, if there is error while parsing HTML.
 *  `'Unknown HTML parsing error: Neither DOM nor Error returned'`
    if neither DOM nor error returned by parser.

### `domToReact`

Converts `htmlparser2`'s DOM to `ReactNode`s array.

Arguments:

 1. `dom : Dom` — `htmlparser2`'s DOM.
 2. `counter : IDzCounter = { val : 0 }` —
    [counter](#idzcounter) object needed for adding `key` props to child nodes.

Returns: `ReactNode[]` — resulting `ReactNode`s array.

### `attribsToReact`

Converts `htmlparser2`'s attributes to React's `DOMAttributes`.

Arguments:

 1. `node : Tag | Style` — `htmlparser2`'s `Tag` or `Style` node.
 2. `counter : IDzCounter = { val : 0 }` —
    [counter](#idzcounter) object needed for adding `key` props to child nodes.

Returns: `DOMAttributes` — resulting React's `DOMAttributes` object.

### `cssToCssom`

Converts CSS to `postcss`' nodes array.

Arguments:

 1. `css : string` — input CSS.

Returns: `Declaration[]` — resulting `Declaration`s array.

### `cssomToReact`

Converts `postcss`' declarations array to React's `CSSProperties`.

Arguments:

 1. `nodes : Declaration[]` — `postcss`' declarations array.

Returns: `CSSProperties` — resulting React's style object.

### `IDzCounter`

Special object needed for adding `key` props to child React nodes.

 *  `val : number` — counter's value.

## License

MIT
