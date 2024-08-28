import './FormStyle.css';
const PersonalDetailsForm = ({onFormChange, formData}) => {
    
    return (
        <form className="form-section-details">
            <div className="form-field fullName">
                <label>Full Name</label>
                <input
                type="text"
                name="personalDetails_fullName"
                value={formData.fullName || ''}
                onChange={onFormChange}
                />
            </div>
            <div className="form-field email">
                <label>Email</label>
                <input
                type="email"
                name="personalDetails_email"
                value={formData.email || ''}
                onChange={onFormChange}
                />
            </div>
            <div className="form-field phone">
                <label>Phone Number</label>
                <input
                type="tel"
                name="personalDetails_phone"
                value={formData.phone || ''}
                onChange={onFormChange}
                />
            </div>
            <div className="form-field github">
                <label>Github url</label>
                <input
                type="url"
                name="personalDetails_github"
                value={formData.github || ''}
                onChange={onFormChange}
                />
            </div>
            <div className="form-field linkedin">
                <label>Linkedin url</label>
                <input
                type="url"
                name="personalDetails_linkedin"
                value={formData.linkedin || ''}
                onChange={onFormChange}
                />
            </div>
    {/* Add more fields as needed */}
        </form>
    );
};

export default PersonalDetailsForm;