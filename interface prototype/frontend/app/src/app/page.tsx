"use client";

import { useState } from "react";
import styles from "./page.module.css";

export default function NLIAnnotationPage() {
  const [showAmbiguityText, setShowAmbiguityText] = useState(false);

  // Show tips when clicking on the highlighted section
  const handleHighlightClick = () => {
    setShowAmbiguityText(true);
  };

  return (
    <>
      {/* Navigation Bar in its own container */}
      <nav className={styles.navbar}>
        <a href="/" className={styles.navItem}>Home Page</a>
        <a href="/viz" className={styles.navItem}>Viz Page</a>
        <a href="/annotate" className={styles.navItem}>Annotate</a>
      </nav>

      {/* New specific container */}
      <div className={styles.introContainer}>
        <div className={styles.introContentBox}>
          <p className={styles.sentenceText}>
            This is a prototype for visual resolution for syntactic ambiguity.
          </p>
        </div>
      </div>
    </>
  );
}