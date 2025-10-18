
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const listItem = document.getElementById("listItem");
const ExportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importfile = document.getElementById("importFile");


// const quotes = [{text: "Success is not the key to happiness. Happiness is the key to success", category: "Inspiration"}, 
//     {text: "The best way to get started is to quit talking and begin doing", category: "Motivation"},
//      {text: "Don't let yesterday take up too much of today", category: "Life"}];


     let quotes = JSON.parse(localStorage.getItem("quotes")) || [{text: "Success is not the key to happiness. Happiness is the key to success", category: "Inspiration"}, 
    {text: "The best way to get started is to quit talking and begin doing", category: "Motivation"},
     {text: "Don't let yesterday take up too much of today", category: "Life"}]; 
     //random quotes
     function showRandomQuote(){
        const randomNumber = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomNumber];
        quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;

     }
     newQuoteBtn.addEventListener("click", showRandomQuote);
     showRandomQuote();

     //display all quotes

     function displayQuotes(){
      listItem.innerHTML = "";
      quotes.forEach((q) => {
         const li = document.createElement("li");
         li.textContent = `"${q.text}" - ${q.category}`;
         listItem.appendChild(li);
      })
     }

     //user adding quotes

     function createAddQuoteForm(){
        const text = newQuoteText.value.trim();
        const category =  newQuoteCategory.value.trim(); 
        if(text === "" || category === ""){
            alert("Enter both quote and category");
        return;
     }
     const updatedQuote = {text, category};
      quotes.push(updatedQuote);
   //   const li = document.createElement("li");
   //   li.textContent = `"${updatedQuote.text}" - ${updatedQuote.category}`;
   //   listItem.appendChild(li);

     
     //update local storage
     localStorage.setItem("quotes", JSON.stringify(quotes));

     displayQuotes();
     showRandomQuote();

     newQuoteText.value = "";
     newQuoteCategory.value = "";

    }

    //export function
    function exportQuotes(){
      const quotesFile = JSON.stringify(quotes, null, 2);
      const blob = new Blob([quotesFile], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "quotes.json";
      link.click();
      setTimeout(() => {
         URL.revokeObjectURL(url);
      }, 2000);

    }

    //import function
    function importFromJsonFile(event){
      const files = importfile.files[0];
      if(!files){
         alert("import a JSON file");
         return;
      }
      
      const reader= new FileReader();
      reader.onload = function(e){
         try{
         const importedQuotes = JSON.parse(e.target.result);
         if(!Array.isArray(importedQuotes)){
            alert("Incorrect file type!");
            return;
         }
         quotes.push(...importedQuotes);
         localStorage.setItem("quotes", JSON.stringify(quotes));
         alert("Quotes imported successfully");
         displayQuotes();
         }catch(error){
            alert("Error reading file" + error.message);
         }
      }
      reader.readAsText(files);
      

   
    }
    
    //add eventlisteners
     ExportBtn.addEventListener("click", exportQuotes);
   //   importBtn.addEventListener("click", importFromJsonFile);

     displayQuotes();
     showRandomQuote();

 


