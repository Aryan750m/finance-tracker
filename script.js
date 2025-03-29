document.addEventListener("DOMContentLoaded", function () {
    const budgetInput = document.getElementById("set-budget");
    const saveBudgetButton = document.getElementById("save-budget");
    const dailyBudgetDisplay = document.getElementById("daily-budget");
    const remainingDisplay = document.getElementById("remaining");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");

    let dailyBudget = 0;
    let expenses = [];

    // ✅ Fetch Budget from Backend
    async function fetchBudget() {
        try {
            const response = await fetch("/get-budget");
            const data = await response.json();
            dailyBudget = data.budget || 0;
            dailyBudgetDisplay.textContent = dailyBudget;
            updateRemaining();
        } catch (error) {
            console.error("❌ Error fetching budget:", error);
        }
    }

    // ✅ Save Budget to Backend
    saveBudgetButton.addEventListener("click", async () => {
        const budgetValue = parseFloat(budgetInput.value);
        if (isNaN(budgetValue) || budgetValue <= 0) {
            alert("Please enter a valid budget!");
            return;
        }

        try {
            const response = await fetch("/set-budget", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ budget: budgetValue }),
            });

            if (response.ok) {
                dailyBudget = budgetValue;
                dailyBudgetDisplay.textContent = dailyBudget;
                updateRemaining();
            } else {
                console.error("❌ Failed to save budget.");
            }
        } catch (error) {
            console.error("❌ Error saving budget:", error);
        }
    });

    // ✅ Fetch Expenses from Backend
    async function fetchExpenses() {
        try {
            const response = await fetch("/expenses");
            const data = await response.json();
            expenses = data.expenses || [];
            updateExpenseList();
            updateRemaining();
        } catch (error) {
            console.error("❌ Error fetching expenses:", error);
        }
    }

    // ✅ Add New Expense
    expenseForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const amountInput = document.getElementById("amount");
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            alert("Enter a valid amount!");
            return;
        }

        const expenseData = { amount };

        try {
            const response = await fetch("/add-expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(expenseData),
            });

            if (response.ok) {
                amountInput.value = "";
                fetchExpenses(); // Refresh expenses
            } else {
                console.error("❌ Failed to add expense.");
            }
        } catch (error) {
            console.error("❌ Error adding expense:", error);
        }
    });

    // ✅ Update Expense List in UI
    function updateExpenseList() {
        expenseList.innerHTML = "";
        expenses.forEach((expense, index) => {
            const li = document.createElement("li");
            li.textContent = `₹${expense.amount}`;
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "❌";
            deleteButton.onclick = () => deleteExpense(index);
            li.appendChild(deleteButton);
            expenseList.appendChild(li);
        });
    }

    // ✅ Delete Expense
    async function deleteExpense(index) {
        try {
            const response = await fetch(`/delete-expense/${index}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchExpenses(); // Refresh the expense list
            } else {
                console.error("❌ Failed to delete expense.");
            }
        } catch (error) {
            console.error("❌ Error deleting expense:", error);
        }
    }

    // ✅ Update Remaining Budget
    function updateRemaining() {
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        remainingDisplay.textContent = dailyBudget - totalExpenses;
    }

    // ✅ Initial Fetch
    fetchBudget();
    fetchExpenses();
});
