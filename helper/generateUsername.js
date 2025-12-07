// Username generator with uniqueness check
const generateUniqueUsername = async (existingSet, usersModel) => {
  const alpha = "ABCDEFGHIKLMNPQRSTUVWXYZ";
  const num = "123456789";

  while (true) {
    let username = "";

    // 2 random letters
    for (let i = 0; i < 3; i++) {
      username += alpha.charAt(Math.floor(Math.random() * alpha.length));
    }

    // 2 random digits
    for (let i = 0; i < 3; i++) {
      username += num.charAt(Math.floor(Math.random() * num.length));
    }

    // 1️⃣ Check duplicates in current import batch
    if (existingSet.has(username)) continue;

    // 2️⃣ Check duplicates in database
    const existInDB = await usersModel.findOne({
      where: { username },
      attributes: ["users_id"],
    });

    if (existInDB) continue;

    // If both checks passed → return it
    existingSet.add(username);
    return username;
  }
};

module.exports = generateUniqueUsername;
