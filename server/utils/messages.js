const moment = require('moment')
function formatMessages(username, text){
    return {
        username,
        text
    };
}
module.exports = formatMessages;