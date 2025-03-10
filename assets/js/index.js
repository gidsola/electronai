document.getElementById('submitButton').addEventListener('click', async () => {
    const inputField = document.getElementById('inputField'),
      displayFrame = document.getElementById('displayFrame'),
      loadingBubble = document.getElementById('loadingBubble'),
      userInput = inputField.value;
    if (!userInput) return;

    loadingBubble.style.display = 'flex';
    const response = await AIRequest(userInput);
    loadingBubble.style.display = 'none';

    displayFrame.innerHTML = marked.parse(response);
    hljs.highlightAll();
  });

  async function AIRequest(input) {
    return (await import('./ciDialogExchange.mjs')).ciDialogExchange(input);
  };
