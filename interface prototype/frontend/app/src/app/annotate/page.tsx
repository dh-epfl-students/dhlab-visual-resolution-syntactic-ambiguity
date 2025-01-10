"use client";

import { useState } from "react";
// import styles from "./page.module.css";
import styles from "../page.module.css";

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

      {/* Main Content Container */}
      <div className={styles.container}>
        {/* Left Sidebar for Data Items */}
        <aside className={styles.leftSidebar}>
          <h3>Data to Annotate</h3>
          <ul className={styles.dataList}>
            <li>Data Item 1</li>
            <li>Data Item 2</li>
            <li>Data Item 3</li>
            {/* Add more items as needed */}
          </ul>
        </aside>

        {/* Main Annotation Area */}
        <main className={styles.main}>
          {/* Left Section */}
          <div className={styles.leftSection}>
            {/* Upper Section: Sentence to Annotate */}
            <div className={styles.upperSection}>
              <h3>Sentence to Annotate</h3>

              <div className={styles.contentBox}>
                <span className={styles.premise}>Premise:</span>
                <p className={styles.sentenceText}>
                  The professor said 
                  <span
                    className={styles.highlight}
                    onClick={handleHighlightClick}
                  >
                    on Monday
                  </span>
                  he would give an exam.
                </p>
                <span className={styles.hypothesis}>Hypothesis:</span>
                <p className={styles.sentenceText}>The professor said the exam will be on Monday.</p>
                </div>

                {/* Navigation Buttons */}
                <div className={styles.navigationButtons}>
                  <button className={styles.navButton}>← Previous</button>
                  <button className={styles.navButton}>Next →</button>
                </div>
            </div>

            {/* Lower Section: Parsing Tree Structure */}
            {/* Lower Section: Parsing Tree Structure */}
            <div className={styles.lowerSection}>
              <h3>Parsing Tree Structure</h3>
              {showAmbiguityText && (
                <>
                  <p>There is potential syntactic ambiguity in this sentence</p>
                  <div className={styles.imageContainer}>
                    <div className={styles.imageWithText}>
                      <img 
                        src="/images/tree1.png" 
                        alt="Parsing Tree Representation 1" 
                        className={styles.treeImage} 
                      />
                      <p className={`${styles.disambiguationText} ${styles.textBlue}`}>
                        Disambiguation 1: The professor said on Monday that he would give an exam.
                      </p>
                    </div>
                    <div className={styles.imageWithText}>
                      <img 
                        src="/images/tree2.png" 
                        alt="Parsing Tree Representation 2" 
                        className={styles.treeImage} 
                      />
                      <p className={`${styles.disambiguationText} ${styles.textGreen}`}>
                        Disambiguation 2: The professor said that on Monday, he would give an exam.
                      </p>
                    </div>
                  </div>
                </>
              )}
              {/* <p>[Details about 'on Monday' will be displayed here]</p>
              <p>[Parsing tree representation here]</p> */}
            </div>
          </div>

          {/* Right Section: Label buttons */}
          <div className={styles.rightSection}>
            <div className={styles.buttonContainer}>
            <h3>Select Label</h3>
            <button className={styles.button}>Neutral</button>
            <button className={styles.button}>Entail</button>
            <button className={styles.button}>Contradict</button>
          </div>
          </div>
        </main>
      </div>
    </>
  );
}