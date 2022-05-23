module.exports = (sequelize, DataTypes) => {

    return sequelize.define("user", {
        id: {
            type: DataTypes.INT,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.INT,
            allowNull: false
        }
    })
}