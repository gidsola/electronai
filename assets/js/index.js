
document.getElementById('inputField').addEventListener('keypress', (event) => {
  const inputField = document.getElementById('inputField');

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    document.getElementById('submitButton').click();
    inputField.value = '';
  };

});

document.getElementById('submitButton').addEventListener('click', async () => {
  const
    inputField = document.getElementById('inputField'),
    displayFrame = document.getElementById('displayFrame'),
    loadingBubble = document.getElementById('loadingBubble'),
    userInput = inputField.value;

  if (!userInput) return;

  const
    USERNAME = await window.processBridge.getUsername(),
    userDate = new Date().toLocaleString(),
    userMsg = '<div class="dateTime">' + USERNAME + ' @ ' + userDate + '</div>' + '<div class="message_output"><span>' + marked.parse(userInput) + '</span></div>';

  displayFrame.innerHTML = userMsg;

  loadingBubble.style.display = 'flex';
  const response = await AIRequest(userInput, USERNAME);
  loadingBubble.style.display = 'none';

  displayFrame.innerHTML = marked.parse(response);
  renderMathInElement(displayFrame);

  const
    newInner = marked.parse(displayFrame.innerHTML),
    aiMsg = '<div class="dateTime">Assistant @ ' + new Date().toLocaleString() + '</div>' + '<div class="message_output">' + newInner + '</div>';

  displayFrame.innerHTML = userMsg + aiMsg;
  hljs.highlightAll();

});

async function AIRequest(input, USERNAME) {
  return (await import('./ciDialogExchange.mjs')).ciDialogExchange(input, USERNAME);
};
