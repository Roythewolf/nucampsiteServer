const express = require("express");
const favoriteRouter = express.Router();
const  Favorite = require('../models/favorite')
const authenticate = require('../authenticate')
const cors = require('./cors');

favoriteRouter.route("/")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//get
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites')
      .then(favorite => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(favorite);
      })
      .catch((err) => next(err));
  })
  //need admin//
  //post
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
      .then(favorite => {
          if (favorite) {
              req.body.forEach(fav =>{
                  if(!favorite.campsites.includes(fav._id)) {
                      favorite.campsites.push(fav.id_id);
                  }
                });
                favorite.save()
                .then(favorite => {
                console.log("Favorite Created ", favorite);
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(favorite);
            })
            .catch((err) => next(err));
            }else {
            Favorite.create({ user: req.user._id, campsites: req.body})
            .then(favorite => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
            })
            }
    }).catch(err => next(err));

})

  //put!
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
})
  //need admin//
  //delete
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
      .then(favorite => {
          if (favorite) {
              favorite.remove()
              .then(favorite =>{
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
            }).catch((err) => next(err));// this is to catch errors if we can't remove a favorite
        }
    }).catch((err) => next(err)); // this is to catch errors if don't find a favorite
});


favoriteRouter.route("/:campsiteId")
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
//get
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
        res.statusCode = 403;
        res.end(`Get operation not supported on /favorites/${req.params.campsiteId}`);
})
  //post
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
    .then(favorite => {
        if (favorite) {
                if(!favorite.campsites.includes(fav._id)) {
                    favorite.campsites.push(fav.id_id);
                    favorite.save()
                .then(favorite => {
                    console.log("Favorite Created ", favorite);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorite);
                }).catch((err) => next(err));
                } else {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.send('This campsite is already a favorite');
                }
         } else {
            Favorite.create({ user: req.user._id, campsites: req.body})
            .then(favorite => {
             res.statusCode = 200;
             res.setHeader("Content-Type", "application/json");
                res.json(favorite);
        }).catch(err => next(err));
    }
  }).catch(err => next(err));
})

  //need admin//
  //put
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
})
  //need admin//
  //delete
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorite.findOne({ user: req.user._id })
        .then((favorite) => {
        if (favorite) {
            favorite.campsites.splice(favorite.campsites.indexOf(req.params.campsiteId), 1);
            favorite.save()
            .then((favorite) => {
            console.log('favorite campsite deleted', favorite)
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
            }).catch((err) => next(err));
        }
        else{
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.json(favorite);
        }
    }).catch((err) => next(err)); // this catches your error
});


module.exports = favoriteRouter;
