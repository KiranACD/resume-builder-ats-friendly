import './SimpleModal.css';
const SimpleModal = ({isOpen, onClose, children}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-container">
            <div className="modal">
                {children}
                <button className="modal-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default SimpleModal;