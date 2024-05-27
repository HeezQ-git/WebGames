const generateToken = require('../lib/generateToken');
const bcrypt = require('bcrypt');
const prisma = require('../lib/prisma');

const signUp = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).send({ message: 'Passwords do not match' });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (user) {
      return res.status(400).send({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    if (newUser) {
      generateToken(newUser._id, res);

      return res.status(201).send({ message: 'User created successfully' });
    }

    return res.status(400).send({ message: 'Invalid user data' });
  } catch (error) {
    console.log(`Error in auth.controller signUp`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const signIn = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.password || ''
    );

    if (!isPasswordValid || !user) {
      return res.status(400).send({ message: 'Invalid credentials' });
    }

    generateToken(user.id, res);

    return res.status(200).send({ message: 'User signed in successfully' });
  } catch (error) {
    console.log(`Error in auth.controller signIn`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

const signOut = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).send({ message: 'User signed out successfully' });
  } catch (error) {
    console.log(`Error in auth.controller signOut`, error.message);
    res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
};
