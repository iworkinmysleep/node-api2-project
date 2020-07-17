const express = require("express");

const Posts = require("./data/db.js");


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
				error: "There was an error while saving the post to the database", err
			});
		});
});

//Post comment
router.post("/:id/comments", (req, res) => {
	const postId = req.params.id;
	const newComment = req.body;
	newComment.post_id = Number(postId);
	if (!newComment.text) {
		res.status(400).json({ error: "Please provide text field." });
	} else {
		Posts.findPostComments(postId)
			.then((comment) => {
				if (comment) {
					Posts.insertComment(newComment);
					res.status(201).json(newComment);
				} else {
					res
						.status(404)
						.json({ error: "The post with the specified ID does not exist." });
				}
			})
			.catch((err) => {
				res.status(500).json({
					error: "There was an error while saving the comment to the database.",
					err,
				});
			});
	}
});

// Get
router.get("/", (req, res) => {
	Posts.find(req.query)
		.then((posts) => {
			res.status(200).json(posts);
		})
		.catch((err) => {
			res
				.status(500)
				.json({ error: "There was an error retrieving posts", err });
		});
});

// Get by Id
router.get("/:id", (req, res) => {
	Posts.findById(req.params.id)
		.then((post) => {
			if (post) {
				res.status(200).json(post);
			} else {
				res
					.status(404)
					.json({ error: "The post with the specified ID does not exist" });
			}
		})
		.catch((err) => {
			res
				.status(500)
				.json({ error: "There was an error connecting to the database.", err });
		});
});

// Get comment by ID
router.get("/:id/comments", (req, res) => {
	Posts.findCommentById(req.params.id)
		.then((comment) => {
			if (comment) {
				res.status(200).json(comment);
			} else {
				res
					.status(404)
					.json({ message: "The post with the specified ID does not exist." });
			}
		})
		.catch((err) => {
			res.status(500).json({
				error: "The comments information could not be retrieved.",
				err,
			});
		});
});

// Delete
router.delete("/:id", (req, res) => {
	Posts.remove(req.params.id)
		.then((post) => {
			if (post) {
				res.status(200).json(post);
			} else {
				res
					.status(404)
					.json({ message: "The post with the specified ID does not exist." });
			}
		})
		.catch((err) => {
			res.status(500).json({ error: "The post could not be removed", err });
		});
});

//Update
router.put("/:id", (req, res) => {
	const postUpdate = req.body;
	const postId = req.params.id;

	Posts.findById(postId)
		.then(() => {
			if (!postUpdate.title || !postUpdate.contents) {
				res
					.status(400)
					.json({
						errorMessage: "Please provide title and contents for the post.",
					});
			} else {
				Posts.update(postId, postUpdate)
					.then(() => {
						res.status(200).json(postUpdate);
					})
					.catch((err) => {
						res
							.status(404)
							.json({
								message: "The post with the specified ID does not exist.",
								err,
							});
					});
			}
		})
		.catch((err) => {
			res
				.status(500)
				.json({ error: "The post information could not be modified.", err });
		});
});

module.exports = router;
