// server.js
const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/trigger-pipeline', async (req, res) => {
    const { inputData } = req.body;

    try {
        const response = await axios.post(
            'https://api.github.com/repos/<username>/<repo>/actions/workflows/<workflow_id>/dispatches',
            {
                ref: 'feature-form-automatization',  // Git branch where the workflow should run
                inputs: {
                    inputData: inputData  // Pass form data as input to the workflow
                }
            },
            {
                headers: {
                    'Authorization': `token <YOUR_GITHUB_TOKEN>`,
                    'Accept': 'application/vnd.github.v3+json',
                }
            }
        );

        res.status(200).json({ message: 'GitHub Actions pipeline triggered successfully!' });
    } catch (error) {
        console.error('Error triggering pipeline:', error);
        res.status(500).json({ message: 'Failed to trigger GitHub Actions pipeline' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});