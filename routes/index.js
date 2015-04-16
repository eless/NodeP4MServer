
/* GET home page. */
exports.router = function(req, res){
  res.render('index', { user: req.user,
                        title: 'P4M develop test'
                      }
  );
};

