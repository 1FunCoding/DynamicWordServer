// index.js

const haikuElement = document.querySelector('.haiku');
const placedElements = [haikuElement];

let draggedWordData = null;

window.addEventListener('load', () => {

  // Define the lines with their corresponding selectors, max syllables, and initial states
  const lines = {
    'syllable-5-1': {
      selector: '#syllable-5-1',
      maxSyllables: 5,
      usedSyllables: 0,
      words: []
    },
    'syllable-7': {
      selector: '#syllable-7',
      maxSyllables: 7,
      usedSyllables: 0,
      words: []
    },
    'syllable-5-2': {
      selector: '#syllable-5-2',
      maxSyllables: 5,
      usedSyllables: 0,
      words: []
    },
  };

  // Initialize the lines by selecting their elements
  Object.keys(lines).forEach(key => {
    lines[key].element = document.querySelector(lines[key].selector);
  });

  let offset = 0;
  const count = 10; // Number of words per page

  // Initialize WORDS as empty array
  let WORDS = [];

  const body = document.body;
  const buttonContainer = document.querySelector('.button-container');

  /**
   * Function to load magnets (words) based on the current offset and count
   */
  function loadMagnets() {
    console.log(`Fetching words with offset=${offset}, count=${count}`);
    fetch(`/words?offset=${offset}&count=${count}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then(words => {
        WORDS = words; // Update the WORDS array with the fetched words

        console.log(`Loaded words:`, WORDS);

        // Clear existing magnets
        const existingMagnets = document.querySelectorAll('.magnet');
        existingMagnets.forEach(magnet => magnet.remove());

        // Reset placedElements to only include haikuElement
        placedElements.length = 1; // keep only haikuElement

        words.forEach(word => {
          const magnet = document.createElement('div'); // Use <div> for magnets
          magnet.classList.add('magnet');
          magnet.textContent = word.text;
          magnet.draggable = true;
          magnet.addEventListener('dragstart', handleDragStart);
          magnet.addEventListener('dragend', handleDragEnd);
          placeMagnet(body, magnet);
        });
      })
      .catch(error => {
        console.error('Failed to load words:', error);
      });
  }

  // Call loadMagnets initially to load the first set of words
  loadMagnets();

  // Previous and Next button functionality
  document.getElementById('previous').addEventListener('click', () => {
    if (offset === 0) {
      console.log('Already at the first page.');
      return;
    }
    offset = Math.max(0, offset - count);
    loadMagnets();
  });

  document.getElementById('next').addEventListener('click', () => {
    if (offset + count >= 100) { // Ensure we don't go beyond the word list
      console.log('Already at the last page.');
      return;
    }
    offset += count;
    loadMagnets();
  });

  /**
   * Function to place magnets (words) without overlapping
   * @param {HTMLElement} parent - The container to place the magnet in
   * @param {HTMLElement} child - The magnet element
   */
  function placeMagnet(parent, child) {
    parent.appendChild(child);
    child.style.position = 'absolute';

    let overlap;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      overlap = false;
      attempts++;

      const left = `${Math.random() * 90}%`;
      const top = `${Math.random() * 90}%`;

      child.style.left = left;
      child.style.top = top;

      const childRect = child.getBoundingClientRect();
      const haikuRect = haikuElement.getBoundingClientRect();
      const buttonRect = buttonContainer.getBoundingClientRect();

      // Check overlap with haiku and buttons
      if (rectsOverlap(childRect, haikuRect) || rectsOverlap(childRect, buttonRect)) {
        overlap = true;
        continue;
      }

      // Check overlap with other placed elements
      for (const placedElement of placedElements) {
        const placedRect = placedElement.getBoundingClientRect();
        if (rectsOverlap(childRect, placedRect)) {
          overlap = true;
          break;
        }
      }

    } while (overlap && attempts < maxAttempts);

    if (!overlap) {
      placedElements.push(child);
    } else {
      console.log(`Could not place magnet: ${child.textContent}`);
      parent.removeChild(child); // Remove the magnet if it couldn't be placed without overlap
    }
  }

  /**
   * Helper function to check if two rectangles overlap
   * @param {DOMRect} rect1 
   * @param {DOMRect} rect2 
   * @returns {boolean}
   */
  function rectsOverlap(rect1, rect2) {
    return !(
      rect1.right <= rect2.left ||
      rect1.left >= rect2.right ||
      rect1.bottom <= rect2.top ||
      rect1.top >= rect2.bottom
    );
  }

  // Add drag event listeners to each haiku line element
  Object.values(lines).forEach(line => {
    const ulElement = line.element;
    ulElement.addEventListener('dragenter', handleDragEnter);
    ulElement.addEventListener('dragover', handleDragOver);
    ulElement.addEventListener('dragleave', handleDragLeave);
    ulElement.addEventListener('drop', handleDrop);
  });

  /**
   * Drag event handlers
   */

  function handleDragStart(event) {
    const wordText = this.textContent;
    const wordData = WORDS.find(w => w.text === wordText);
    if (!wordData) {
      console.error(`Word data not found for: ${wordText}`);
      return;
    }
    event.dataTransfer.setData("text/plain", JSON.stringify(wordData));
    draggedWordData = wordData;
    this.classList.add('dragging');
    removeWordFromLines(wordText);
  }

  function handleDragEnd(event) {
    this.classList.remove('dragging');
    Object.values(lines).forEach(line => {
      handleDragLeave({ currentTarget: line.element });
    });
    draggedWordData = null;
  }

  function handleDragEnter(event) {
    event.preventDefault();
    updateLineVisualFeedback(event.currentTarget);
  }

  function handleDragOver(event) {
    event.preventDefault();
    updateLineVisualFeedback(event.currentTarget);
  }

  function handleDragLeave(event) {
    const line = getLineFromElement(event.currentTarget);
    const liElements = line.element.children;
    for (let li of liElements) {
      if (li.classList.contains('dot-li')) {
        li.classList.remove('available', 'unavailable', 'undroppable');
      }
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    const line = getLineFromElement(event.currentTarget);
    handleDragLeave(event);

    const wordDataJSON = event.dataTransfer.getData("text/plain");
    if (!wordDataJSON) {
      console.error('No word data found in drop.');
      return;
    }
    const wordData = JSON.parse(wordDataJSON);
    draggedWordData = null;

    if (!wordData) {
      return;
    }

    const availableSyllables = line.maxSyllables - line.usedSyllables;

    if (availableSyllables >= wordData.syllables) {
      const wordText = wordData.text;
      line.usedSyllables += wordData.syllables;
      line.words.push(wordText);

      const firstAvailableIndex = getFirstAvailableDotIndex(line.element);

      for (let i = 0; i < wordData.syllables; i++) {
        line.element.removeChild(line.element.children[firstAvailableIndex]);
      }

      const wordLi = document.createElement('li');
      wordLi.textContent = wordText;
      wordLi.classList.add('word-li');
      line.element.insertBefore(wordLi, line.element.children[firstAvailableIndex] || null);
    } else {
      line.element.classList.add('undroppable'); // Add undroppable class if drop is not possible
    }
  }

  /**
   * Update visual feedback based on the dragged word and the line's available syllables
   * @param {HTMLElement} currentTarget 
   */
  function updateLineVisualFeedback(currentTarget) {
    const line = getLineFromElement(currentTarget);
    const wordData = draggedWordData;

    if (!wordData) {
      return;
    }

    const availableSyllables = line.maxSyllables - line.usedSyllables;
    const liElements = line.element.children;

    if (availableSyllables >= wordData.syllables) {
      const firstAvailableIndex = getFirstAvailableDotIndex(line.element);
      for (let i = 0; i < liElements.length; i++) {
        const li = liElements[i];
        if (li.classList.contains('dot-li')) {
          if (i >= firstAvailableIndex && i < firstAvailableIndex + wordData.syllables) {
            li.classList.add('available');
            li.classList.remove('unavailable', 'undroppable');
          } else {
            li.classList.remove('available', 'unavailable', 'undroppable');
          }
        }
      }
    } else {
      for (let li of liElements) {
        if (li.classList.contains('dot-li')) {
          li.classList.add('unavailable', 'undroppable'); // Add unavailable and undroppable
          li.classList.remove('available');
        }
      }
    }
  }

  /**
   * Get the index of the first available dot in the line
   * @param {HTMLElement} ulElement 
   * @returns {number}
   */
  function getFirstAvailableDotIndex(ulElement) {
    const liElements = ulElement.children;
    for (let i = 0; i < liElements.length; i++) {
      if (liElements[i].classList.contains('dot-li')) {
        return i;
      }
    }
    return liElements.length;
  }

  /**
   * Retrieve the line object based on the element
   * @param {HTMLElement} element 
   * @returns {Object}
   */
  function getLineFromElement(element) {
    const lineId = element.id;
    return lines[lineId];
  }

  /**
   * Remove a word from its current line and reset the line's state
   * @param {string} wordText 
   */
  function removeWordFromLines(wordText) {
    Object.values(lines).forEach(line => {
      const liElements = Array.from(line.element.children);
      for (let i = 0; i < liElements.length; i++) {
        const li = liElements[i];
        if (li.classList.contains('word-li') && li.textContent === wordText) {
          const indexInWords = line.words.indexOf(wordText);
          if (indexInWords !== -1) {
            line.words.splice(indexInWords, 1);
          }

          const wordData = WORDS.find(w => w.text === wordText);
          if (wordData) {
            line.usedSyllables -= wordData.syllables;

            line.element.removeChild(li);

            for (let j = 0; j < wordData.syllables; j++) {
              const dotLi = document.createElement('li');
              dotLi.classList.add('dot-li');
              line.element.insertBefore(dotLi, line.element.children[i + j] || null);
            }
          }

          break;
        }
      }
    });
  }

});
