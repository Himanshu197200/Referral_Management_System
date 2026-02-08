import { useState, useEffect } from 'react';
import { candidateService } from '../services/api';
import CandidateCard from './CandidateCard';
import CandidateForm from './CandidateForm';
import SearchFilter from './SearchFilter';

function Dashboard({ user, onLogout, onLoginClick }) {
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [filters, setFilters] = useState({ search: '', status: 'All' });
    const [notification, setNotification] = useState(null);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const fetchCandidates = async () => {
        try {
            setLoading(true);
            const response = await candidateService.getAllCandidates(filters);
            setCandidates(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch candidates');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCandidates();
    }, [filters]);

    const handleCreateCandidate = async (candidateData) => {
        try {
            await candidateService.createCandidate(candidateData);
            showNotification('Candidate referred successfully!');
            setShowForm(false);
            fetchCandidates();
        } catch (err) {
            throw err;
        }
    };

    const handleStatusUpdate = async (candidateId, newStatus) => {
        try {
            await candidateService.updateStatus(candidateId, newStatus);
            showNotification('Status updated to ' + newStatus);
            fetchCandidates();
        } catch (err) {
            showNotification(err.message || 'Failed to update status', 'error');
        }
    };

    const handleDelete = async (candidateId) => {
        try {
            await candidateService.deleteCandidate(candidateId);
            showNotification('Candidate deleted successfully');
            fetchCandidates();
        } catch (err) {
            showNotification(err.message || 'Failed to delete candidate', 'error');
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const getStats = () => {
        const total = candidates.length;
        const pending = candidates.filter(c => c.status === 'Pending').length;
        const reviewed = candidates.filter(c => c.status === 'Reviewed').length;
        const hired = candidates.filter(c => c.status === 'Hired').length;
        return { total, pending, reviewed, hired };
    };

    const stats = getStats();

    return (
        <div className="dashboard">
            {notification && (
                <div className={'notification ' + notification.type}>{notification.message}</div>
            )}

            <header className="dashboard-header">
                <div className="header-content">
                    <div className="logo-section">
                        <div className="logo">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <div>
                            <h1>Referral Management</h1>
                            <p className="subtitle">Manage your candidate referrals efficiently</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        <button onClick={() => setShowForm(true)} className="btn-primary add-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Refer Candidate
                        </button>
                        {user ? (
                            <div className="user-menu">
                                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>
                                <button onClick={onLogout} className="btn-secondary logout-btn">Logout</button>
                            </div>
                        ) : (
                            <button onClick={onLoginClick} className="btn-secondary login-btn">Login</button>
                        )}
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="stats-grid">
                    <div className="stat-card total">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.total}</span>
                            <span className="stat-label">Total Referrals</span>
                        </div>
                    </div>
                    <div className="stat-card pending">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.pending}</span>
                            <span className="stat-label">Pending</span>
                        </div>
                    </div>
                    <div className="stat-card reviewed">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.reviewed}</span>
                            <span className="stat-label">Reviewed</span>
                        </div>
                    </div>
                    <div className="stat-card hired">
                        <div className="stat-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        </div>
                        <div className="stat-info">
                            <span className="stat-value">{stats.hired}</span>
                            <span className="stat-label">Hired</span>
                        </div>
                    </div>
                </div>

                <SearchFilter onFilterChange={handleFilterChange} />

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading candidates...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                        <p>{error}</p>
                        <button onClick={fetchCandidates} className="btn-secondary">Try Again</button>
                    </div>
                ) : candidates.length === 0 ? (
                    <div className="empty-state">
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <line x1="17" y1="11" x2="23" y2="11"></line>
                        </svg>
                        <h3>No candidates found</h3>
                        <p>Start by referring a candidate using the button above</p>
                    </div>
                ) : (
                    <div className="candidates-grid">
                        {candidates.map(candidate => (
                            <CandidateCard
                                key={candidate._id}
                                candidate={candidate}
                                onStatusUpdate={handleStatusUpdate}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            {showForm && (
                <CandidateForm
                    onSubmit={handleCreateCandidate}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
}

export default Dashboard;
