module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define(
    "Banner",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subtitle: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "banners",
      timestamps: true,
    }
  );

  Banner.associate = (models) => {
    Banner.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product",
    });
  };

  return Banner;
};
