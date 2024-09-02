function downloadOutput() {
  const outputContent = outputText.textContent;
  const blob = new Blob([JSON.stringify(outputContent)], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'output.txt';
  link.click();
  URL.revokeObjectURL(url);
}
const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', downloadOutput);