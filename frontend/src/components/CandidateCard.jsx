import { useState } from 'react';
import { getBackendUrl } from '../services/api';

function CandidateCard({ candidate, onStatusUpdate, onDelete }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoadingResume, setIsLoadingResume] = useState(false);

    const getStatusClass = (status) => {
        if (status === 'Pending') return 'status-pending';
        if (status === 'Reviewed') return 'status-reviewed';
        if (status === 'Hired') return 'status-hired';
        return '';
    };

    const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        if (newStatus !== candidate.status) {
            setIsUpdating(true);
            await onStatusUpdate(candidate._id, newStatus);
            setIsUpdating(false);
        }
    };

    const handleDelete = () => {
        if (window.confirm(`Are you sure you want to delete ${candidate.name}?`)) {
            onDelete(candidate._id);
        }
    };

    const handleViewResume = async (e) => {
        e.preventDefault();
        setIsLoadingResume(true);

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${getBackendUrl()}/api/candidates/${candidate._id}/resume`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (data.success && data.data.resumeUrl) {
                window.open(data.data.resumeUrl, '_blank');
            } else {
                window.open(candidate.resumeUrl, '_blank');
            }
        } catch (error) {
            window.open(candidate.resumeUrl, '_blank');
        } finally {
            setIsLoadingResume(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="candidate-card">
            <div className="card-header">
                <div className="candidate-avatar">{getInitials(candidate.name)}</div>
                <div className="candidate-info">
                    <h3 className="candidate-name">{candidate.name}</h3>
                    <p className="candidate-job">{candidate.jobTitle}</p>
                </div>
                <span className={'status-badge ' + getStatusClass(candidate.status)}>{candidate.status}</span>
            </div>

            <div className="card-body">
                <div className="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <span>{candidate.email}</span>
                </div>
                <div className="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    <span>{candidate.phone}</span>
                </div>
                <div className="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>Referred on {formatDate(candidate.createdAt)}</span>
                </div>
                {candidate.resumeUrl && (
                    <button
                        onClick={handleViewResume}
                        disabled={isLoadingResume}
                        className="resume-link"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        {isLoadingResume ? 'Loading...' : 'View Resume'}
                    </button>
                )}
            </div>

            <div className="card-footer">
                <select value={candidate.status} onChange={handleStatusChange} disabled={isUpdating} className="status-select">
                    <option value="Pending">Pending</option>
                    <option value="Reviewed">Reviewed</option>
                    <option value="Hired">Hired</option>
                </select>
                <button onClick={handleDelete} className="delete-btn" title="Delete candidate">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default CandidateCard;

