class Calculator{
  Constructor(previous, current){
    this.previous = previous;
    this.current = current;
    this.operation = "";
  }

  //takes in a string and appends it to the current selection, if it is not a duplicate "."
  appendNumber(button){
    if(button === "." && this.current == ""){
      this.current = "0."
    }
    button === "." && this.current.includes(".") ? this.current = this.current : this.current = `${this.current}${button}`;
  }

  //Changes the operation to the inputted string, appends it to the previous selection, and clears the current selection.
  //if both previous and current selections have already been entered, solves the problem and readies for next problem
  selectOperation(button){
    if(this.previous === "" && this.current === "" || this.current === "."){
      return;
    }else if(this.previous !== "" && this.current === ""){
      this.operation = `${button}`;
      return;
    }else if(this.previous !== "" && this.current !== ""){
      this.solveProblem();
    }
      this.operation = `${button}`;
      this.previous = `${this.current}`;
      this.current = "";
  }

  //resets the calculator to empty values
  clearDisplay(){
    this.previous = "";
    this.current = "";
    this.operation = "";
  }

  //deletes one character from the current selection
  backSpace(){
    this.current = this.current.toString().slice(0, -1);
  }

  //modifies the current selection based on the inputted button
  calcModifier(button){
    let curr = parseFloat(this.current);
    if (isNaN(curr)) return;
    switch(button){
      case "√": this.current = `${Math.sqrt(parseFloat(this.current))}`; break
      case "1/X": this.current = `${1 / parseFloat(this.current)}`; break
      case"+/-": this.current = `${-this.current}`;
    }
  }

  //If both selections are numbers, solves the inputted problem
  solveProblem(){
    let prev = parseFloat(this.previous);
    let curr = parseFloat(this.current);
    if (isNaN(prev) || isNaN(curr)) return;
    switch(this.operation){
      case "*": this.current = prev * curr; break
      case "/": this.current = prev / curr; break
      case "+": this.current = prev + curr; break
      case "-": this.current = prev - curr; break
      case "%": this.current = prev % curr; break
      case "^": this.current = prev ** curr; break
      default: return; break
    }
    this.current = `${this.current}`
    this.operation = "";
    this.previous = "";
  }

  //Helper function to make the numbers prettier AKA (adds commas)
  toDisplayNum(str){
    if(str == ""){
      return str;
    }else{
      let digits = parseFloat(str.split(".")[0]).toLocaleString('en', { maximumFractionDigits: 0 });
      let decimal = str.split(".")[1];
      return decimal != undefined ? `${digits}.${decimal}` : `${digits}`;
    }
  }

  //Refreshes the HTML to display the current values
  updateDisplay(){
    document.querySelector("[data-previous]").innerText = `${this.toDisplayNum(this.previous)}${this.operation}`;
    document.querySelector("[data-current]").innerText = this.toDisplayNum(this.current);
  }
}

//---INITIALIZATION ---

const calculator = new Calculator("", "");
const anim = Array.from(document.querySelectorAll('button'));
calculator.clearDisplay();


//--- ON-CLICK FUNCTIONS ---

//On-click of a number button - appends the number to the current and updates the display.
document.querySelectorAll("[data-num]").forEach(button => {
  button.addEventListener("click", () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
    button.classList.add('clicked');
  })
})

//On-click of an operation number - updates the operation and display.
document.querySelectorAll("[data-op]").forEach(button => {
  button.addEventListener("click", () => {
    calculator.selectOperation(button.innerText);
    calculator.updateDisplay();
    button.classList.add('clicked');
  })
})

//On-click of on an input-modifier function, calculates it and updates the display.
document.querySelectorAll("[data-modifier]").forEach(button => {
  button.addEventListener("click", () => {
    calculator.calcModifier(button.innerText);
    calculator.updateDisplay();
    button.classList.add('clicked');
  })
})

//On-click of equals - solves the problem and updates the display.
document.querySelector("[data-equals]").addEventListener("click", button =>{
  calculator.solveProblem();
  calculator.updateDisplay();
  document.querySelector("[data-equals]").classList.add('clicked');
})

//On-click of clear - resets the calculator and updates the display.
document.querySelector("[data-clear]").addEventListener("click", button =>{
  calculator.clearDisplay();
  calculator.updateDisplay();
  document.querySelector("[data-clear]").classList.add('clicked');
})

//On-click of delete - removes a character from the current selection and updates the display.
document.querySelector("[data-delete]").addEventListener("click", button =>{
  calculator.backSpace();
  calculator.updateDisplay();
  document.querySelector("[data-delete]").classList.add('clicked');
})

//"unpresses" the button at the end of the on-click animation.
function removeTransition(button) {
  if (button.propertyName !== 'transform') return;
  button.target.classList.remove('clicked');
}

anim.forEach(button => button.addEventListener('transitionend', removeTransition));
