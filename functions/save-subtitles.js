const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const { NETLIFY_API_TOKEN, NETLIFY_SITE_ID } = process.env;
    const API_URL = `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/submissions`;

    try {
        if (event.httpMethod === 'POST') {
            // Untertitel speichern
            const { name, subtitle } = JSON.parse(event.body);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NETLIFY_API_TOKEN}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    form_name: 'subtitles',
                    data: { name, subtitle }
                })
            });

            if (!response.ok) {
                throw new Error('Fehler beim Speichern des Untertitels');
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Untertitel gespeichert' })
            };
        } else if (event.httpMethod === 'GET') {
            // Untertitel abrufen
            const response = await fetch(`${API_URL}?form_name=subtitles`, {
                headers: {
                    'Authorization': `Bearer ${NETLIFY_API_TOKEN}`
                }
            });

            const submissions = await response.json();
            const subtitles = {};

            submissions.forEach(submission => {
                const { name, subtitle } = submission.data;
                subtitles[name] = subtitle;
            });

            return {
                statusCode: 200,
                body: JSON.stringify(subtitles)
            };
        } else {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: 'Methode nicht erlaubt' })
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Serverfehler' })
        };
    }
};