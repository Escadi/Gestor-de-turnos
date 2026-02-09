const db = require("../Model");
const fs = require("fs");
const path = require("path");

const generateSQLBackup = async () => {
    let sqlBackup = `-- Time Beep Database Backup\n`;
    sqlBackup += `-- Generated at: ${new Date().toISOString()}\n\n`;
    sqlBackup += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;

    // 1. Get all tables
    const [tables] = await db.sequelize.query("SHOW TABLES");
    const tableNames = tables.map(t => Object.values(t)[0]);

    for (const tableName of tableNames) {
        // 2. Get CREATE TABLE statement
        const [createTableResult] = await db.sequelize.query(`SHOW CREATE TABLE \`${tableName}\``);
        const createTableSQL = createTableResult[0]["Create Table"];

        sqlBackup += `-- Table structure for table \`${tableName}\`\n`;
        sqlBackup += `DROP TABLE IF EXISTS \`${tableName}\`;\n`;
        sqlBackup += `${createTableSQL};\n\n`;

        // 3. Get all rows for the table
        const [rows] = await db.sequelize.query(`SELECT * FROM \`${tableName}\``);

        if (rows.length > 0) {
            sqlBackup += `-- Dumping data for table \`${tableName}\`\n`;

            // Chunk inserts for better performance if needed, but for small-medium DBs simple inserts are fine
            for (const row of rows) {
                const columns = Object.keys(row).map(c => `\`${c}\``).join(", ");
                const values = Object.values(row).map(v => {
                    if (v === null) return "NULL";
                    if (typeof v === "string") {
                        // Escape single quotes for SQL
                        return `'${v.replace(/'/g, "''")}'`;
                    }
                    if (v instanceof Date) {
                        return `'${v.toISOString().slice(0, 19).replace('T', ' ')}'`;
                    }
                    return v;
                }).join(", ");

                sqlBackup += `INSERT INTO \`${tableName}\` (${columns}) VALUES (${values});\n`;
            }
            sqlBackup += `\n`;
        }
    }

    sqlBackup += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    return sqlBackup;
};

/**
 * Genera y descarga un backup SQL de la base de datos.
 * Frontend: settings.page.ts
 */
exports.downloadBackup = async (req, res) => {
    try {
        const sql = await generateSQLBackup();
        const filename = `backup_${new Date().getTime()}.sql`;

        res.setHeader('Content-Type', 'text/sql');
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        res.send(sql);
    } catch (error) {
        console.error("Error generating backup:", error);
        res.status(500).send({ message: "Error al generar la copia de seguridad" });
    }
};

/**
 * Genera y guarda un backup SQL localmente en el servidor.
 * Frontend: settings.page.ts
 */
exports.saveBackupLocally = async (req, res) => {
    try {
        const sql = await generateSQLBackup();
        const databaseDir = path.join(__dirname, "..", "Database");

        if (!fs.existsSync(databaseDir)) {
            fs.mkdirSync(databaseDir, { recursive: true });
        }

        const filename = `backup_local_${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
        const filePath = path.join(databaseDir, filename);

        fs.writeFileSync(filePath, sql);

        res.status(200).send({
            message: "Copia de seguridad guardada localmente con éxito",
            filename: filename,
            path: filePath
        });
    } catch (error) {
        console.error("Error saving backup localy:", error);
        res.status(500).send({ message: "Error al guardar la copia de seguridad localmente" });
    }
};
