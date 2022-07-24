'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      played: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      wins: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      singleCage: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      doubleCage: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      tripleCage: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      quadroCage: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      }
    });

    await queryInterface.addConstraint('stats', {
        fields: ['user_id'],
        type: 'foreign key',
        name: 'user_references',
        references: {table: 'users', field: 'id'},
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('User');
  }
};