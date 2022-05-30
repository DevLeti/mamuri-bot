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
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci"
    })
}