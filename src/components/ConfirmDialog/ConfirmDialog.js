import React from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <div className="confirm-dialog-content">
                    <h3>{title}</h3>
                    <p>{message}</p>
                    <div className="confirm-dialog-actions">
                        <button 
                            className="confirm-dialog-button cancel" 
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button 
                            className="confirm-dialog-button confirm" 
                            onClick={onConfirm}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog; 