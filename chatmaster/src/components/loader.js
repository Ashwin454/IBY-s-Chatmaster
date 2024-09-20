import React from 'react';
import styles from '../css/Loader.module.css'; // Make sure to create this CSS module file

const Loader = () => {
  return (
    <div className={styles.loader}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" stroke="#3498db" strokeWidth="5" fill="none" strokeDasharray="283" strokeDashoffset="75">
          <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default Loader;
