var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/aliens-db');
var Aliens = db.get('alien');
var bcrypt = require('bcrypt')


/* GET home page. */
router.get('/', function(req, res, next) {
  Aliens.find({}, function(err, data){
    res.render('aliens/index', { title: 'Aliens', allAliens: data });
  })
});

router.get('/aliens/signup', function(req, res, next) {
  res.render('aliens/signup', { title: 'Aliens Sign Up' });
});

router.post('/aliens/signup', function(req, res, next) {
    var hash = bcrypt.hashSync(req.body.password, 8)
    Aliens.findOne({name:req.body.name, phone:req.body.phone}).then(function(alien){
      if (alien === ''){
        res.render('aliens/signup', {error: 'you gotta type somethin dude'})
      } 
      if(alien){
        res.render('aliens/signup', {error: 'Invalid Name, phone, password'})
      }else {
        Aliens.insert({name:req.body.name, phone:req.body.phone, password:hash}).then(function(alien){
          res.redirect('/aliens/signin')
        })
      }
    })
});

router.post('/aliens/signout', function(req, res, next) {
  req.session=null
  res.redirect('/');
});

router.get('/aliens/signin', function(req, res, next) {
  res.render('aliens/signin', { title: 'Show Aliens' });
});

router.post('/aliens/signin', function(req, res, next){
        console.log('xxxxxxxxxx')
  Aliens.findOne({name:req.body.name}).then(function(alien){
    if(alien){
      if (bcrypt.compareSync(req.body.password, alien.password)){
        req.session.alien = alien
        res.redirect('/aliens/dash')
      } else {
        console.log('ooooooooooo')
        res.render('aliens/signin', {error: 'Invalid Name/password'})
      }
    }
  })
})

router.get('/aliens/dash', function(req, res, next) {
  Aliens.find({}, function(err, data){
    res.render('aliens/dash', { title: 'Aliens', allAliens: data });
  })
});

router.get('/aliens/:id', function(req, res, next) {
  Aliens.findOne({_id: req.params.id}, function(err, data){
    res.render('aliens/show', { title: 'Show Alien', thisAlien: data });
  })
});



module.exports = router;