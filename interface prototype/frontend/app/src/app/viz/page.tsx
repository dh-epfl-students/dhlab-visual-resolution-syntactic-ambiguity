"use client";
import Tooltip from "./Tooltip";
import { useEffect, useState } from "react";
import styles from "../page.module.css";

export default function VizPage() {
  const fullText = "On a quiet morning in the countryside, news spread rapidly through a small town. Rumor had it that “An enranged cow injured a farmer with an ax.” The townspeople were shocked, as such a violent incident was unheard of in their peaceful community. In a concert hall not too far away, a young pianist stunned the audience when “He sightread the piece with a lot of F naturals.” Meanwhile, the local hospital struggled under a legal scandal, for “The hospital is being sued by six foot doctors.” The townsfolk whispered in confusion, unsure what the specialists’ grievances might be. At the same time, over at the local college, “The professor said on Monday he would give an exam.” As these strange events unfolded, the sleepy village found itself abuzz with gossip. In the end, the community gathered together, hopeful that truth and reason would prevail. The day would certainly be remembered as one of the most peculiar in their town’s history.";

  const highlights = {
    "with an ax": { 
      explanation: "There is an *attachment* ambiguity: 'with an ax' could latch on to both 'injured' and 'a farmer'."
    },
    "with a lot of F naturals": { 
      explanation: "There is an *attachment* ambiguity: 'with a lot of F naturals' could latch on to both 'sightread' and 'the piece'."
    },
    "six foot doctors": { 
      explanation: "There is an *attachment* ambiguity: 'six foot doctors' could latch on to both 'six foot' and 'foot doctors'."
    },
    "on Monday": { 
      explanation: "There is an *attachment* ambiguity: 'on Monday' could latch on to both 'said' and 'give an exam'."
    },
    "said": {
      explanation: "Indicates the professor said something."
    },
    "give an exam": {
      explanation: "Refers to the professor administering an exam."
    },
    "cow injured": {
      explanation: "The cow is enraged and injures someone."
    },
    "a farmer": {
      explanation: "The victim is a farmer."
    },
    "sightread": {
      explanation: "The pianist is playing by reading the music for the first time."
    },
    "the piece": {
      explanation: "Refers to the musical piece being played."
    }
  };

  const highlights4 = {
    "with an ax": { 
      explanation: "An enraged cow injured a farmer, who was holding an ax / An enraged cow injured a farmer using an ax"
    },
    "with a lot of F naturals": { 
      explanation: "He sightread the piece, which contained a lot of F naturals / He sightread the piece, using a lot of F naturals as his playing style"
    },
    "six foot doctors": { 
      explanation: "The hospital is being sued by doctors who are six feet tall / The hospital is being sued for a medical error involving six-foot-long doctors"
    },
    "on Monday": { 
      explanation: "On Monday, the professor said he would give an exam / The professor said that on Monday he would give an exam"
    }
  };

  const [displayedText, setDisplayedText] = useState("");
  const [selectedHighlight, setSelectedHighlight] = useState(null);
  const [showHighlightBars, setShowHighlightBars] = useState(false); 
  const [showTooltips, setShowTooltips] = useState(false); 
  const [isButton1Active, setIsButton1Active] = useState(false);
  const [isButton2Active, setIsButton2Active] = useState(false);
  const [isButton3Active, setIsButton3Active] = useState(false);
  const [isButton4Active, setIsButton4Active] = useState(false);
  const [showTooltips4, setShowTooltips4] = useState(false);

  useEffect(() => {
    let index = 0;
    const typingTimer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingTimer);
      }
    }, 10);
    return () => clearInterval(typingTimer);
  }, [fullText]);

  const toggleHighlightBars = () => {
    setShowHighlightBars((prev) => !prev);
    setIsButton1Active((prev) => !prev);
  };

  const toggleTooltips = () => {
    if (showTooltips) {
      setSelectedHighlight(null);
    }
    setShowTooltips((prev) => !prev);
    setIsButton2Active((prev) => !prev);
  };

  const toggleTrees = () => {
    setIsButton3Active((prev) => !prev);
  };

  const toggleTooltips4 = () => {
    if (showTooltips4) {
      setSelectedHighlight(null);
    }
    setShowTooltips4((prev) => !prev);
    setIsButton4Active((prev) => !prev);
  };

  // Add tree data (retain but no longer use JSON printing)
  const syntaxTrees = {
    "with an ax": {
      tree1: {
        label: "S",
        children: [
          {
            label: "NP",
            children: [
              { label: "DT", children: ["an"] },
              { label: "VBN", children: ["enranged"] },
              { label: "NN", children: ["cow"] }
            ]
          },
          {
            label: "VP",
            children: [
              { label: "VBN", children: ["injured"] },
              {
                label: "NP",
                children: [
                  { label: "DT", children: ["a"] },
                  { label: "NN", children: ["farmer"] }
                ]
              },
              {
                label: "PP",
                children: [
                  { label: "IN", children: ["with"] },
                  {
                    label: "NP",
                    children: [
                      { label: "DT", children: ["an"] },
                      { label: "NN", children: ["ax"] }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      tree2: {
        label: "S",
        children: [
          {
            label: "NP",
            children: [
              { label: "DT", children: ["an"] },
              { label: "VBN", children: ["enranged"] },
              { label: "NN", children: ["cow"] }
            ]
          },
          {
            label: "VP",
            children: [
              { label: "VBN", children: ["injured"] },
              {
                label: "X",
                children: [
                  {
                    label: "NP",
                    children: [
                      { label: "DT", children: ["a"] },
                      { label: "NN", children: ["farmer"] }
                    ]
                  },
                  {
                    label: "PP",
                    children: [
                      { label: "IN", children: ["with"] },
                      {
                        label: "NP",
                        children: [
                          { label: "DT", children: ["an"] },
                          { label: "NN", children: ["ax"] }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    }
  };

  const renderTextWithHighlights = () => {
    const elements = [];
    let lastIndex = 0;
    const positions = [];

    for (const [highlightText, { explanation }] of Object.entries(highlights)) {
      let startIndex = 0;
      while ((startIndex = displayedText.indexOf(highlightText, startIndex)) !== -1) {
        positions.push({
          startIndex,
          endIndex: startIndex + highlightText.length,
          explanation,
          highlightText,
          tooltipContent: explanation,
          showBars: ["with an ax", "with a lot of F naturals", "six foot doctors", "on Monday"].includes(highlightText)
        });
        startIndex += highlightText.length;
      }
    }

    positions.sort((a, b) => a.startIndex - b.startIndex);

    const noDefaultHighlight = [
      "cow injured", "a farmer", 
      "sightread", "the piece", 
      "said", "give an exam"
    ];

    positions.forEach((pos) => {
      if (pos.startIndex > lastIndex) {
        elements.push(displayedText.slice(lastIndex, pos.startIndex));
      }

      const handleMouseEnter = () => {
        if (showTooltips || showTooltips4 || isButton3Active) {
          setSelectedHighlight(pos.highlightText);
        }
      };
      const handleMouseLeave = () => {
        if (showTooltips || showTooltips4 || isButton3Active) {
          const blueEls = document.querySelectorAll(`.${styles.blueHighlight}`);
          const orangeEls = document.querySelectorAll(`.${styles.extraHighlight}`);
          
          blueEls.forEach(el => {
            if (el) {
              el.classList.remove(styles.blueHighlight);
            }
          });
          
          orangeEls.forEach(el => {
            if (el) {
              el.classList.remove(styles.extraHighlight);
            }
          });
          
          setSelectedHighlight(null);
        }
      };

      let content;
      if (pos.highlightText === "six foot doctors") {
        content = (
          <>
            <span data-highlight="six">six</span>
            <span data-highlight="foot"> foot</span>
            <span data-highlight="doctors"> doctors</span>
          </>
        );
      } else {
        content = displayedText.slice(pos.startIndex, pos.endIndex);
      }

      const highlightClass = noDefaultHighlight.includes(pos.highlightText) ? "" : styles.highlight;
      const dataHighlightValue = pos.highlightText.toLowerCase().replace(/\s+/g, '-');

      elements.push(
        <span
          key={pos.startIndex}
          className={highlightClass}
          data-highlight={dataHighlightValue}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {showHighlightBars && pos.showBars && (
            <div className={styles.highlightBar}>
              <div
                className={styles.bluePart}
                onMouseEnter={() => {
                  setSelectedHighlight(null);
                  if (pos.highlightText === "with an ax") {
                    setSelectedHighlight("with an ax");
                    const el1 = document.querySelector(`span[data-highlight="cow-injured"]`);
                    const el2 = document.querySelector(`span[data-highlight="with-an-ax"]`);
                    if (el1) el1.classList.add(styles.blueHighlight);
                    if (el2) el2.classList.add(styles.blueHighlight);
                  }
                  if (pos.highlightText === "with a lot of F naturals") {
                    setSelectedHighlight("with a lot of F naturals");
                    const el1 = document.querySelector(`span[data-highlight="sightread"]`);
                    const el2 = document.querySelector(`span[data-highlight="with-a-lot-of-f-naturals"]`);
                    if (el1) el1.classList.add(styles.blueHighlight);
                    if (el2) el2.classList.add(styles.blueHighlight);
                  }
                  if (pos.highlightText === "six foot doctors") {
                    setSelectedHighlight("six foot doctors");
                    const elSix = document.querySelector(`span[data-highlight="six"]`);
                    const elFoot = document.querySelector(`span[data-highlight="foot"]`);
                    if (elSix) elSix.classList.add(styles.blueHighlight);
                    if (elFoot) elFoot.classList.add(styles.blueHighlight);
                  }
                  if (pos.highlightText === "on Monday") {
                    setSelectedHighlight("on Monday");
                    const el1 = document.querySelector(`span[data-highlight="said"]`);
                    const el2 = document.querySelector(`span[data-highlight="on-monday"]`);
                    if (el1) el1.classList.add(styles.blueHighlight);
                    if (el2) el2.classList.add(styles.blueHighlight);
                  }
                }}
                onMouseLeave={() => {
                  setSelectedHighlight(null);
                  const blueEls = document.querySelectorAll(`.${styles.blueHighlight}`);
                  blueEls.forEach(el => el.classList.remove(styles.blueHighlight));
                }}
              ></div>
              <div
                className={styles.orangePart}
                onMouseEnter={() => {
                  setSelectedHighlight(null);
                  if (pos.highlightText === "with an ax") {
                    setSelectedHighlight("with an ax");
                    const el1 = document.querySelector(`span[data-highlight="a-farmer"]`);
                    const el2 = document.querySelector(`span[data-highlight="with-an-ax"]`);
                    if (el1) el1.classList.add(styles.extraHighlight);
                    if (el2) el2.classList.add(styles.extraHighlight);
                  }
                  if (pos.highlightText === "with a lot of F naturals") {
                    setSelectedHighlight("with a lot of F naturals");
                    const el1 = document.querySelector(`span[data-highlight="the-piece"]`);
                    const el2 = document.querySelector(`span[data-highlight="with-a-lot-of-f-naturals"]`);
                    if (el1) el1.classList.add(styles.extraHighlight);
                    if (el2) el2.classList.add(styles.extraHighlight);
                  }
                  if (pos.highlightText === "six foot doctors") {
                    setSelectedHighlight("six foot doctors");
                    const elFoot = document.querySelector(`span[data-highlight="foot"]`);
                    const elDoctors = document.querySelector(`span[data-highlight="doctors"]`);
                    if (elFoot) elFoot.classList.add(styles.extraHighlight);
                    if (elDoctors) elDoctors.classList.add(styles.extraHighlight);
                  }
                  if (pos.highlightText === "on Monday") {
                    setSelectedHighlight("on Monday");
                    const el1 = document.querySelector(`span[data-highlight="on-monday"]`);
                    const el2 = document.querySelector(`span[data-highlight="give-an-exam"]`);
                    if (el1) el1.classList.add(styles.extraHighlight);
                    if (el2) el2.classList.add(styles.extraHighlight);
                  }
                }}
                onMouseLeave={() => {
                  setSelectedHighlight(null);
                  const orangeEls = document.querySelectorAll(`.${styles.extraHighlight}`);
                  orangeEls.forEach(el => el.classList.remove(styles.extraHighlight));
                }}
              ></div>
            </div>
          )}
          {content}
          {((showTooltips && selectedHighlight === pos.highlightText) ||
            (showTooltips4 && selectedHighlight === pos.highlightText)) && (
            <div className={styles.tooltipContent}>
              {showTooltips4 
                ? (highlights4[pos.highlightText]?.explanation || highlights[pos.highlightText].explanation)
                : highlights[pos.highlightText].explanation
              }
            </div>
          )}
        </span>
      );

      lastIndex = pos.endIndex;
    });

    const remainingText = displayedText.slice(lastIndex);
    if (remainingText) {
      elements.push(remainingText);
    }

    return elements;
  };

  return (
    <>
      <nav className={styles.navbar}>
        <a href="/" className={styles.navItem}>Home Page</a>
        <a href="/viz" className={styles.navItem}>Viz Page</a>
        <a href="/annotate" className={styles.navItem}>Annotate</a>
      </nav>
      
      <div className={styles.container}>
        <div className={styles.buttonContainer} style={{width: '90%', maxWidth: '1300px', marginBottom: '10px'}}>
          <h3 style={{marginTop:'0', marginBottom:'10px'}}>Select Scheme</h3>
          <ul className={`${styles.dataList} ${styles.dataListHorizontal}`}>
            <li
              className={`${styles.toggleable} ${isButton1Active ? styles.active : ''}`}
              onClick={toggleHighlightBars}
            >
              1
            </li>
            <li
              className={`${styles.toggleable} ${isButton2Active ? styles.active : ''}`}
              onClick={toggleTooltips}
            >
              2
            </li>
            <li
              className={`${styles.toggleable} ${isButton3Active ? styles.active : ''}`}
              onClick={toggleTrees}
            >
              3
            </li>
            <li
              className={`${styles.toggleable} ${isButton4Active ? styles.active : ''}`}
              onClick={toggleTooltips4}
            >
              4
            </li>
          </ul>
        </div>

        <div className={styles.dialogueBox}>
          {renderTextWithHighlights()}
        </div>

        <div className={styles.infoBox}>
          {isButton3Active ? (
            selectedHighlight === "with an ax" ? (
              <div className={styles.treesContainer}>
                <div className={styles.treeWrapper}>
                  <div className={styles.treeTitle}>Parse 1</div>
                  <img className={styles.treeImage} src="/images/tree1.png" alt="Parse 1" />
                </div>
                <div className={styles.treeWrapper}>
                  <div className={styles.treeTitle}>Parse 2</div>
                  <img className={styles.treeImage} src="/images/tree2.png" alt="Parse 2" />
                </div>
              </div>
            ) : (
              <p>Hover over a highlighted word or phrase to see its parse trees.</p>
            )
          ) : (
            <p>Click button 3 to enable parse tree visualization.</p>
          )}
        </div>
      </div>
    </>
  );
}