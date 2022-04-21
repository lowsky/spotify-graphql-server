import express from "express";

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Spotify Graphql Server' });
});

export default router;
