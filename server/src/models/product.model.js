module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define(
    "Product",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      tableName: "products",
      timestamps: true,
    }
  );

  Product.associate = (models) => {
    Product.hasMany(models.Banner, {
      foreignKey: "productId",
      as: "banners",
    });
  };

  return Product;
};
