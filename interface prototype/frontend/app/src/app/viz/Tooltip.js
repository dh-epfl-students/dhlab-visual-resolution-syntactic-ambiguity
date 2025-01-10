// Tooltip.js
"use client";

import React from "react";
import styles from "./Tooltip.module.css";

export default function Tooltip({ children, content }) {
  return (
    <div className={styles.tooltipContainer}>
      {children}
      <div className={styles.tooltipContent}>{content}</div>
    </div>
  );
}
