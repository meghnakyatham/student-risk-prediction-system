const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const calculateRisk = require("./utils/riskCalculator");
require("dotenv").config();


(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🌱 MongoDB Connected");

    await seed();   // <-- NOW SAFE
    process.exit();
  } catch (err) {
    console.error("❌ DB Connection Error", err);
    process.exit(1);
  }
})();

const getRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// -----------------------------------------------------------
// FULL NAMES LISTS
// -----------------------------------------------------------

// 50 STUDENT NAMES
const studentNames = [
  "Aarav Malhotra","Advika Sharma","Rohan Kapoor","Ishika Nair","Vivaan Bansal",
  "Prisha Reddy","Arjun Chatterjee","Saanvi Patel","Kabir Suri","Meera Deshmukh",
  "Shaurya Verma","Anaya Kulkarni","Reyansh Gupta","Myra Shetty","Dhruv Khanna",
  "Kavya Rao","Ayaan Ghosh","Diya Menon","Atharv Jain","Shanaya Kaur",
  "Yuvraj Mishra","Aadhya Pillai","Harshit Shukla","Tanya Bhattacharya","Krish Vora",
  "Nyra Talwar","Vihaan Mehta","Riddhi Rawat","Parth Gill","Kiara Sengupta",
  "Aarush Saxena","Ishani D’Souza","Aarav Sengar","Riya Pradhan","Samarth Chauhan",
  "Aanya Chhabra","Kian Bakshi","Trisha Joshi","Abeer Kohli","Harini Iyer",
  "Tanmay Jaiswal","Arohi Pathak","Neil Dhawan","Manya Wadhwa","Reya Shah",
  "Rohit Nayak","Esha Thapar","Tanishq Bharadwaj","Mishka Singhal","Aarav Lokhande"
];

// 50 PARENT NAMES
const parentNames = [
  "Rajesh Malhotra","Sunita Sharma","Prakash Kapoor","Lakshmi Nair","Manoj Bansal",
  "Rekha Reddy","Subhash Chatterjee","Manisha Patel","Pawan Suri","Anjali Deshmukh",
  "Vinod Verma","Shobha Kulkarni","Amit Gupta","Neetu Shetty","Sanjay Khanna",
  "Preeti Rao","Dipankar Ghosh","Anitha Menon","Rajat Jain","Jasmeet Kaur",
  "Vijay Mishra","Deepa Pillai","Gopal Shukla","Rupa Bhattacharya","Hemant Vora",
  "Smita Talwar","Ramesh Mehta","Indira Rawat","Paramjit Gill","Vandana Sengupta",
  "Raghav Saxena","Anuradha D’Souza","Ajay Sengar","Kamini Pradhan","Harish Chauhan",
  "Seema Chhabra","Lalit Bakshi","Shalini Joshi","Naveen Kohli","Usha Iyer",
  "Anand Jaiswal","Leena Pathak","Nikhil Dhawan","Geeta Wadhwa","Bhavesh Shah",
  "Kavita Nayak","Sudhir Thapar","Sushma Bharadwaj","Ritesh Singhal","Archana Lokhande"
];

// 8 TEACHER NAMES
const teacherNames = [
  "Ritu Sharma",
  "Nishant Mehta",
  "Shalini Iyer",
  "Karan Chopra",
  "Deepika Reddy",
  "Arvind Gupta",
  "Sonia Bhatt",
  "Rohit Chandra"
];

// -----------------------------------------------------------
// SEED FUNCTION
// -----------------------------------------------------------

const seed = async () => {
  console.log("🌱 Clearing old data...");
  await User.collection.drop().catch(() => {});

  const hashedPassword = await bcrypt.hash("123456", 10);

  console.log("🌱 Seeding teachers...");
  for (let i = 0; i < teacherNames.length; i++) {
    await User.create({
      name: teacherNames[i],
      email: `teacher${i + 1}@school.com`,
      password: hashedPassword,
      role: "teacher",
    });
  }

  console.log("🌱 Seeding students & parents...");
  for (let i = 0; i < 50; i++) {
    const attendance = getRandom(40, 95);
    const behavior = getRandom(40, 95);
    const knowledge = getRandom(40, 95);
    const assignmentsDue = getRandom(0, 5);

    const riskData = calculateRisk({
      attendance,
      behavior,
      knowledge,
      assignmentsDue,
    });
        // STUDENT CREATE
    const student = await User.create({
      name: studentNames[i],
      email: `student${i + 1}@school.com`,
      password: hashedPassword,
      role: "student",

      attendance,
      behavior,
      knowledge,
      assignmentsDue,

      comments: [
        "Shows consistent improvement",
        "Needs to focus on time management",
        "Good class participation",
      ],

      marks: [
        { subject: "Math", score: getRandom(50, 95) },
        { subject: "Science", score: getRandom(50, 95) },
        { subject: "English", score: getRandom(50, 95) },
        { subject: "Computer Science", score: getRandom(50, 95) },
      ],

      // ⭐ Added: More detailed CGPA trend for AI
      cgpaHistory: [
        { semester: "Sem 1", cgpa: (getRandom(65, 85) / 10).toFixed(1) },
        { semester: "Sem 2", cgpa: (getRandom(60, 90) / 10).toFixed(1) },
        { semester: "Sem 3", cgpa: (getRandom(55, 90) / 10).toFixed(1) },
      ],

      // ⭐ Added: Weekly attendance for charts
      weeklyAttendance: {
        Monday: getRandom(0, 1),
        Tuesday: getRandom(0, 1),
        Wednesday: getRandom(0, 1),
        Thursday: getRandom(0, 1),
        Friday: getRandom(0, 1),
      },

      // ⭐ Added: Lecture-level attendance (9AM–4PM)
      lectureAttendance: {
        Monday: Array(7).fill(0).map(() => getRandom(0, 1)),
        Tuesday: Array(7).fill(0).map(() => getRandom(0, 1)),
        Wednesday: Array(7).fill(0).map(() => getRandom(0, 1)),
        Thursday: Array(7).fill(0).map(() => getRandom(0, 1)),
        Friday: Array(7).fill(0).map(() => getRandom(0, 1)),
      },

      // ⭐ Added: Subject-wise performance for bar charts
      subjectPerformance: [
        { subject: "Math", performance: getRandom(40, 95) },
        { subject: "Science", performance: getRandom(40, 95) },
        { subject: "English", performance: getRandom(40, 95) },
        { subject: "Computer Science", performance: getRandom(40, 95) },
      ],

      // ⭐ Added: Daily attendance tracking (for heatmap)
      dailyAttendanceMap: Array(30)
        .fill(0)
        .map(() => ({ present: getRandom(0, 1) })),

      // ⭐ Original risk fields (untouched)
      risk: riskData.riskBand,
      riskScore: riskData.overallScore,
      riskReasons: riskData.reasons,

      // ⭐ Added: AI pre-computed insights
      aiInsights: {
        studyAdvice: "Needs consistent study routine",
        attendanceAdvice: attendance < 60 ? "Immediate attendance improvement required" : "Maintain attendance",
        behaviorAdvice: behavior < 50 ? "Needs behavioral counseling" : "Positive classroom behavior",
      },
    });


    // PARENT CREATE (linked to student)
    await User.create({
      name: parentNames[i],
      email: `parent${i + 1}@school.com`,
      password: hashedPassword,
      role: "parent",
      childStudentId: student._id,
    });
  }

  console.log("🌱 Seeding complete!");
  process.exit();
};

seed();


