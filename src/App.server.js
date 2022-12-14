import { Suspense } from 'react'
import NoteList from './NoteList.server'

import SearchField from './SearchField.client'

export default function App({ selectedId, isEditing, searchText }) {
  // console.log('App', selectedId, isEditing, searchText)

  return (
    <div className="main">
      <section className="col sidebar">
        <section className="sidebar-header">
          <img
            className="logo"
            src="logo.svg"
            width="22px"
            height="20px"
            alt=""
            role="presentation"
          />
          <strong>React Notes</strong>
        </section>
        <section className="sidebar-menu" role="menubar">
          <SearchField />
        </section>
        <nav>
          <Suspense fallback={<div>Loading...</div>}>
            <NoteList searchText={searchText} />
          </Suspense>
        </nav>
      </section>
    </div>
  )
}
