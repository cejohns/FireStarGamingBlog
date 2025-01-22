module.exports = (req, res, next) => {
    // Redirect HTTP to HTTPS
    if (req.protocol === 'http') {
        console.log(`Redirecting HTTP to HTTPS for: ${req.url}`);
        return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
};
