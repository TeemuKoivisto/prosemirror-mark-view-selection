import { EditorView, MarkViewConstructor } from 'prosemirror-view'
import { DOMSerializer, Mark } from 'prosemirror-model'

export class CustomMarkView {
  _dom?: HTMLElement
  contentDOM?: HTMLElement | null
  mark: Mark
  inline: boolean

  editing = false

  constructor(
    node: Mark,
    readonly view: EditorView,
    inline: boolean
  ) {
    this.mark = node
    this.view = view
    this.inline = inline
  }

  init = (): ReturnType<MarkViewConstructor> => {
    const toDOM = this.mark.type.spec.toDOM
    if (!toDOM) {
      throw Error(`@quickprose/core: node "${this.mark.type}" was not given a toDOM method!`)
    }
    const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(this.mark, this.inline))
    this._dom = document.createElement(this.inline ? 'span' : 'div')
    this._dom.classList.add('mark-view')
    this.contentDOM = contentDOM
    this.create()
    return {
      dom: this._dom,
      contentDOM
    }
  }

  create() {
    const name = document.createElement('span')
    name.classList.add('name')
    name.contentEditable = 'false'
    const btn = document.createElement('button')
    btn.contentEditable = 'false'
    btn.textContent = 'Btn'
    name.appendChild(btn)
    this._dom!.appendChild(name)
    this.contentDOM && this._dom!.appendChild(this.contentDOM)
  }
}
