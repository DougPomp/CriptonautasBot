import React from 'react';
import styles from './Input.module.css';

const Input = ({ type = 'text', placeholder, value, onChange, disabled = false }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={styles.input}
    />
  );
};

export default Input;
