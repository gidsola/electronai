import Config from './config.mjs';

async function ciDialogExchange(userQuery) {
  try {
    const
      url = 'https://host-addy.com/api/ai/chat/completions',
      headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'onsocketauth': Config.osauth
      },
      body = JSON.stringify({
        type: 'history',
        collection: 'goodsie',
        modelProvider: 'mistral',
        modelApiKey: Config.Mistral.api_key,
        completionOptions: Config.Mistral.completionOptions,
        params: userQuery
      }),
      response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: body
      });

    return response.ok
      ? await response.text()
      : new Error(`HTTP error! status: ${response.status}`);

  } catch (error) { console.error('Error sending message:', error); }
};
export { ciDialogExchange };
