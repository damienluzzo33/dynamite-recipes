// get API key from spoonacular
var apiKey = "26555838e1c640c8909140566fd58a8e";
// get main elements from HTML based on their id
var ingredientsBox = document.getElementById("ingredients");
var generateBtn = document.getElementById("generate-recipe");
var autocompleteInput = document.getElementById("autocomplete-input");
var submitBtn = document.getElementById("searchBtn");
// declare global variables
var autoCompleteListItem, search_value, obj;
// define recipe results and individual ingredients
var individual_ingredients = "";
var recipeResults = [];
// create empty array to hold user input values
var userInputArray = [];
// add event listener to submit button
submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(autocompleteInput.value);
    // push user input value onto user input array
    userInputArray.push(autocompleteInput.value);
    console.log(userInputArray);
    // resetting value of user input box
    var ingredientsBtn = document.createElement("button");
    ingredientsBtn.textContent = autocompleteInput.value;
    ingredientsBtn.setAttribute(
        "style",
        "width: 50px; height: 25px; color: white; background-color: red"
    );
    ingredientsBox.appendChild(ingredientsBtn);
    autocompleteInput.value = "";
});
// function to generate an array of autocomplete list items
function autoCompleteApiCall(autoCompleteAPI) {
    $.ajax({
        url: autoCompleteAPI,
        method: "GET",
        // store API call into cache for quicker processing
        cache: true,
    }).then(function (response) {
        autoCompleteListItem = [];
        // loop over data returned from autocomplete api
        for (var i = 0; i < response.length; i++) {
            // push onto list of options array for autocomplete functionality
            autoCompleteListItem.push(response[i].name);
        }
        console.log(autoCompleteListItem);
        obj = autoCompleteListItem.reduce((a, v) => ({ ...a, [v]: null }), {});
        var instances = M.Autocomplete.init(inputField, {
            // we need to make this data dynamic
            data: obj,
            // limit autocomplete results to 6 items
            limit: 6,
            // make sure at least one item is displayed if autocomplete is working
            minLength: 1,
        });
        // keep the autocomplete open for the user
        instances.open();
        // return instances object
        return instances;
    });
}
// build individual ingredients query string
function buildIngredientsQuery() {
    // loop through the array of user input values
    for (var i = 0; i < userInputArray.length; i++) {
        if (i === 0) {
            //add individual ingredient to query string for api call
            individual_ingredients = individual_ingredients + userInputArray[i];
        } else {
            individual_ingredients =
                individual_ingredients + ",+" + userInputArray[i];
        }
    }
    console.log(individual_ingredients);
}

var inputField = document.querySelector(".autocomplete");
var autoCompleteOptions = [];
// create key up event listener for autocomplete input
autocompleteInput.addEventListener("keyup", function () {
    console.log(autocompleteInput.value);
    // set the search value to be the current autocomplete input's value
    search_value = autocompleteInput.value;
    // create query string for API call with search value and api key
    var autoCompleteAPI = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${search_value}&number=15&apiKey=${apiKey}`;
    // call autocomplete function
    autoCompleteApiCall(autoCompleteAPI);
});
// add event listener for generate button
generateBtn.addEventListener("click", generateRecipes);
function generateRecipes() {
    buildIngredientsQuery();
    // create dynamic recipe by ingredient api call
    var recipeByIngredient = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${individual_ingredients}&number=20&apiKey=${apiKey}&ranking=2`;
    // fetch the recipe based on ingredients from API
    fetch(recipeByIngredient)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            // accessing recipes in returned array of data
            for (var key in data) {
                console.log(data[`${key}`]);
                // if there are no missing ingredients
                if (data[`${key}`].missedIngredientCount === 0) {
                    // get each potential recipe from api data
                    var potentialRecipe = data[`${key}`];
                    console.log(potentialRecipe.title);
                    // push result onto an array
                    recipeResults.push(potentialRecipe);
                }
            }
            console.log(recipeResults);
            for (var i = 0; i < recipeResults.length; i++) {
                console.log(recipeResults[i]);
                console.log(recipeResults[i].image);
                console.log(recipeResults[i].title);
                console.log(recipeResults[i].usedIngredients);
            }
            // loop through the array of results
            for (var i = 0; i < recipeResults.length; i++) {
                // get recipe item/object
                var recipeItem = recipeResults[i];
                // extract recipe ID for nutrition info
                var recipeID = recipeItem.id;
                // call nutrition info function with recipe ID parameter
                console.log(recipeID);
                recipeNutritionInfo(recipeID);
            }
        });
}

// create function to display nutrition information for each recipe
function recipeNutritionInfo(ID) {
    // dynamically access nutrition info API
    var fetchRecipeNutrition = `https://api.spoonacular.com/recipes/${ID}/nutritionWidget.json?apiKey=${apiKey}`;
    // fetch data from the api
    fetch(fetchRecipeNutrition)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // get access to individual nutrition info data points of concern
            console.log(data);
            console.log(data.calories);
            console.log(data.carbs);
            console.log(data.fat);
            console.log(data.protein);
            console.log(`${data.bad["2"].title}: ${data.bad["2"].amount}`);
            console.log(`${data.bad["4"].title}: ${data.bad["4"].amount}`);
            console.log(`${data.bad["6"].title}: ${data.bad["6"].amount}`);
            // console.log(`${data.good["15"].title}: ${data.good["15"].amount}`)
            // console.log(`${data.good["9"].title}: ${data.good["9"].amount}`)
            // console.log(`${data.good["18"].title}: ${data.good["18"].amount}`)
            // TODO - They have a "good" array of nutrition info including fiber, iron, etc. (if we want to do that later ... it's kinda complicated)
        });
}
// api = '42753b9f905340ec9bec5c347c6f8ebd';

// event listener from materialize that opens the side drawer
document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".sidenav");
    var instances = M.Sidenav.init(elems);
});

// event listener for the dropdown
document.addEventListener("DOMContentLoaded", function () {
    var elems = document.querySelectorAll(".modal");
    var instances = M.Modal.init(elems);
});
