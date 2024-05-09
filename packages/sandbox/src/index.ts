import { EditorState, Plugin } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { keymap } from 'prosemirror-keymap'
import { Schema } from 'prosemirror-model'
import { baseKeymap } from 'prosemirror-commands'
import { CustomNodeView } from './CustomNodeView'

const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      attrs: {
        name: { default: null }
      },
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
  }
})

const state = EditorState.create({
  doc: schema.nodes.doc.createChecked(undefined, [
    schema.nodes.paragraph.create(),
    schema.nodes.paragraph.create({ name: 'N2' })
  ]),
  schema,
  plugins: [keymap(baseKeymap)]
})
const stateEl = document.querySelector('#state')
const view = new EditorView(document.querySelector('#editor') as HTMLElement, {
  state,
  nodeViews: {
    paragraph: (n, v, g) => new CustomNodeView(n, v, g)
  },
  dispatchTransaction(tr) {
    const state = this.state.apply(tr)
    view.updateState(state)
    stateEl!.innerHTML = JSON.stringify(state.toJSON())
  }
})
stateEl!.innerHTML = JSON.stringify(view.state.toJSON())
