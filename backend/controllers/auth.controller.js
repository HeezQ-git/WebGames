const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');
const uuidv4 = require('uuid').v4;

const signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    let playerCookie = req.playerCookie;

    if (!playerCookie) playerCookie = uuidv4();

    const foundUser = await prisma.player.findUnique({
      where: {
        cookie: playerCookie,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (foundUser) {
      await prisma.player.update({
        where: {
          id: foundUser.id,
        },
        data: {
          name: username,
          password: hashedPassword,
        },
      });
    } else {
      await prisma.player.create({
        data: {
          name: username,
          password: hashedPassword,
          cookie: playerCookie,
        },
      });
    }

    return res
      .status(201)
      .send({ message: 'User signed up successfully', playerCookie });
  } catch (error) {
    console.log(`Error in auth.controller signUp`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const signIn = async (req, res) => {
  try {
    const { asGuest, username, password, oldPid } = req.body;

    if (asGuest) {
      const playerId = uuidv4();

      const player = await prisma.player.create({
        data: {
          name: `Player-${playerId.substring(0, 8)}`,
          cookie: playerId,
        },
      });

      return res.status(200).send({
        message: 'User signed in as guest',
        playerCookie: playerId,
        profanesAllowed: player.profanesAllowed,
      });
    }

    const player = await prisma.player.findUnique({
      where: {
        name: username,
      },
    });

    const isPasswordValid = await bcrypt.compare(
      password,
      player?.password || ''
    );

    if (!isPasswordValid || !player) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    // avoid unnecessary guest accounts
    if (oldPid) {
      const foundPlayer = await prisma.player.findUnique({
        where: {
          cookie: oldPid,
        },
      });

      if (foundPlayer) {
        const foundGames = await prisma.game.findMany({
          where: {
            players: {
              some: {
                playerId: foundPlayer.id,
              },
            },
          },
        });

        for (const game of foundGames) {
          await prisma.playerGame.deleteMany({
            where: {
              playerId: foundPlayer.id,
              gameId: game.id,
            },
          });

          await prisma.game.delete({
            where: {
              id: game.id,
            },
          });
        }

        await prisma.player.delete({
          where: {
            id: foundPlayer.id,
          },
        });
      }
    }

    return res.status(200).send({
      message: 'User signed in successfully',
      playerCookie: player.cookie,
      profanesAllowed: player.profanesAllowed,
    });
  } catch (error) {
    console.log(`Error in auth.controller signIn`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const checkUsername = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await prisma.player.findUnique({
      where: {
        name: username,
      },
    });

    if (user) {
      return res
        .status(200)
        .send({ exists: true, message: 'Username already exists' });
    }

    return res
      .status(200)
      .send({ exists: false, message: 'Username is available' });
  } catch (error) {
    console.log(`Error in auth.controller checkUsername`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  signUp,
  signIn,
  checkUsername,
};
