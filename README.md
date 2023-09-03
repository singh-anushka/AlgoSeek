# AlgoSeek

AlgoSeek is a search engine designed to search DSA (data structures and algorithms) problems across various CP platforms.
It has a user-friendly experience and finds search results in a few seconds. The search engine uses the BM 25 similarity function to estimate the relevance of documents in the database to the given search query.
A Node.js + Express server runs the search engine. HTML, BootStrap CSS, and EJS are used for the frontend use. The database is created by scrapping the web using Beautiful Soup and Selenium in Python. For storage, MongoDB—a specialized search engine designed exclusively for searching competitive programming questions across multiple CP platforms.

### Steps to build the code locally

* Download and extract all the files from the git repo.
* Open the downloaded folder inside the terminal.
* Run the following code:
```
npm install
npm run start
```
* Wait for some time until the localhost port is setup and is connected to the database. Once the port is setup, 'connected' will be displayed on the terminal.
* The localhost port is ready to use. You can visit 'localhost:3000/' in your browser to visit the site.
