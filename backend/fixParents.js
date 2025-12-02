const mongoose = require("mongoose");
const User = require("./models/user");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB Connection Error", err));

async function linkParentsToStudents() {
  try {
    const students = await User.find({ role: "student" }).sort({ email: 1 });
    const parents = await User.find({ role: "parent" }).sort({ email: 1 });

    if (students.length === 0 || parents.length === 0) {
      console.log("No parents or students found!");
      return process.exit();
    }

    if (students.length !== parents.length) {
      console.log("Warning: Unequal parent & student count!");
    }

    for (let i = 0; i < parents.length; i++) {
      parents[i].childStudentId = students[i]._id;
      parents[i].attendance = students[i].attendance;
      parents[i].behavior = students[i].behavior;
      parents[i].knowledge = students[i].knowledge;
      parents[i].assignmentsDue = students[i].assignmentsDue;
      parents[i].risk = students[i].risk;

      await parents[i].save();
    }

    console.log("Parent → Student linking COMPLETE ✔✔");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit();
  }
}

linkParentsToStudents();
