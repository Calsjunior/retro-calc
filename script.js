const display = document.querySelector(".display");
const table = document.querySelector("table");

let firstNumber = "0";
let operator = null;
let secondNumber = "";
let valueToShow = "0";

const keyMap = {
    Enter: { type: "operator", value: "equal" },
    "=": { type: "operator", value: "equal" },
    c: { type: "function", value: "clear" },
    Backspace: { type: "function", value: "backspace" },
    ".": { type: "number", value: "." },
    "+": { type: "operator", value: "add" },
    "-": { type: "operator", value: "subtract" },
    "*": { type: "operator", value: "multiply" },
    "/": { type: "operator", value: "divide" },
    "%": { type: "operator", value: "modulo" },
};

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => (b === 0 ? "Error" : a / b);
const modulo = (a, b) => a % b;

const operate = function (operator, firstNumber, secondNumber) {
    switch (operator) {
        case "add":
            return add(firstNumber, secondNumber);
        case "subtract":
            return subtract(firstNumber, secondNumber);
        case "multiply":
            return multiply(firstNumber, secondNumber);
        case "divide":
            return divide(firstNumber, secondNumber);
        case "modulo":
            return modulo(firstNumber, secondNumber);
    }
};

const clear = function () {
    firstNumber = "0";
    operator = null;
    secondNumber = "";
    valueToShow = "0";
};

const updateDisplay = function (number) {
    display.innerText = number;
};

// TODO:
const getCurrentNumber = 0;

const evaluteNumbers = function (numberInput) {
    let current = operator === null ? firstNumber : secondNumber;

    // Prevents multiple dots
    if (numberInput === "." && current.includes(".")) {
        return current;
    }

    // TODO: properly implement a way to handle long numbers from input and during calculations
    if (current.length > 12) {
        return current;
    }

    if (current === "0" && numberInput !== ".") {
        current = numberInput;
    } else {
        current += numberInput;
    }

    if (operator === null) {
        firstNumber = current;
    } else {
        secondNumber = current;
    }

    return current;
};

const handleOperators = function (operatorInput) {
    if (firstNumber !== "" && secondNumber !== "" && operator !== null) {
        const result = operate(operator, parseFloat(firstNumber), parseFloat(secondNumber));
        firstNumber = result.toString();
        secondNumber = "";
    }

    if (operatorInput === "equal") {
        operator = null;
    } else {
        operator = operatorInput;
    }
    return firstNumber || "0";
};

const handleFunctions = function (functionInput) {
    if (functionInput === "clear") {
        clear();
        return firstNumber;
    }

    // TODO: helper function to determine current number
    if (functionInput === "backspace") {
        let current = operator === null ? firstNumber : secondNumber;

        if (current.length <= 1 || current === "0" || current === "-") {
            current = "0";
        } else {
            current = current.slice(0, -1);
        }

        if (operator === null) {
            firstNumber = current;
        } else {
            secondNumber = current;
        }

        return current;
    }
};

const processInput = function (action, inputValue, textContent) {
    switch (action) {
        case "number":
            return evaluteNumbers(textContent);
        case "operator":
            return handleOperators(inputValue);
        case "function":
            return handleFunctions(inputValue);
    }
};

table.addEventListener("click", (event) => {
    const target = event.target;
    if (!target.dataset.type) return;
    valueToShow = processInput(target.dataset.type, target.name, target.innerText);
    updateDisplay(valueToShow);
});

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (/[0-9]/.test(key)) {
        valueToShow = processInput("number", key, key);
    } else if (keyMap[key]) {
        valueToShow = processInput(keyMap[key].type, keyMap[key].value, keyMap[key].value);
    }

    updateDisplay(valueToShow);
});
