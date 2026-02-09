/**
 * SCRIPT: ADD HIERARCHY FIELDS
 * Añade las columnas 'parentId' y 'order' a la tabla 'nameFuction' para soportar jerarquía de puestos.
 * Uso: Ejecutar manualmente con 'node add_hierarchy_fields.js'
 */
const db = require('./Model');

async function addHierarchyFields() {
    try {
        console.log('🔄 Añadiendo campos de jerarquía a la tabla de roles (nameFuction)...');

        // Añadir campo parentId
        try {
            await db.sequelize.query(`
                ALTER TABLE nameFuction 
                ADD COLUMN parentId INTEGER DEFAULT NULL,
                ADD CONSTRAINT fk_parent_role 
                FOREIGN KEY (parentId) REFERENCES nameFuction(id) ON DELETE SET NULL
            `);
            console.log('✅ Campo parentId añadido.');
        } catch (err) {
            console.log('⚠️  Campo parentId ya existe o error:', err.original ? err.original.sqlMessage : err.message);
        }

        // Añadir campo order
        try {
            await db.sequelize.query(`
                ALTER TABLE nameFuction 
                ADD COLUMN \`order\` INTEGER DEFAULT 0
            `);
            console.log('✅ Campo order añadido.');
        } catch (err) {
            console.log('⚠️  Campo order ya existe o error:', err.original ? err.original.sqlMessage : err.message);
        }

        console.log('✅ Proceso finalizado');

        // Verificar
        const [results] = await db.sequelize.query(`
            DESCRIBE nameFuction
        `);

        console.log('\n📋 Estructura actual de la tabla nameFuction:');
        results.forEach(col => {
            console.log(`  - ${col.Field} (${col.Type})`);
        });

    } catch (error) {
        console.error('❌ Error general:', error);
    } finally {
        await db.sequelize.close();
    }
}

addHierarchyFields();
