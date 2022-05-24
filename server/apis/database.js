let database = module.exports = {};

const db = require("../models")
const User = db.user
const Keyword = db.keyword
const UserKeyword = db.userKeyword


database.addKeyword = async function(keyword, userId) {

    const u = await User.findOrCreate({
        where: {
            userId: userId
        }
    })

    const k = await Keyword.findOrCreate({
        where: {
            keyword: keyword
        }
    })

    await UserKeyword.findOrCreate({
        where: {
            userId: u[0].id,
            keywordId: k[0].id
        }
    })
}

database.getKeywordsByUserId = async function(userId) {
    const keywords = await Keyword.findAll({
        attributes: ['keyword'],
        where: {
            '$user.userId$': userId
        },
        include: [{
            attributes: [],
            model: User,
            as: 'user'
        }],
        raw: true
    })

    let result = []
    for (let i = 0; i < keywords.length; i++) {
        result.push(keywords[i].keyword)
    }

    return result
}
