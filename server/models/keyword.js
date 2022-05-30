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
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci"
    })
}