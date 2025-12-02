const mongoose = require("mongoose");
const Lecture = require("./models/lecture");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Mongo connected");
  seed();
});

const seed = async () => {
  await Lecture.deleteMany({});

  const studentId = "692e9d3d50f7755ca037a255";

  const lectures = [
    {
      studentId,
      date: "2025-12-01",
      subject: "Math",
      time: "09:00 AM",
      status: "Present"
    },
    {
      studentId,
      date: "2025-12-01",
      subject: "Science",
      time: "10:00 AM",
      status: "Absent"
    },
    {
      studentId,
      date: "2025-12-02",
      subject: "English",
      time: "09:00 AM",
      status: "Present"
    }
  ];

  await Lecture.insertMany(lectures);
  console.log("Seeded");
  process.exit();
};
