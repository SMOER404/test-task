import React from 'react';
import styles from './Message.module.css';

interface MessageProps {
    children: React.ReactNode;
    type?: 'info' | 'error' | 'success';
}

export const Message: React.FC<MessageProps> = ({
                                                    children,
                                                    type = 'info'
                                                }) => {
    return (
        <div className={`${styles.message} ${styles[type]}`}>
            {children}
        </div>
    );
};