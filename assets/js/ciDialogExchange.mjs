import Config from '../../config.mjs';

/**
 * Send a user query to the OnSocket API and return the response.
 * @param {string} userQuery 
 * @returns {Promise<string | Error>}
 */
async function ciDialogExchange(userQuery) {
  try {
    const
      url = 'https://onsocket.com/api/v1/chat/completions',
      headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': Config.osauth
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

  } catch (error) { 
    console.error('Error sending message:', error);
    return error;
  }
};
export { ciDialogExchange };
