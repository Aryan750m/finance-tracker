const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let budget = 0;
let expenses = [];

// ✅ API to Get Budget
app.get("/get-budget", (req, res) => {
    res.json({ budget });
});

// ✅ API to Set Budget
app.post("/set-budget", (req, res) => {
    budget = req.body.budget;
    res.json({ message: "Budget updated successfully!", budget });
});

// ✅ API to Get Expenses
app.get("/expenses", (req, res) => {
    res.json({ expenses });
});

// ✅ API to Add Expense
app.post("/add-expense", (req, res) => {
    expenses.push({ amount: req.body.amount });
    res.json({ message: "Expense added successfully!" });
});

// ✅ API to Delete Expense
app.delete("/delete-expense/:index", (req, res) => {
    const index = parseInt(req.params.index);
    if (index >= 0 && index < expenses.length) {
        expenses.splice(index, 1);
        res.json({ message: "Expense deleted successfully!" });
    } else {
        res.status(400).json({ message: "Invalid expense index!" });
    }
});

// ✅ Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
