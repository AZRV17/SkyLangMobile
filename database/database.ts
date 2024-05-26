import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('courseDB.db');

/**
 * Инициализация базы данных
 */
export const initDB = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS completed_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            exercise_id INTEGER
        );
    `);
};

/**
 * Добавление выполненного задания
 * @param userId
 * @param exerciseId
 */
export const insertCompletedTask = (userId: string | undefined, exerciseId: number) => {
    try {
        // @ts-ignore
        db.runSync(`INSERT INTO completed_tasks (user_id, exercise_id) VALUES (?, ?);`, userId, exerciseId);
    } catch (error) {
        console.log(error);
    }
};

/**
 * Проверка выполненного задания
 * @param userId
 * @param exerciseId
 * @param callback
 */
export const isTaskCompleted = (userId: string | undefined, exerciseId: number, callback: (completed: boolean) => void) => {
    // @ts-ignore
    const completed = db.getFirstSync(`SELECT * FROM completed_tasks WHERE user_id = ? AND exercise_id = ?;`, userId, exerciseId);

    if (completed) {
        callback(true);
    } else {
        callback(false);
    }
};
