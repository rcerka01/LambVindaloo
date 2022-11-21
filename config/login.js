const secret = require("./secret");

module.exports = {
    accounts: [
        // permanent
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
        },

        // Kiril
        {
            id: 15,
            type: 'demo',
            user: secret.user15,
            password: secret.password15
        },
        {   id: 16,
            type: 'demo',
            user: secret.user16,
            password: secret.password16
        },
        {   id: 17,
            type: 'demo',
            user: secret.user17,
            password: secret.password17
        },
        {
            id: 18,
            type: 'demo',
            user: secret.user18,
            password: secret.password18
        },,
        {
            id: 19,
            type: 'demo',
            user: secret.user4,
            password: secret.password4
        },
    ]
}
