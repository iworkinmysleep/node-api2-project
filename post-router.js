const express = require("express");

const Posts = require("./data/db.js");
const { json } = require("express");

const router = express.Router();

// Post
router.post("/", (req, res) => {
	const { title, contents } = req.body;
	if (!title || !contents) {
		res.status(400).json({
			errorMessage: "Please provide title and contents for the post.",
		});
	}
	Posts.insert({ title, contents })
		.then((post) => {
			res.status(201).json(post);
		})
		.catch((err) => {
			res.status(500).json({
				error: "There was an error while saving the post to the database",
			});
		});
});

//Post comment
router.post("/:id/comments", (req, res) => {
	const postId = req.params.id;
	const { text } = req.body;
	Posts.findById(postId)
		.then((post) => {
			if (!post) {
				res
					.status(404)
					.json({ message: "The post with the specified ID does not exist." });
			} else if (!text) {
				res
					.status(400)
					.json({ errorMessage: "Please provide text for the comment." });
			} else {
				const comment = Posts.insertComment(text);
				res.status(201).json(comment);
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "There was an error while saving the comment to the database",
			});
		});
});

module.exports = router;
