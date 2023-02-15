// module.exports = function(fun){
//     return function(req, res, next){
//         fun(req, res, next).catch(next);
//     }
// }
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}