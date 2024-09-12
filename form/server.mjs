import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.post('/trigger-pipeline', async (req, res) => {
    const { inputData } = req.body;

    const token = process.env.GITHUB_TOKEN; // Use environment variable instead
    const owner = 'AJPanizza'; // Replace with your GitHub username
    const repo = 'testing_CICD'; // Replace with your repository name
    const workflow_id = 'terraform.yml'; // Replace with your workflow file name

    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/${workflow_id}/dispatches`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ref: 'main', // Replace with the branch you want to trigger the workflow on
                inputs: {
                    inputData: inputData
                }
            }),
        });
        console.log(inputData);
        
        if (response.ok) {
            res.json({ message: 'GitHub Actions pipeline triggered successfully!' });
        } else {
            const errorData = await response.json();
            res.status(response.status).json({ message: errorData.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});