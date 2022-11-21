const secret = require("./secret");

module.exports = {
    accounts: [
        {
            id: 1,
            type: 'demo',
            user: secret.user1,
            password: secret.password1
        },
        {   id: 2,
            type: 'demo',
            user: secret.user2,
            password: secret.password2
        },
        {   id: 3,
            type: 'demo',
            user: secret.user3,
            password: secret.password3
        },
        {
            id: 4,
            type: 'demo',
            user: secret.user4,
            password: secret.password4
        },
        {
            id: 5,
            type: 'demo',
            user: secret.user5,
            password: secret.password5
        }
    ]
}
