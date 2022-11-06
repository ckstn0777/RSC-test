import { db } from './db.server'

export default function NoteList({ searchText }) {
  const notes = db.query(
    `select * from notes, pg_sleep(10) where title ilike $1 order by id desc`,
    ['%' + searchText + '%']
  ).rows

  console.log(notes)

  return notes.length > 0 ? (
    <ul className="notes-list">
      {notes.map((note) => (
        <li key={note.id}>
          <div>{note.title}</div>
        </li>
      ))}
    </ul>
  ) : (
    <div className="notes-empty">
      {searchText
        ? `Couldn't find any notes titled "${searchText}".`
        : 'No notes created yet!'}
    </div>
  )
}
