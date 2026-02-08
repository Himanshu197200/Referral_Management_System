import { useState } from 'react';

function CandidateForm({ onSubmit, onClose }) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', jobTitle: '', resume: null });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fileName, setFileName] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        if (!formData.jobTitle.trim()) {
            newErrors.jobTitle = 'Job title is required';
        }

        if (formData.resume && formData.resume.type !== 'application/pdf') {
            newErrors.resume = 'Only PDF files are allowed';
        }

        if (formData.resume && formData.resume.size > 5 * 1024 * 1024) {
            newErrors.resume = 'File size must be less than 5MB';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setErrors(prev => ({ ...prev, resume: 'Only PDF files are allowed' }));
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }));
                return;
            }
            setFormData(prev => ({ ...prev, resume: file }));
            setFileName(file.name);
            setErrors(prev => ({ ...prev, resume: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setFormData({ name: '', email: '', phone: '', jobTitle: '', resume: null });
            setFileName('');
        } catch (error) {
            setErrors(prev => ({ ...prev, submit: error.message || 'Failed to submit referral' }));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Refer a Candidate</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="referral-form">
                    {errors.submit && <div className="error-banner">{errors.submit}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Full Name *</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter candidate's full name" className={errors.name ? 'error' : ''} />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address *</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email address" className={errors.email ? 'error' : ''} />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number *</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone number" className={errors.phone ? 'error' : ''} />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="jobTitle">Job Title *</label>
                        <input type="text" id="jobTitle" name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Enter job title applying for" className={errors.jobTitle ? 'error' : ''} />
                        {errors.jobTitle && <span className="error-text">{errors.jobTitle}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="resume">Resume (PDF only, max 5MB)</label>
                        <div className="file-input-wrapper">
                            <input type="file" id="resume" name="resume" accept=".pdf" onChange={handleFileChange} className="file-input" />
                            <label htmlFor="resume" className="file-label">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="17 8 12 3 7 8"></polyline>
                                    <line x1="12" y1="3" x2="12" y2="15"></line>
                                </svg>
                                {fileName || 'Choose PDF file'}
                            </label>
                        </div>
                        {errors.resume && <span className="error-text">{errors.resume}</span>}
                    </div>

                    <div className="form-actions">
                        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="btn-primary">
                            {isSubmitting ? 'Submitting...' : 'Submit Referral'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CandidateForm;
