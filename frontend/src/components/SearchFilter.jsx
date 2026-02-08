import { useState } from 'react';

function SearchFilter({ onFilterChange }) {
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('All');

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        onFilterChange({ search: value, status });
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatus(value);
        onFilterChange({ search, status: value });
    };

    return (
        <div className="search-filter">
            <div className="search-input-wrapper">
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                    type="text"
                    placeholder="Search by name, email, or job title..."
                    value={search}
                    onChange={handleSearchChange}
                    className="search-input"
                />
            </div>
            <select value={status} onChange={handleStatusChange} className="status-filter">
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Hired">Hired</option>
            </select>
        </div>
    );
}

export default SearchFilter;
