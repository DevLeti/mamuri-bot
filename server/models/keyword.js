module.exports = (sequelize, DataTypes) => {

    return sequelize.define("keyword", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        keyword: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        charset: "utf8",
        collate: "utf8_general_ci"
    })
}