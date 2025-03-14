
document.getElementById('inputField').addEventListener('keypress', (event) => {
  const inputField = document.getElementById('inputField');
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('submitButton').click();
    inputField.value = '';
  }
});

document.getElementById('submitButton').addEventListener('click', async () => {
  const inputField = document.getElementById('inputField');
  const displayFrame = document.getElementById('displayFrame');
  const loadingBubble = document.getElementById('loadingBubble');
  const userInput = inputField.value;

  if (!userInput) return;

  loadingBubble.style.display = 'flex';

  const
    USERNAME = await window.processBridge.getUsername(),
    response = await AIRequest(userInput, USERNAME);

  loadingBubble.style.display = 'none';

  displayFrame.innerHTML = response;

  renderMathInElement(document.body);

  displayFrame.innerHTML = marked.parse(displayFrame.innerHTML);

  hljs.highlightAll();

});

async function AIRequest(input, USERNAME) {
  return (await import('./ciDialogExchange.mjs')).ciDialogExchange(input, USERNAME);
}


