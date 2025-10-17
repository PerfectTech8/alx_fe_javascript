
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const listItem = document.getElementById("listItem");


const quotes = [{text: "Success is not the key to happiness. Happiness is the key to success", category: "Inspiration"}, 
    {text: "The best way to get started is to quit talking and begin doing", category: "Motivation"},
     {text: "Don't let yesterday take up too much of today", category: "Life"}];

     //random quotes
     function showRandomQuote(){
        const randomNumber = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomNumber];
        quoteDisplay.textContent = `"${randomQuote.text}" - ${randomQuote.category}`;

     }
     newQuoteBtn.addEventListener("click", showRandomQuote);
     showRandomQuote();
     console.log("Hello")

     //user adding quotes

     function addQuote(){
        const text = newQuoteText.value.trim();
        const category =  newQuoteCategory.value.trim(); 
        if(text === "" || category === ""){
            alert("Enter both quote and category");
        return;
     }
     const updatedQuote = {text, category};
     quotes.push(updatedQuote);
     const li = document.createElement("li");
     li.textContent = `"${updatedQuote.text} - ${updatedQuote.category}`;
     listItem.appendChild(li);
     newQuoteText.value = "";
     newQuoteCategory.value = "";
    }
    
    


