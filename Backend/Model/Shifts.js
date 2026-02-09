/**
 * MODELO: SHIFTS (Turnos Diarios)
 * Representa un turno específico en una fecha concreta.
 * Maneja estados (Borrador/Publicado) y bloqueos para la planificación.
 */
module.exports = (sequelize, Sequelize) => {
    const shifts = sequelize.define("shifts", {
        date: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },
        idTimeShift: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        state: {
            type: Sequelize.ENUM('BORRADOR', 'PUBLICADO'),
            defaultValue: 'BORRADOR'
        },
        locked: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        }
    });

    /**
    *  ---------------------------------------------------------------------------------
    * |                                 RELACIONSHIPS                                   |
    *  --------------------------------------------------------------------------------
    **/

    shifts.associate = (models) => {
        shifts.belongsTo(models.timeShifts, {
            foreignKey: 'idTimeShift',
            targetKey: 'id',
            as: 'timeShift',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        shifts.hasMany(models.workerShift, {
            foreignKey: 'idShift',
            sourceKey: 'id',
            as: 'workerShifts',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    }

    return shifts;

};
