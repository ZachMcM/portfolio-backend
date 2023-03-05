require('dotenv').config()
const port = process.env.PORT || 8000

const { Octokit } = require('octokit')
const octokit = new Octokit({
    auth: process.env.GITHUB_AUTH_TOKEN
})

const express = require('express')
const app = express()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.get('/', async (req, res) => {
    const response = await octokit.request('GET /users/{username}/repos', {
        username: 'zachmcm',
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
        sort: 'updated',
    })
    const repoList = response.data.map(repo => {
        return {
            homepage: repo.homepage,
            name: repo.name,
            url: repo.html_url,
            description: repo.description,
            language: repo.language,
        }
    })
    res.json(repoList)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}...`)
})

