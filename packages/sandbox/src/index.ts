import { EditorState } from 'prosemirror-state'
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view'
import { keymap } from 'prosemirror-keymap'
import { Schema } from 'prosemirror-model'
import { baseKeymap } from 'prosemirror-commands'
import { CustomMarkView } from './CustomMarkView'

const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      selectable: false,
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0]
      }
    },
    text: {
      group: 'inline'
    }
  },
  marks: {
    italic: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() {
        return ['em', 0]
      }
    }
  }
})

const state = EditorState.create({
  doc: schema.nodes.doc.createChecked(undefined, [
    schema.nodes.paragraph.create(undefined, [
      schema.text('here ', []),
      schema.text('hello', [schema.mark('italic')]),
      schema.text(' world', [])
    ]),
    schema.nodes.paragraph.create()
  ]),
  schema,
  plugins: [keymap(baseKeymap)]
})
const widget = () => (view: EditorView, getPos: () => number | undefined) => {
  const element = document.createElement('span')
  element.classList.add('mark-view')
  const name = document.createElement('button')
  name.classList.add('name')
  name.textContent = 'Btn'
  element.appendChild(name)
  return element
}
let decoSet = DecorationSet.create(state.doc, [
  Decoration.widget(6, widget(), {
    side: 0
  })
])
const stateEl = document.querySelector('#state')
const view = new EditorView(document.querySelector('#editor') as HTMLElement, {
  state,
  decorations: s => decoSet,
  // markViews: {
  //   italic: (m, v, i) => new CustomMarkView(m, v, i).init()
  // },
  dispatchTransaction(tr) {
    const state = this.state.apply(tr)
    decoSet = decoSet.map(tr.mapping, tr.doc)
    view.updateState(state)
    stateEl!.innerHTML = JSON.stringify(state.toJSON())
  }
})
stateEl!.innerHTML = JSON.stringify(view.state.toJSON())
