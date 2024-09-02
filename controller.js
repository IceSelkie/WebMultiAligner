const keywordInput = document.getElementById('keyword');
const textInput = document.getElementById('text');
const output = document.getElementById('output');
const outputText = document.getElementById('output-text');

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlight() {
  const lines = (
      textInput.value
        .split(/\n+/)
        .map(line => line.replaceAll(/\s+/g,""))
        .filter(line => line !== '')
    );
  const keyword = (
      keywordInput.value.replaceAll(/\s+/g,"")
      ||
      lines[0]
      ||
      'ATGGATTCTAGAACAGTTGGTATATTAGGAGGGGGACAATTGGGACGTATGATTGTTGAGGCAGCAAACAGGCTCAACATTAAGACGGTAATACTAGATGCTGAAAATTCTC'
    );

  if (lines.length === 0) {
    outputText.textContent = '';
    outputText.appendChild(document.createElement('br'));
    // Disable download button
    downloadBtn.classList.add('disabled-btn');
    downloadBtn.disabled = true;
    return;
  }

  const [master, alignments] = alignMany(keyword,lines)
  outputText.textContent = '';

  alignments.forEach(line => {
    changes = [...line].map((char,i)=>
        (((master[i]=="-")^(master[i-1]=="-"))
          || ((char=="-")^(line[i-1]=="-"))
          || (master[i]==char)^(master[i-1]==line[i-1]))
        ? ["\u200B"+char,"\u200B"+master[i]]
        : [char,master[i]]);

    masterParts = changes.map(a=>a[1]).join("").split("\u200B");
    lineParts = changes.map(a=>a[0]).join("").split("\u200B");

    lineParts.forEach((partL, index) => {
      const partM = masterParts[index];
      if (partL == partM) {
        if (partL[0]=="-")
          // Put spaces if both are deletions: this is when another line has an insertion here.
          // This space is a "nbsp" or non-breaking space: it prevents line breaks here while visually being blank.
          outputText.appendChild(document.createTextNode("\u00A0".repeat(partL.length)));
        else
          outputText.appendChild(document.createTextNode(partL));
      } else if (partL[0]=="-") {
        const markElement = document.createElement('mark');
        // Add "Word-Joiner" after dashes to prevent line breaks after them, and prevent font from joining long dashes.
        markElement.textContent = partL.replaceAll("-","-\u2060");
        markElement.classList.add("deletion");
        outputText.appendChild(markElement);
      } else if (partM[0]=="-") {
        const markElement = document.createElement('mark');
        markElement.textContent = partL;
        markElement.classList.add("insertion");
        outputText.appendChild(markElement);
      } else {
        const markElement = document.createElement('mark');
        markElement.textContent = partL;
        markElement.classList.add("delta");
        outputText.appendChild(markElement);
      }
    });
    outputText.appendChild(document.createElement('br'));
    // Enable download button
    downloadBtn.classList.remove('disabled-btn');
    downloadBtn.disabled = false;
  });
}

keywordInput.addEventListener('input', highlight);
textInput.addEventListener('input', highlight);