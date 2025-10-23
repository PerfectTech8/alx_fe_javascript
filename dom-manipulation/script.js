const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const listItem = document.getElementById("listItem");
const ExportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importfile = document.getElementById("importFile");
const categoryFilter = document.getElementById("categoryFilter");
const addBtn = document.getElementById("add");


// const quotes = [{text: "Success is not the key to happiness. Happiness is the key to success", category: "Inspiration"}, 
//     {text: "The best way to get started is to quit talking and begin doing", category: "Motivation"},
//      {text: "Don't let yesterday take up too much of today", category: "Life"}];


   //   let quotes = JSON.parse(localStorage.getItem("quotes")) || [{text: "Success is not the key to happiness. Happiness is the key to success", category: "Inspiration"}, 
   //  {text: "The best way to get started is to quit talking and begin doing", category: "Motivation"},
   //   {text: "Don't let yesterday take up too much of today", category: "Life"}]; 
     
     
   //   random quotes
    
   //   function showRandomQuote(){
   //      const randomNumber = Math.floor(Math.random() * quotes.length);
   //      const randomQuote = quotes[randomNumber];
   //      quoteDisplay.innerHTML = `"${randomQuote.text}" - ${randomQuote.category}`;

   //   }
   //   newQuoteBtn.addEventListener("click", showRandomQuote);
   //   showRandomQuote();

   //   display all quotes

   //   function displayQuotes(){
   //    listItem.innerHTML = "";
   //    quotes.forEach((q) => {
   //       const li = document.createElement("li");
   //       li.textContent = `"${q.text}" - ${q.category}`;
   //       listItem.appendChild(li);
   //    })
   //   }

     //user adding quotes

     async function createAddQuoteForm(){
        const text = newQuoteText.value.trim();
        const category =  newQuoteCategory.value.trim(); 
        if(text === "" || category === ""){
            alert("Enter both quote and category");
        return;
     }
     const updatedQuote = {id: Date.now(), text, category, updatedAt: Date.now()};
     const quotes= getLocalQuotes();
      quotes.push(updatedQuote);
      saveLocalQuotes(quotes);
      await postQuoteToServer(updatedQuote);
   //   const li = document.createElement("li");
   //   li.textContent = `"${updatedQuote.text}" - ${updatedQuote.category}`;
   //   listItem.appendChild(li);

     
     //update local storage
   //   localStorage.setItem("quotes", JSON.stringify(quotes));

     
   //   populateCategories();
   //   filterQuotes();

   //   displayQuotes();
   //   showRandomQuote();
     populateCategories();
     filterQuotes(category);
     newQuoteText.value = "";
     newQuoteCategory.value = "";
   //the one o ChatGPT
   //   populateCategories();
   //   filterQuotes(category);

    }

    //export function
    function exportQuotes(){
      const quotes = getLocalQuotes();
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

   //   displayQuotes();
   //   showRandomQuote();

   //populate categories
   
   function populateCategories(){
      const quotes = getLocalQuotes() || [];
      const categoryDrop = ["All", ... new Set(quotes.map(q => q.category))];

      // categoryFilter.innerHTML = `<option value="all"> All Category</option>`;
      // categoryDrop.forEach(cat => {
      //    const option = document.createElement("option");
      //    option.value = cat;
      //    option.textContent = cat;
      //    categoryFilter.appendChild(option);
      // })
       categoryFilter.innerHTML = categoryDrop.map(cat => `<option value="${cat}">${cat}</option>`).join("");

      //restore last selected quotes
      const lastSelected = localStorage.getItem("selectedCategory") || "All";
      categoryFilter.value = lastSelected;
   }
   

   // populateCategories();

   //filter quotes based on category

   function filterQuotes(selectedCategory = "All"){
      const quotes = getLocalQuotes();
      const selectedCat = categoryFilter.value;
      localStorage.setItem("selectedCategory", selectedCat);
      let filteredOption = selectedCat === "All" ? quotes : quotes.filter(q => q.category === selectedCat);
      if(filteredOption.length === 0){
         quoteDisplay.innerHTML = "No quotes avalaible for this category";

      }else{
         const randomQuoteShow = filteredOption[Math.floor(Math.random() * filteredOption.length)];
         quoteDisplay.innerHTML = `"${randomQuoteShow.text}" - ${randomQuoteShow.category}`;
      }
   }

   //Restore last selected filter from storage

//    function restoreFilter(){
//    const lastSelected = localStorage.getItem("selectedCategory");
//    if(lastSelected && [... categoryFilter.options]
//       .some(opt => opt.value === lastSelected)
//    ){
//    categoryFilter.value = lastSelected;
//    }else{
//       categoryFilter.value = "all";
//    }
//    filterQuotes();
// }
   // populateCategories();
   // filterQuotes()

   // addBtn.addEventListener("click", createAddQuoteForm);
   // categoryFilter.addEventListener("change", filterQuotes);
   
   // populateCategories();
   // restoreFilter();
   // addBtn.addEventListener("click", createAddQuoteForm);    add button
   // categoryFilter.addEventListener("change", filterQuotes);
   

// modified App with server simulation

const serverUrl = "https://jsonplaceholder.typicode.com/posts";

//fetch quote from server 

async function fetchQuotesFromServer(){
   try{
      const response = await fetch(serverUrl);
      const data = await response.json();
      const serverQuotes = data.slice(0, 5).map(post => ({
         id: post.id,
         text: post.title,
         category: "Server",
         updatedAt: Date.now()

      })) 
      // console.log(serverQuotes);
      return serverQuotes;


   }catch(error){
      // console.error(error);
      return [];

   }
}

//posting Quotes to server
async function postQuoteToServer(quote){
   try{
      const response = await fetch(serverUrl, {
         method: "POST",
         headers: { "Content-Type": "application/json"},
         body: JSON.stringify(quote)
      })
      const result = await response.json();
      // console.log(result);
   }catch(error){
      // console.error("Error posting to server:", error);
   }
   
}

// get Quotes from local storage 
 function getLocalQuotes() {
   return JSON.parse(localStorage.getItem("quotes")) || [{text: "Success is not the key to happiness. happiness is the key to success", Category: "Inspiration"},
   {text: "The best way to get started is to quit talking and begin doing", Category: "Motivation"},
   {text: "Don't let yesterday take up too much of today", Category: "Life"}];
     
// [{text: "Success is not the key to happiness. happiness is the key to success", Category: "Inspiration"},
//    {text: "The best way to get started is to quit talking and begin doing", Category: "Motivation"},
//    {text: "Don't let yesterday take up too much of today", Category: "Life"}];
     
}
// console.log(getLocalQuotes());

//post Quotes to local storage

function saveLocalQuotes(quotes){
   localStorage.setItem("quotes", JSON.stringify(quotes));
}

//merge quotes

   async function mergeQuotes(localQuotes, serverQuotes){
   localQuotes = getLocalQuotes();
   const serverNewQuotes = await fetchQuotesFromServer();
   const merged = [... localQuotes];
   let conflictFound = false;
   serverNewQuotes.forEach(serverNewQuote => {
      const index = merged.findIndex(q => q.id === serverNewQuote.id);
   
   if(index === -1){
      merged.push(serverNewQuote);
   }else if(JSON.stringify(merged[index]) !== JSON.stringify(serverNewQuote)){
      merged[index] = serverNewQuote;
      conflictFound = true;
   }
})
if(conflictFound) notifyUser("Quotes synced with server!");
return merged
}

//notify user

function notifyUser(message){
   const notification = document.createElement("div");
   notification.textContent = message;
   notification.style.position = "fixed";
   notification.style.bottom = "10px";
   notification.style.left = "10px";
   notification.style.backgroundColor = "#333";
   notification.style.color = "white"
   notification.style.padding = "10px";
   notification.style.borderRadius = "5px";
   document.body.appendChild(notification);
   setTimeout(() => notification.remove(), 4000);
}

//syncing: fetch, merge, save and refresh

   async function syncQuotes(){
   const localQuotes = getLocalQuotes();
   const server = await fetchQuotesFromServer();
   const combinedQuotes = await mergeQuotes(localQuotes, server);
   saveLocalQuotes(combinedQuotes);
   const selectedCategory = localStorage.getItem("selectedCategory") || "All";
   populateCategories()
   filterQuotes(selectedCategory);
   
}

//periodic syncing
// syncQuotes();
// setInterval(syncQuotes, 30000);

addBtn.addEventListener("click", createAddQuoteForm);
populateCategories();
const selectedCategory = localStorage.getItem('selectedCategory') || "All";
filterQuotes(selectedCategory);
syncQuotes();
setInterval(syncQuotes, 30000);






 


