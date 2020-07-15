const express = require("express");

const postRouter = require('./post-router.js');

const server = express();

server.use(express.json());

server.use('/api/posts', postRouter)

server.get("/", (req, res) => {
	res.send(`<h2>Express Router project</h2>`);
});


module.exports = server;