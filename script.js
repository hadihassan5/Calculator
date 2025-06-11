// Calculator functionality
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
        this.language = 'english';
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        if (this.currentOperand === '') {
            this.currentOperand = '0';
        }
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = this.normalizeOperator(operation);
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }

    normalizeOperator(operator) {
        // Convert all operator representations to standard symbols for computation
        if (operator === '×' || operator === 'ضرب') return '*';
        if (operator === '÷' || operator === 'تقسیم') return '/';
        if (operator === '−' || operator === 'منفی') return '-';
        if (operator === '+' || operator === 'جمع') return '+';
        return operator;
    }

    getDisplayNumber(number) {
        if (number === '') return '';
        const floatNumber = parseFloat(number);
        if (isNaN(floatNumber)) return '';
        return floatNumber.toLocaleString(this.language === 'urdu' ? 'ur-PK' : 'en-US');
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            const operatorSymbol = this.getOperatorSymbol(this.operation);
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${operatorSymbol}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }

    getOperatorSymbol(operation) {
        if (this.language === 'urdu') {
            switch (operation) {
                case '+': return 'جمع';
                case '-': return 'منفی';
                case '*': return 'ضرب';
                case '/': return 'تقسیم';
                default: return operation;
            }
        } else {
            switch (operation) {
                case '+': return '+';
                case '-': return '−';
                case '*': return '×';
                case '/': return '÷';
                default: return operation;
            }
        }
    }

    switchLanguage(language) {
        this.language = language;
        this.updateDisplay();
        this.updateButtonTexts();
        this.updateButtonLayout();
    }

    updateButtonTexts() {
        const buttons = document.querySelectorAll('[data-action]');
        buttons.forEach(button => {
            const action = button.getAttribute('data-action');
            switch (action) {
                case 'clear':
                    button.textContent = this.language === 'urdu' ? 'صاف' : 'AC';
                    break;
                case 'delete':
                    button.textContent = this.language === 'urdu' ? 'حذف' : 'DEL';
                    break;
                case 'add':
                    button.textContent = this.language === 'urdu' ? 'جمع' : '+';
                    break;
                case 'subtract':
                    button.textContent = this.language === 'urdu' ? 'منفی' : '−';
                    break;
                case 'multiply':
                    button.textContent = this.language === 'urdu' ? 'ضرب' : '×';
                    break;
                case 'divide':
                    button.textContent = this.language === 'urdu' ? 'تقسیم' : '÷';
                    break;
                case 'equals':
                    button.textContent = this.language === 'urdu' ? 'برابر' : '=';
                    break;
                case 'decimal':
                    button.textContent = this.language === 'urdu' ? '۔' : '.';
                    break;
            }
        });
    }

    updateButtonLayout() {
        const buttonsContainer = document.getElementById('buttons-container');
        if (this.language === 'urdu') {
            buttonsContainer.classList.remove('english-layout');
            buttonsContainer.classList.add('urdu-layout');
        } else {
            buttonsContainer.classList.remove('urdu-layout');
            buttonsContainer.classList.add('english-layout');
        }
    }
}

// DOM elements
const numberButtons = document.querySelectorAll('[data-action^="0"], [data-action^="1"], [data-action^="2"], [data-action^="3"], [data-action^="4"], [data-action^="5"], [data-action^="6"], [data-action^="7"], [data-action^="8"], [data-action^="9"], [data-action="decimal"]');
const operationButtons = document.querySelectorAll('[data-action="add"], [data-action="subtract"], [data-action="multiply"], [data-action="divide"]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');
const englishBtn = document.getElementById('english-btn');
const urduBtn = document.getElementById('urdu-btn');

// Create calculator
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-action'));
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.textContent);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

clearButton.addEventListener('click', () => {
    calculator.clear();
    calculator.updateDisplay();
});

deleteButton.addEventListener('click', () => {
    calculator.delete();
    calculator.updateDisplay();
});

// Language switch
englishBtn.addEventListener('click', () => {
    calculator.switchLanguage('english');
    document.body.classList.remove('urdu');
    englishBtn.classList.add('active');
    urduBtn.classList.remove('active');
});

urduBtn.addEventListener('click', () => {
    calculator.switchLanguage('urdu');
    document.body.classList.add('urdu');
    englishBtn.classList.remove('active');
    urduBtn.classList.add('active');
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
    } else if (e.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        calculator.compute();
        calculator.updateDisplay();
    } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
    } else if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
    }
});