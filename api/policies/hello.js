
module.exports = function(req, res, next) {
  
    FlashService.error(req, 'hello friend!');
    return next();

};