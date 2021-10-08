// get API key from spoonacular
// var apiKey = '26555838e1c640c8909140566fd58a8e';
// var apiKey = '05cf9b96da3f4148be6fb375f52b09f7';
// var apiKey = "4a6a04aea236416ab98658ba50b78531";
var apiKey = "2a64281727af48ea8db7e73091d1ab74" 

// get main elements from HTML based on their id
var ingredientsBox = document.getElementById('userIngredients');
var generateBtn = document.getElementById('generate-recipe');
var autocompleteInput = document.getElementById('autocomplete-input');
var submitBtn = document.getElementById('searchBtn');
var ourRecipeCards = document.getElementById('ourRecipeCards');
// declare global variables
var autoCompleteListItem, search_value, obj;
// define recipe results and individual ingredients
var individual_ingredients = '';
var recipeResults = [];
// create empty array to hold user input values
var massiveDataStructure = [ Array(), Array(), Array() ];
var userInputArray = [];
var userStorageArray = JSON.parse(localStorage.getItem('userIngredients'));

if (userStorageArray !== null) {
	userInputArray = userStorageArray;
	for (var i = 0; i < userInputArray.length; i++) {
		populateIngredient(userInputArray[i]);
	}
}
// add event listener to submit button
submitBtn.addEventListener('click', function(e) {
	e.preventDefault();
	console.log(autocompleteInput.value);
	// push user input value onto user input array
	userInputArray.push(autocompleteInput.value);
	console.log(userInputArray);
	// push on array of options it gives us users ingredients we want to store that arrray in local storage
	localStorage.removeItem('userIngredients');
	localStorage.setItem('userIngredients', JSON.stringify(userInputArray));
	populateIngredient(autocompleteInput.value);
	autocompleteInput.value = '';
});

function populateIngredient(ingredient) {
	// resetting value of user input box
	var ingredientsBtn = document.createElement('div');
	ingredientsBtn.setAttribute('class', 'chip');
	ingredientsBtn.setAttribute('style', 'line-height: 7.5px;');
	var paragraph = document.createElement('p');
	paragraph.textContent = ingredient;
	paragraph.setAttribute('style', 'display:inline-block; ');
	ingredientsBtn.appendChild(paragraph);
	var closeIcon = document.createElement('i');
	closeIcon.setAttribute('class', 'close material-icons');
	closeIcon.textContent = 'delete_forever';
	closeIcon.setAttribute('style', 'display:inline-block');
	closeIcon.addEventListener('click', function(event) {
		var newArray = [];
		for (var element of userInputArray) {
			console.log(event.target.parentElement.firstChild.textContent);
			if (element !== event.target.parentElement.firstChild.textContent) {
				newArray.push(element);
			}
			localStorage.removeItem('userIngredients');
			localStorage.setItem('userIngredients', JSON.stringify(newArray));
		}
	});
	ingredientsBtn.appendChild(closeIcon);
	ingredientsBox.appendChild(ingredientsBtn);
}
// function to generate an array of autocomplete list items
function autoCompleteApiCall(autoCompleteAPI) {
	$.ajax({
		url: autoCompleteAPI,
		method: 'GET',
		// store API call into cache for quicker processing
		cache: true
	}).then(function(response) {
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
			minLength: 1
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
			individual_ingredients = individual_ingredients + ',+' + userInputArray[i];
		}
	}
	console.log(individual_ingredients);
}

var inputField = document.querySelector('.autocomplete');
var autoCompleteOptions = [];
// create key up event listener for autocomplete input
autocompleteInput.addEventListener('keyup', function() {
	console.log(autocompleteInput.value);
	// set the search value to be the current autocomplete input's value
	search_value = autocompleteInput.value;
	// create query string for API call with search value and api key
	var autoCompleteAPI = `https://api.spoonacular.com/food/ingredients/autocomplete?query=${search_value}&number=15&apiKey=${apiKey}`;
	// call autocomplete function
	console.log(autoCompleteAPI);
	autoCompleteApiCall(autoCompleteAPI);
});
// add event listener for generate button
generateBtn.addEventListener('click', generateRecipes);

var potentialRecipe;
var recipeCollection = [];

function generateRecipes() {
	ourRecipeCards.innerHTML = '';
	buildIngredientsQuery();
	// create dynamic recipe by ingredient api call
	var recipeByIngredient = `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${individual_ingredients}&number=10&ranking=2&apiKey=${apiKey}`;
	// fetch the recipe based on ingredients from API
	fetch(recipeByIngredient)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log(data.length);
			// accessing recipes in returned array of data
			for (var element of data) {
				console.log(element);
				// if there are no missing ingredients
				if (element.missedIngredientCount === 0) {
					// get each potential recipe from api data
					potentialRecipe = element;
					console.log(potentialRecipe);
					// push result onto an array
					recipeResults.push(potentialRecipe);
					massiveDataStructure[0].push(potentialRecipe);
				}
			}
			// TODO - If we have time, show them recipes they are 1 item away from being able to make
			console.log(recipeResults);
			// massiveDataStructure.push(recipeResults);
			for (var i = 0; i < recipeResults.length; i++) {
				console.log(recipeResults[i]);
				// // img url
				// console.log(recipeResults[i].image);
				// recipeImgURL = recipeResults[i].image;
				// // title of recipe
				// console.log(recipeResults[i].title);
				// recipeTitle = recipeResults[i].title;
				// // array of the ingredients used in recipe
				// console.log(recipeResults[i].usedIngredients);
				// usedIngredientsArray = recipeResults[i].usedIngredients;
				// get recipe item/object
				var recipeItem = recipeResults[i];
				// extract recipe ID for nutrition info
				var recipeID = recipeItem.id;
				// call nutrition info function with recipe ID parameter
				console.log(recipeID);

				// recipeCollection.push(recipeResults[i]);

				recipeNutritionInfo(recipeID);
			}
			setTimeout(displayRecipeCards,3000); 
			// loop through the array of results
			// for (var i = 0; i < recipeResults.length; i++) {
			//     // get recipe item/object
			//     var recipeItem = recipeResults[i];
			//     // extract recipe ID for nutrition info
			//     var recipeID = recipeItem.id;
			//     // call nutrition info function with recipe ID parameter
			//     console.log(recipeID);
			//     recipeNutritionInfo(recipeID);
			// }
		});
}
var nutritionArray = [];
// create function to display nutrition information for each recipe
function recipeNutritionInfo(ID) {
	// dynamically access nutrition info API
	var fetchRecipeNutrition = `https://api.spoonacular.com/recipes/${ID}/nutritionWidget.json?apiKey=${apiKey}`;
	// fetch data from the api
	fetch(fetchRecipeNutrition)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			massiveDataStructure[1].push(data);
			// get access to individual nutrition info data points of concern
			console.log(data);
			// console.log(data.calories);
			// calories = data.calories;
			// console.log(data.carbs);
			// carbs = data.carbs;
			// console.log(data.fat);
			// fat = data.fat;
			// console.log(data.protein);
			// protein = data.protein;
			// // sat fat
			// console.log(`${data.bad["2"].title}: ${data.bad["2"].amount}`);
			// satFat = data.bad["2"].amount;
			// // sugar
			// console.log(`${data.bad["4"].title}: ${data.bad["4"].amount}`);
			// sugar = data.bad["4"].amount;
			// // sodium
			// console.log(`${data.bad["6"].title}: ${data.bad["6"].amount}`);
			// sodium = data.bad["6"].amount;
			// console.log(`${data.good["15"].title}: ${data.good["15"].amount}`)
			// console.log(`${data.good["9"].title}: ${data.good["9"].amount}`)
			// console.log(`${data.good["18"].title}: ${data.good["18"].amount}`)
			// TODO - They have a "good" array of nutrition info including fiber, iron, etc. (if we want to do that later ... it's kinda complicated)
		}).then( function(stuff) {
			getRecipeInstructions(ID)
		});
}

var instructionsArray = [];

function getRecipeInstructions(ID) {
	var instrAPI = `https://api.spoonacular.com/recipes/${ID}/information?apiKey=${apiKey}`;
	console.log(instrAPI);
	fetch(instrAPI)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			massiveDataStructure[2].push(data);
			console.log(data);
			// get source url
			// console.log(data.sourceUrl);
			// sourceURL = data.sourceUrl;
			// console.log(data.sourceName);
			// sourceName = data.sourceName;
			// // console.log(data.summary);
			// recipeSummary = data.summary;
			// // console.log(data.instructions);
			// recipeInstr = data.instructions;
			// // console.log(data.readyInMinutes);
			// recipeTime = data.readyInMinutes;
			// TODO - specify food allergies with this API call
			// displayRecipeCards();
		});
}

var recipeImgURL, recipeTitle, calories, carbs, fat, protein, satFat, sugar, sodium, sourceURL, sourceName, recipeTime;
// populate recipe cards
function displayRecipeCards() {
	// massiveDataStructure.push(nutritionArray);
	// massiveDataStructure.push(instructionsArray);
	console.log(massiveDataStructure);
	for (let i = 0; i < massiveDataStructure[0].length; i++) {
		// create div element for the from of the recipe card
		var singleRecipeCard = document.createElement('div');
		singleRecipeCard.setAttribute('class', 'card');
		ourRecipeCards.appendChild(singleRecipeCard);
		
		for (let j = 0; j < massiveDataStructure.length; j++) {
			if (j === 0) {
				// TODO --> FIRST ITEM IN ARRAY
				console.log(massiveDataStructure[j][i]);
				// img url
				console.log(massiveDataStructure[j][i].image);
				recipeImgURL = massiveDataStructure[j][i].image;
				// title of recipe
				console.log(massiveDataStructure[j][i].title);
				recipeTitle = massiveDataStructure[j][i].title;
				// array of the ingredients used in recipe
				// console.log(massiveDataStructure[j][i].usedIngredients);
				// var usedIngredientsArray = massiveDataStructure[j][i].usedIngredients;
			} else if (j === 1) {
				console.log(massiveDataStructure[j][i]);
				//TODO --> SECOND ITEM IN ARRAY
				// console.log(massiveDataStructure[j][i].calories);
				calories = massiveDataStructure[j][i].calories;
				// console.log(massiveDataStructure[j][i].carbs);
				carbs = massiveDataStructure[j][i].carbs;
				// console.log(massiveDataStructure[j][i].fat);
				fat = massiveDataStructure[j][i].fat;
				// console.log(massiveDataStructure[j][i].protein);
				protein = massiveDataStructure[j][i].protein;
				// sat fat
				// console.log(
				// `${massiveDataStructure[j][i].bad['2'].title}: ${massiveDataStructure[j][i].bad['2'].amount}`
				// );
				satFat = massiveDataStructure[j][i].bad['2'].amount;
				// sugar
				// console.log(
				// `${massiveDataStructure[j][i].bad['4'].title}: ${massiveDataStructure[j][i].bad['4'].amount}`
				// );
				sugar = massiveDataStructure[j][i].bad['4'].amount;
				// sodium
				// console.log(`${massiveDataStructure[j][i].bad['6'].title}: ${massiveDataStructure[j][i].bad['6'].amount}`);
				sodium = massiveDataStructure[j][i].bad['6'].amount;
			} else if (j === 2) {
				// TODO --> THIRD ITEM IN ARRAY
				// console.log(massiveDataStructure[j][i].sourceUrl);
				sourceURL = massiveDataStructure[j][i].sourceUrl;
				// console.log(massiveDataStructure[j][i].sourceName);
				sourceName = massiveDataStructure[j][i].sourceName;
				// console.log(massiveDataStructure[j][i].summary);
				// var recipeSummary = massiveDataStructure[j][i].summary;
				// // console.log(massiveDataStructure[j][i].instructions);
				// var recipeInstr = massiveDataStructure[j][i].instructions;
				// // console.log(massiveDataStructure[j][i].readyInMinutes);
				recipeTime = massiveDataStructure[j][i].readyInMinutes;
			}
			singleRecipeCard.innerHTML = `
			<div class="card-image waves-effect waves-block waves-light">
				<div class="col s12 m5">
					<img class="activator" src="${recipeImgURL}" />
				</div>
			</div>
			<div class="card-content">
				<span class="card-title activator">${recipeTitle}<i class="material-icons right">more_vert</i></span>
				<p><a href="${sourceURL}" target="_blank" id="linkToRecipe">See Full Recipe On ${sourceName}</a></p>
			</div>
			<div class="card-reveal">
				<span class="card-title">Nutritional Values<i class="material-icons right">close</i></span>
				<table class="striped">
					<thead>
						<tr>
						<th>Nutrition Facts</th>
						<th>Amount</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Calories</td>
							<td id="calVal">${calories}</td>
						</tr>
						<tr>
							<td>Carbs</td>
							<td id="carbVal">${carbs}</td>
						</tr>
						<tr>
							<td>Fat</td>
							<td id="fatVal">${fat}</td>
						</tr>
						<tr>
							<td>SaturatedFat</td>
							<td id="satFatVal">${satFat}</td>
						</tr>
						<tr>
							<td>Protein</td>
							<td id="proteinVal">${protein}</td>
						</tr>
						<tr>
							<td>Sugar</td>
							<td id="sugarVal">${sugar}</td>
						</tr>
						<tr>
							<td>Sodium</td>
							<td id="sodiumVal">${sodium}</td>
						</tr>
					</tbody>
				</table>
				<div>
					<ul id="cardFooter">
						<li class="prepTime">Estimated Prep + Cook Time: ${recipeTime}</li>
						<li class="sourceName">Source: <a href="${sourceURL}" target="_blank">${sourceName}</a></li>
					</ul>
				</div>
			</div>`;
		}

		// add inner HTML to use materialize components
		// singleRecipeCard.innerHTML = `
		// <div class="card-image waves-effect waves-block waves-light">
		// 	<div class="col s12 m5">
		// 		<img class="activator" src="${recipeImgURL}" />
		// 	</div>
		// </div>
		// <div class="card-content">
		// 	<span class="card-title activator">${recipeTitle}<i class="material-icons right">more_vert</i></span>
		// 	<p><a href="${sourceURL}" target="_blank" id="linkToRecipe">See Full Recipe On ${sourceName}</a></p>
		// </div>
		// <div class="card-reveal">
		// 	<span class="card-title">Nutritional Values<i class="material-icons right">close</i></span>
		// 	<table class="striped">
		// 		<thead>
		// 			<tr>
		// 			<th>Nutrition Facts</th>
		// 			<th>Amount</th>
		// 			</tr>
		// 		</thead>
		// 		<tbody>
		// 			<tr>
		// 				<td>Calories</td>
		// 				<td id="calVal">${calories}</td>
		// 			</tr>
		// 			<tr>
		// 				<td>Carbs</td>
		// 				<td id="carbVal">${carbs}</td>
		// 			</tr>
		// 			<tr>
		// 				<td>Fat</td>
		// 				<td id="fatVal">${fat}</td>
		// 			</tr>
		// 			<tr>
		// 				<td>SaturatedFat</td>
		// 				<td id="satFatVal">${satFat}</td>
		// 			</tr>
		// 			<tr>
		// 				<td>Protein</td>
		// 				<td id="proteinVal">${protein}</td>
		// 			</tr>
		// 			<tr>
		// 				<td>Sugar</td>
		// 				<td id="sugarVal">${sugar}</td>
		// 			</tr>
		// 			<tr>
		// 				<td>Sodium</td>
		// 				<td id="sodiumVal">${sodium}</td>
		// 			</tr>
		// 		</tbody>
		// 	</table>
		// 	<div>
		// 		<ul id="cardFooter">
		// 			<li class="prepTime">Estimated Prep + Cook Time: ${recipeTime}</li>
		// 			<li class="sourceName">Source: <a href="${sourceURL}" target="_blank">${sourceName}</a></li>
		// 		</ul>
		// 	</div>
		// </div>`
	}
}

// // create div element for the from of the recipe card
// var singleRecipeCard = document.createElement('div');
// singleRecipeCard.setAttribute("class", "card");
// // add inner HTML to use materialize components
// singleRecipeCard.innerHTML = `
// 	<div class="card-image waves-effect waves-block waves-light">
// 		<div class="col s12 m5">
// 			<img class="activator" src="${recipeImgURL}" />
// 		</div>
// 	</div>
// 	<div class="card-content">
// 		<span class="card-title activator">${recipeTitle}<i class="material-icons right">more_vert</i></span>
// 		<p><a href="${sourceURL}" target="_blank" id="linkToRecipe">See Full Recipe On ${sourceName}</a></p>
// 	</div>
// 	<div class="card-reveal">
// 		<span class="card-title">Nutritional Values<i class="material-icons right">close</i></span>
// 		<table class="striped">
// 			<thead>
// 				<tr>
// 				<th>Nutrition Facts</th>
// 				<th>Amount</th>
// 				</tr>
// 			</thead>
// 			<tbody>
// 				<tr>
// 					<td>Calories</td>
// 					<td id="calVal">${calories}</td>
// 				</tr>
// 				<tr>
// 					<td>Carbs</td>
// 					<td id="carbVal">${carbs}</td>
// 				</tr>
// 				<tr>
// 					<td>Fat</td>
// 					<td id="fatVal">${fat}</td>
// 				</tr>
// 				<tr>
// 					<td>SaturatedFat</td>
// 					<td id="satFatVal">${satFat}</td>
// 				</tr>
// 				<tr>
// 					<td>Protein</td>
// 					<td id="proteinVal">${protein}</td>
// 				</tr>
// 				<tr>
// 					<td>Sugar</td>
// 					<td id="sugarVal">${sugar}</td>
// 				</tr>
// 				<tr>
// 					<td>Sodium</td>
// 					<td id="sodiumVal">${sodium}</td>
// 				</tr>
// 			</tbody>
// 		</table>
// 		<div>
// 			<ul id="cardFooter">
// 				<li class="prepTime">Estimated Prep + Cook Time: ${recipeTime}</li>
// 				<li class="sourceName">Source: <a href="${sourceURL}" target="_blank">${sourceName}</a></li>
// 			</ul>
// 		</div>
// 	</div>`
// 	ourRecipeCards.appendChild(singleRecipeCard);
// api = '42753b9f905340ec9bec5c347c6f8ebd';

// event listener from materialize that opens the side drawer
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.sidenav');
	var instances = M.Sidenav.init(elems);
});

// event listener for the dropdown
document.addEventListener('DOMContentLoaded', function() {
	var elems = document.querySelectorAll('.modal');
	var instances = M.Modal.init(elems);
});
