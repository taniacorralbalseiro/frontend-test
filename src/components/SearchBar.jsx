function SearchBar({ search, onSearchChange }) {
    return (
        <div className="search-bar">
            <input
                id="product-search"
                name="search"
                type="search"
                placeholder="Buscar por marca o modelo..."
                value={search}
                onChange={(event) => onSearchChange(event.target.value)}
                aria-label="Buscar productos"
            />
        </div>
    );
}

export default SearchBar;