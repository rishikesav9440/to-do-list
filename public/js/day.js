
exports.getDate = function(){
    
    var options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    }
    var today = new Date().toLocaleDateString("en-US",options);
    return today
}
exports.getDay = function(){
    
    var options = {
        weekday : "long",
    }
    var today = new Date().toLocaleDateString("en-US",options);
    return today
}