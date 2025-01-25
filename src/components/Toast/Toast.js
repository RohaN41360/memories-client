import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast-container ${type}`}>
            <div className="toast-content">
                <div className="toast-icon">
                    {type === 'success' && <i className="fa fa-check-circle"></i>}
                    {type === 'error' && <i className="fa fa-exclamation-circle"></i>}
                    {type === 'warning' && <i className="fa fa-exclamation-triangle"></i>}
                    {type === 'info' && <i className="fa fa-info-circle"></i>}
                </div>
                <div className="toast-message">{message}</div>
                <button className="toast-close" onClick={onClose}>
                    <i className="fa fa-times"></i>
                </button>
            </div>
            <div className="toast-progress" style={{ animationDuration: `${duration}ms` }} />
        </div>
    );
};

export default Toast; 