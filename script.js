const lengthSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copy]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbol = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatePassBtn = document.querySelector(".generatePassButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~`!@#$%^&*_-+<>?/.,{}[]()";


let password = "";
let passwordLength=10;
let checkBoxCount = 0;

handleSlider();
function handleSlider(){
    console.log("Length Set");
    lengthSlider.value = passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min = lengthSlider.min;
    const max = lengthSlider.max;
    lengthSlider.style.backgroundSize =( (passwordLength - min )*100/(max-min)+"% 100%")
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = "0px 0px 12px 1px ${color}";
}

function getRandInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandInteger(0,9);
}

function generateLowerCharacter(){
    return String.fromCharCode(getRandInteger(97,122));
}

function generateUpperCharacter(){
    return String.fromCharCode(getRandInteger(65,91));
}

function generateSymbol(){
    const random = getRandInteger(0,symbols.length);
    return symbols.charAt(random);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;
    if(uppercase.checked) hasUpper = true;
    if(lowercase.checked) hasLower = true;
    if(symbol.checked) hasSymbol = true;
    if(numbers.checked) hasNumber = true;
    if(uppercase && lowercase && (hasNumber || hasSymbol) && passwordLength>=8){
        setIndicator("#0f0");
    }else if( (hasUpper || hasLower) && (hasNumber || hasSymbol) && passwordLength>=6){
        setIndicator("#ff0")
    }else{
        setIndicator("#f00")
    }
}

async function copyContent(){
    try{
       await navigator.clipboard.writeText(passwordDisplay.value);
       copyMsg.innerText="copied";

    }catch{
        copyMsg.innerText="Failed !";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
    
}

lengthSlider.addEventListener('input' ,(e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
});

function handleCheckBoxChange(){
    checkBoxCount = 0;
    allCheckBox.forEach((checkbox) =>{

        if(checkbox.checked){
            checkBoxCount++;
        }
    });

    if(passwordLength<checkBoxCount){
        passwordLength = checkBoxCount;
        // passwordDisplay.value = password;
        handleSlider();
    }

}

allCheckBox.forEach((checkBox) =>{
    checkBox.addEventListener('change',handleCheckBoxChange)
});

function shuffle(arr){
    console.log("shuffled");
    var currentIndex = arr.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]];
    }
    let str = "";
    arr.forEach(el => str+=el);

    return str;
}

generatePassBtn.addEventListener('click',() => {
    console.log("started");
    if(checkBoxCount<=0)return;
    console.log("checkcount");
    if(checkBoxCount < passwordLength){
        checkBoxCount = passwordLength;
        handleSlider();
    }
    password = "";
    console.log("started");
    let funcArray =[];

    if(uppercase.checked){
        funcArray.push(generateUpperCharacter);
    }
    if(lowercase.checked){
        funcArray.push(generateLowerCharacter);
    }
    if(numbers.checked){
        funcArray.push(generateRandomNumber);
    }
    if(symbol.checked){
        funcArray.push(generateSymbol);
    }

    for(let i=0;i < funcArray.length;i++){
        password+=funcArray[i]();
    }
    console.log("Middle");
    for(let i=0;i<passwordLength-funcArray.length;i++){
        let randomIndex = getRandInteger(0,funcArray.length);
        password+=funcArray[randomIndex]();
    }
    password = shuffle(Array.from(password));
    passwordDisplay.value = password;
    
    calcStrength();

});


