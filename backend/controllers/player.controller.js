const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');

const changeUsername = async (req, res) => {
  try {
    const { username } = req.body;
    const playerCookie = req.playerCookie;

    const user = await prisma.player.findUnique({
      where: {
        cookie: playerCookie,
      },
    });

    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    await prisma.player.update({
      where: {
        id: user.id,
      },
      data: {
        name: username,
      },
    });

    return res.status(200).send({ message: 'Username changed successfully' });
  } catch (error) {
    console.log(`Error in auth.controller changeUsername`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const playerCookie = req.playerCookie;

    const user = await prisma.player.findUnique({
      where: {
        cookie: playerCookie,
      },
    });

    if (!user) {
      return res.status(400).send({ message: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).send({ message: 'Invalid old password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.player.update({
      where: {
        cookie: playerCookie,
      },
      data: {
        password: hashedPassword,
      },
    });

    return res.status(200).send({ message: 'Password changed successfully' });
  } catch (error) {
    console.log(`Error in auth.controller changePassword`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  changeUsername,
  changePassword,
};
