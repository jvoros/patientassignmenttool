export default {
    handleUnauthorized(req, res, next) {
        console.log('hit handleUnauth');
        if (res.statusCode === 401) {
            console.log('401...');
          res.redirect('/login');
        } else {
          next();
        }
      }
}
