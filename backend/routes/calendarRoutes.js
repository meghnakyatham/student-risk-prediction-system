const express = require("express");
const router = express.Router();

// Generate a full month calendar (weeks × days)
router.get("/:year/:month", (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);

  if (!year || !month)
    return res.status(400).json({ message: "Invalid year or month" });

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  let calendar = [];
  let week = new Array(7).fill(null);

  // Fill empty days at the start
  for (let i = 0; i < firstDay.getDay(); i++) {
    week[i] = null;
  }

  // Fill actual days
  for (let day = 1; day <= lastDay.getDate(); day++) {
    week[firstDay.getDay()] = day;

    if (firstDay.getDay() === 6) {
      calendar.push(week);
      week = new Array(7).fill(null);
    }

    firstDay.setDate(firstDay.getDate() + 1);
  }

  calendar.push(week);

  res.json(calendar);
});

module.exports = router;

