const Dog = require("../models/dogModel");
const monError = require("../models/errorModel");
const helper  = require("../helpers/Helper");
const domain = process.env.DOMAIN;


class DogController {
  async findAll(req, res) {

    try {

      const token = req.cookies.jwt;
      console.log(token);
      //Authenticate function
      helper.authenticate(req.cookies)

      //maybe find the user by id and check if the role is admin for other routes?

      //create database connection
      const dogs = await Dog.find();
      res.status(200).json(dogs);
      //close connection
    } catch (err) {
      const errorAnswer = helper.createNewMonError(err, 500, "Error connecting to db");
      res.status(500).json(errorAnswer);
    }
  }

  async findOneDogByID(req, res) {
    try {

      console.log(req.cookies)
      //Authenticate functionality
      const {isAdmin} = helper.authenticate(req.cookies)

      if (isAdmin) {
        const dog = await Dog.findById(req.params.id);
        console.log(dog)
        res.status(200).json(dog);
      }

      res.status(401).json({message: "Unauthorized"});
    } catch (err) {
      const errorAnswer = helper.createNewMonError(err, 404, "Dog not found");
      res.status(404).json(errorAnswer);
    }
  }

  async countAllDogs(req, res) {
    try {
      console.log("countAllDogs");
      const count = await Dog.countDocuments();
      console.log(count);
      res.status(200).json({count: count});
    } catch (err) {
      const errorAnswer = helper.createNewMonError(err, 500, "Error counting dogs");
      res.status(500).json(errorAnswer);
    }
  }

  async createDog(req, res) {
    try {
      const dog = new Dog(req.body);
      const result = await dog.save();
      res.status(201).json(result);
    } catch (err) {
      const errorAnswer = helper.createNewMonError(err, 500, "Error creating dog");
      res.status(500).json(errorAnswer);
    }
  }

  async putDog(req, res) {
    try {
      const dog = await Dog.findById(req.params.id);
      dog.name = req.body.name;
      dog.breed = req.body.breed;
      dog.age = req.body.age;
      dog.gender = req.body.gender;
      dog.weight = req.body.weight;
      dog.size = req.body.size;
      const result = await dog.save();
      res.status(200).json(result);
    } catch (err) {
      const errorAnswer = helper.createNewMonError(err, 500, "Error put dog");
      res.status(500).json(errorAnswer);
    }
  }

  async patchDog(req, res) {
    try {
      const dog = await Dog.findById(req.params.id);

      dog.age = req.body.age;
      const result = await dog.save();
      res.status(200).json(result);
    } catch (err) {
      const errorAnswer = helper.createNewMonError(err, 500, "Error patch dog");
      res.status(500).json(errorAnswer);
    }
  }

  async deleteDog(req, res) {
    try {
      const result = await Dog.deleteOne({_id: req.params.id});
      if (result.deletedCount === 0) {
        return res.status(404).json({message: "Dog not found"});
      }
      res.status(200).json({message: "Dog deleted"});
    } catch (err) {
      const errorAnswer = helper.createNewMonError(err, 500, "Error delete dog");
      res.status(500).json(errorAnswer);
    }
  }
}

module.exports = DogController;
