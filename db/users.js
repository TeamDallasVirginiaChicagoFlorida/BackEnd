const client = require("./index");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

async function createUser({ email, password, admin }) {
  const hashedPassword = await bcrypt.hash(password, SALT_COUNT);
  try {
    const {
      rows: [user],
    } = await client.query(
      `INSERT INTO users(email, password, admin)
                VALUES ($1, $2, $3)
                ON CONFLICT (email) DO NOTHING
                RETURNING*;
            `,
      [email, hashedPassword, admin]
    );
    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ email, password }) {
  try {
    const currentUser = await getUserByEmail(email);
    if (currentUser) {
      const hashedPassword = currentUser.password;

      const {
        rows: [user],
      } = await client.query(
        `
            SELECT *
            FROM users
            WHERE email=$1;
            `,
        [email]
      );
      let passwordsMatch = await bcrypt.compare(password, hashedPassword);

      if (passwordsMatch) {
        delete user.password;
        return user;
      } else {
        throw error;
      }
    }
  } catch (error) {
    throw error;
  }
}

async function getUserByEmail(userEmail) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT email, id, password FROM users,
                WHERE  email=$1;
                `,
      [userEmail]
    );
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `SELECT id, email FROM users,
                WHERE id= $1;
                `,
      [userId]
    );
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
    createUser, 
    getUser,
    getUserByEmail,
    getUserById,
}