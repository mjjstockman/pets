const express = require('express');
const app = express();

const fs = require('fs/promises');

app.get('/api/owners/:id', (req, res) => {
  const owner = req.params;
  console.log(owner);
  fs.readFile(
    `${__dirname}/be-pets-and-owners/data/owners/o${owner.id}.json`,
    'utf-8'
  )
    .then((ownerData) => {
      const parsedOwnerData = JSON.parse(ownerData);
      res.status(200).send({ owner: parsedOwnerData });
    })
    .catch((err) => {
      res.status(400).send({ msg: "Couldn't get owner" });
    });
});

app.get('/api/owners', (req, res) => {
  fs.readdir(`${__dirname}/be-pets-and-owners/data/owners`)
    .then((ownersFiles) => {
      const getOwnersPromises = ownersFiles.map((file) => {
        return fs
          .readFile(
            `${__dirname}/be-pets-and-owners/data/owners/${file}`,
            'utf-8'
          )
          .then((ownersData) => {
            const parsedOwnersData = JSON.parse(ownersData);
            return parsedOwnersData;
          });
      });

      return Promise.all(getOwnersPromises);
    })
    .then((ownersData) => {
      res.status(200).send({ owners: ownersData });
    })
    .catch((err) => {
      console.log(err, 'err!!!!!!!!!!!!');
    });
});

// GET /owners/:id/pets
app.get('/api/owners/:id/pets', (req, res) => {
  const { id: ownerId } = req.params;
  fs.readdir(`${__dirname}/be-pets-and-owners/data/pets`)
    .then((petsFiles) => {
      const getPetsPromises = petsFiles.map((file) => {
        return fs
          .readFile(
            `${__dirname}/be-pets-and-owners/data/pets/${file}`,
            'utf-8'
          )
          .then((petsData) => {
            return JSON.parse(petsData);
          });
      });
      return Promise.all(getPetsPromises);
    })
    .then((petsData) => {
      const ownersPets = petsData.filter((pet) => pet.owner === `o${ownerId}`);
      res.status(200).send({ ownersPets });
    })
    .catch((err) => {
      console.log(err, 'errrrrrr!!!!!!');
    });
});

module.exports = app;
