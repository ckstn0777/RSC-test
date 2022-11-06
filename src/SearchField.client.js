export default function SearchField() {
  return (
    <form className="search" onSubmit={(e) => e.preventDefault()}>
      <label htmlFor="sidebar-search-input">Search for a note by title</label>
      <input id="sidebar-search-input" />
    </form>
  )
}
