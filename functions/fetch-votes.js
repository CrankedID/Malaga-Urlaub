const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { NETLIFY_API_TOKEN, NETLIFY_SITE_ID } = process.env;
    const API_URL = `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/submissions`;

    try {
        const response = await fetch(`${API_URL}?form_name=vote`, {
            headers: {
                'Authorization': `Bearer ${NETLIFY_API_TOKEN}`
            }
        });

        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch votes' })
        };
    }
};