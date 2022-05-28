module.exports = (sequelize, DataTypes) => {

    return sequelize.define("user", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        charset: "utf8",
        collate: "utf8_general_ci"
    })
}