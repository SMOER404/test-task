import React, { KeyboardEvent, useRef } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
                                                  children,
                                                  onClick,
                                                  disabled = false,
                                                  type = 'button'
                                              }) => {
    const buttonRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    const handleClick = () => {
        if (!disabled) {
            onClick();
        }
    };

    return (
        <div
            ref={buttonRef}
            className={`${styles.button} ${disabled ? styles.disabled : ''}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="button"
            aria-disabled={disabled}
        >
            {children}
        </div>
    );
};