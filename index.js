const apiKey = "d7a802ca-4432-4dc0-a498-003a5df1a297";
//api key

//variables
const header = document.querySelector(".header");
const startPage = document.querySelector(".startPage");
const loader = document.querySelector(".loader");
const footer = document.querySelector(".footer");
const cardBox = document.querySelector(".cardBox");
const details = document.querySelector(".details");
const myForm = document.querySelector("#myForm");
const inputField = document.querySelector(".inputField");
const goBack = document.querySelector(".goBack");
const button1 = document.querySelector(".button1");
const buttonsHeader = document.querySelector(".buttonsHeader");
const addToBookmark = document.querySelector(".addToBookmark");
const bookmarksCollection = document.querySelector(".bookmarksCollection");
const bookmarksCollectionData = document.querySelector(
  ".bookmarksCollectionData"
);
const bookmarkPopup = document.querySelector(".bookmarkPopup");
const logoMain = document.querySelector(".logoMain");
const bookmarksTabText = document.querySelector(".bookmarksTabText");
const bookmarksGoHome = document.querySelector(".bookmarksGoHome");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let foodItems;
let detailsItem;
let dataBookmark = ""; //for storing bookmark data

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// fetchDetails function for showing details of the recipe selected
async function fetchDetails(dataItem) {
  let detailsItemsInformation = ""; //declaring it here so that it gets reseted on every fetch

  loader.classList.remove("hidden"); //for adding loader class

  const res = await fetch(
    `https://forkify-api.herokuapp.com/api/v2/recipes/${dataItem}?key=${apiKey}`
  );
  const data = await res.json();
  // console.log(data);
  detailsItem = data.data.recipe;
  // console.log(detailsItem);

  detailsItemsInformation = `<div class='detailsItemBox'>
       <div class='detailsItems1'>
       <div class='foodItemTitle'>⟪ ${detailsItem.title} ⟫</div>
       <img class='imageDetails' src='${
         detailsItem.image_url
       }' alt='foodItem image' />
       <div class='foodItemPublisher'>by- ${detailsItem.publisher}</div>
       </div>
       <div class='detailsItems2'>
       <div class='servings'>Servings : ${detailsItem.servings}</div>
       <div class='cooking_time'>Cooking time : ${
         detailsItem.cooking_time
       } min</div>
       <div class='detailsRecipeIngredients'>♦️♦️♦️ Recipe Ingredients ♦️♦️♦️</div>
       <div class='ingredientsBox'>
       <div class='detailsIngredient'>
       ${detailsItem.ingredients
         .map(
           (item, index) =>
             `<div class='detailsItemIngredient'>${
               item.quantity === null ? "" : item.quantity
             } ${item.unit} ${item.description}</div>`
         )
         .join("")}
       </div>
      
       </div>
       </div>
       <div class='detailsRecipeBox'>
       <div class='howToCook'>♦️♦️♦️ How to cook ♦️♦️♦️</div>
       <div class='carefullyDetails'>This recipe was carefully designed and tested by ${
         detailsItem.publisher
       }. Please check out directions at their website.</div>
       <a href='${
         detailsItem.source_url
       }' target="_blank" class='clickHere'>Directions ➔</a>
       </div>
       </div>`;

  loader.classList.add("hidden"); // Remove the loader class
  details.innerHTML = detailsItemsInformation;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Define an array to store bookmarked recipe details
const storedValue = localStorage.getItem("bookmarks");
const parsedValue = JSON.parse(storedValue);
let bookmarkedRecipes = storedValue === null ? [] : parsedValue;
console.log(bookmarkedRecipes);

// Function to add a recipe to the bookmarks
function addRecipeToBookmarks(recipe) {
  const duplicateRecipe = bookmarkedRecipes.some(
    (item) => item.id === recipe.id
  );
  if (duplicateRecipe) return;

  bookmarkedRecipes.push(recipe);
  console.log(bookmarkedRecipes);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarkedRecipes));
}

// Add a click event listener to the addToBookmark button
addToBookmark.addEventListener("click", function (e) {
  // dataBookmark='';
  if (detailsItem) {
    addRecipeToBookmarks(detailsItem);

    bookmarkPopup.classList.remove("hidden");

    // using this to show popup for some time
    setTimeout(function () {
      bookmarkPopup.classList.add("hidden");
    }, 2000);
  }
});

//for showing bookmarks
button1.addEventListener("click", function (e) {
  bookmarksCollection.classList.toggle("hidden");
  renderButton();
  function renderButton() {
    dataBookmark = ""; // clearing data before adding

    console.log(bookmarkedRecipes);

    //for showing existing bookmark data by re uploading it.

    bookmarkedRecipes.length === 0
      ? (dataBookmark = `<div class='noBookmarkData'>🔖 start bookmarking :)</div>`)
      : bookmarkedRecipes.forEach((element, index) => {
          dataBookmark += `<div class='bookmarkedDataItemContainer'>
        <div class='bookmarkDataItem'>${element.title}</div>
        <div class='bookmarkDataDelete'>❌</div>
        </div>`;
        });

    bookmarksCollectionData.innerHTML = dataBookmark; //adding bookmark data

    bookmarkedRecipes.forEach((element, index) => {
      const bookmarkDataItemAll =
        document.querySelectorAll(".bookmarkDataItem");

      // bookmark tab data will get its own event listener for showing details
      bookmarkDataItemAll[index].addEventListener("click", function (e) {
        console.log(element.title);
        console.log(element.id);

        startPage.style.display = "none";
        details.classList.remove("hidden");
        cardBox.style.display = "none";
        myForm.style.display = "none";
        buttonsHeader.classList.add("hidden");
        bookmarksCollection.classList.add("hidden");
        logoMain.style.visibility = "hidden";
        bookmarksTabText.classList.remove("hidden");
        bookmarksGoHome.classList.remove("hidden");
        header.style.backgroundColor = "#FECDA6";

        fetchDetails(element.id); //calling
      });

      //for deleting bookmarked recipes
      const bookmarkDataDeleteAll = document.querySelectorAll(
        ".bookmarkDataDelete"
      ); // for selecting all

      bookmarkDataDeleteAll[index].addEventListener("click", function (e) {
        e.preventDefault();
        console.log("Delete button clicked");
        let newObj = bookmarkedRecipes.filter(
          (data, index) => data.id !== element.id
        );
        bookmarkedRecipes = newObj;
        localStorage.setItem("bookmarks", JSON.stringify(newObj));
        renderButton();
      });
    });
  }
});

//bookmarks logic ends here

// After form(search) sumbmission
myForm.addEventListener("submit", function (e) {
  e.preventDefault();
  startPage.style.display = "none";
  bookmarksCollection.classList.add("hidden");
  footer.style.display = "none";
  // buttonsHeader.classList.add('hidden');
  buttonsHeader.style.visibility = "hidden";
  // console.log(inputField.value);

  //for fetching recipes details in cardBox
  async function fetchData(searchQuery) {
    try {
      let items =
        ""; /* for storing foodItems , also it resets everytimes so that existing recipe does not gets added to the new recipe*/

      cardBox.innerHTML = ""; // for resetting the cardBox items

      loader.classList.remove("hidden"); //loader
      const res = await fetch(
        `https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchQuery}&key=${apiKey}`
      );

      const data = await res.json();
      console.log(res);
      console.log(data);
      foodItems = data.data.recipes;
      console.log(foodItems);

      //for adding new recipes in cardBox
      foodItems.length === 0
        ? (items = `<div class="errorRecipe">Recipe not found :( <br> Check recipes list on my github repository . <br> </div>`)
        : foodItems.forEach((foodItem, index) => {
            items += `
            <div class='cardBoxItems'>
                <img class="cardBoxItemsImage" src="${foodItem.image_url}" alt="${foodItem.title}" />
                <p class='cardBoxItemsText'>${foodItem.title}</p>
                <div class='cardBoxItemsFooter'>
                Publisher : ${foodItem.publisher}
            </div>
            </div>  
        `;
          });

      loader.classList.add("hidden"); //for removing loader class

      cardBox.innerHTML = items;

      //for adding event listener of every element of cardBoxItems
      const cardBoxItems = document.querySelectorAll(".cardBoxItems"); //for creating a cardBoxItems bcz it is not defined at the start of this program
      foodItems.forEach((foodItem, index) => {
        cardBoxItems[index].addEventListener("click", (e) => {
          details.classList.remove("hidden");
          goBack.classList.remove("hidden");
          cardBox.style.display = "none";
          myForm.style.display = "none";
          buttonsHeader.classList.add("hidden");
          addToBookmark.classList.remove("hidden");

          // Add a click event listener for the 'goBack' button to go back to the recipe list
          goBack.addEventListener("click", function () {
            details.innerHTML = ""; // Clear the details content
            goBack.classList.add("hidden");
            details.classList.add("hidden");
            cardBox.style.display = "flex";
            myForm.style.display = "flex";
            buttonsHeader.classList.remove("hidden");
            addToBookmark.classList.add("hidden");
          });

          fetchDetails(foodItem.id); //calling
        });
      });
    } catch (error) {
      loader.classList.add("hidden");
      cardBox.innerHTML = `<div class='errorRecipe'>${error.message} :( <br>Try again later</div>`;
    }
  }

  fetchData(inputField.value); //calling the async function
});
