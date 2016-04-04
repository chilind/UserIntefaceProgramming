/*
*	Set global variables
*/
var admin = "ervtod"; //admin Ervin Todd
var user = "elepic";//user Elektra Pickle
var undoArr = []; //Array for undos
var redoArr = []; //Array for redos
var nrCancelBeers = [];
var nrRmBeers = ["",0];
var hidden = false;

function printObj(obj) {
	console.log(JSON.stringify(obj, null, 4));
}

/*
* help function
*	returns a rounded value with a precise amount of decimals
*/
function decimalRound(price, cartcount) {
	// return +(price * cartcount).toFixed(2);
	return Math.round((price * cartcount) * 100) / 100;
}

/*
* Sets the "Sum" in the DOM to the sum of all beers
*/
function cartSum() {
	var cartitems = $("#cart .beer");
	var sum = 0;
	$.each(cartitems, function(i, beer) {
		sum += (decimalRound($(beer).data("price"), $(beer).data("cartcount")));
	});
	$("#cart .sum span").text(sum.toFixed(2));
}

/*
* Loops all beers and checks if each individual beer is sold out or not
*/
function checkSoldOut() {
	var beers = $("#beers .beer");
	$.each(beers, function(i, beer) {
		if ($(beer).find(".beer__count").text() <= 0) {
			$(beer).find(".beer__count").addClass('sold-out');
		} else {
			$(beer).find(".beer__count").removeClass('sold-out');
		}
	});
}

/*
* Function only to display (in console) if an admin or user is logged in
*/
window.onload = function adminOrUser(){
	var isAdminOrUser = sessionStorage.getItem('adminOrUser');
	/* document.getElementById("fooHolder").innerHTML = isAdminOrUser.toString(); */
	console.log("Admin or user: ",isAdminOrUser);
	if(isAdminOrUser === "admin"){
        document.body.setAttribute("data-admin","true");
    }
};

/*
* Called by primarily Drop (mouse drag action)
* Puts a beer in the cart and removes a beer from the beer-menu
* Prevents action if the beer is sold out
*/
function addBeer(beer_id) {
	var $menu_beer = $("#b-"+beer_id);
	var $cart_beer = $("#cart").find("#c-"+beer_id);
	if ($menu_beer.find(".beer__count").text() > 0) { //are there any beers available?
		if ($cart_beer.length) {  //create new element
			console.log("addBeer: "+$cart_beer.data("namn"));
			var cart_beer_price = $cart_beer.data("price");
			var cart_beer_count = $cart_beer.data('cartcount') + 1;
			$cart_beer.data('cartcount', cart_beer_count);
			$cart_beer.find(".beer__count").text(cart_beer_count);
			$cart_beer.find(".beer__price").text(decimalRound(cart_beer_price, cart_beer_count));

			var beer_id = $cart_beer.data("id");

			var $menu_beer = $("#b-"+beer_id);
			var $menu_beer_count = $menu_beer.find(".beer__count");
			var menu_beer_count = $menu_beer.data("count");
			$menu_beer.find(".beer__count").text(menu_beer_count - cart_beer_count);

			checkSoldOut();
			cartSum();
			undoArr.push([$cart_beer.data("id"),1]);

		} else {
			var $cart_beer_copy = $menu_beer.clone();
			$cart_beer_copy.attr('id', 'c-'+beer_id);
			$cart_beer_copy.append("<div class='beer__control'></div>");
			//BIND REMOVE EVENT
			$cart_beer_copy.find(".beer__control").append("<div class='remove'></div>");
			$cart_beer_copy.find(".remove").on("click", function(ev) {
				printObj("remove addbeer");
				nrRmBeers = [($(ev.target).parent().parent().data("id")),($(ev.target).parent().parent().data("cartcount"))];
				removeBeer($(ev.target).parent().parent().data("id"));
				ev.stopPropagation(); //stop event bubbling
			});
			//BIND SUB EVENT
			$cart_beer_copy.find(".beer__control").append("<div class='sub'></div>");
			$cart_beer_copy.find(".sub").on("click", function(ev) {
				subBeer($(ev.target).parent().parent().data("id"));
				ev.stopPropagation(); //stop event bubbling
			});
			//BIND ADD EVENT
			$cart_beer_copy.find(".beer__control").append("<div class='add'></div>");
			$cart_beer_copy.find(".add").on("click", function(ev) {
				addBeer($(ev.target).parent().parent().data("id"));
				ev.stopPropagation(); //stop event bubbling
			});

			//add to cart
			$("#cart .cart__bucket").append($cart_beer_copy);
			$cart_beer_copy.fadeIn("500", function() {
				console.log("ani done");
			});
			$cart_beer_copy.find(".beer__count").text("1");
			$cart_beer_copy.data($menu_beer.data());
			$cart_beer_copy.data("cartcount", 1);
			//remove count from beers
			var menu_beer_count = $menu_beer.data("count");
			$menu_beer.find(".beer__count").text(menu_beer_count - 1);

			checkSoldOut();
			cartSum();
			undoArr.push([$cart_beer_copy.data("id"),1]);
		}
	}
}

/*
* Removes ONE beer from the cart. If the beer count goes to 0, the beer is completely removed
*/
function subBeer(beer_id) {
	var $cart_beer = $("#c-"+beer_id);
	var $menu_beer = $("#beers").find("#b-"+beer_id);

	console.log("subBeer: "+$cart_beer.data("namn"));
	var cart_beer_price = $cart_beer.data("price");
	var cart_beer_count = $cart_beer.data("cartcount") - 1;

	if (cart_beer_count == 0) {
		removeBeer(beer_id);
		return;
	}


	$cart_beer.data("cartcount", cart_beer_count);
	$cart_beer.find(".beer__count").text(cart_beer_count);
	$cart_beer.find(".beer__price").text(decimalRound(cart_beer_price, cart_beer_count));

	var beer_id = $cart_beer.data("id");
	var $menu_beer = $("#b-"+beer_id);
	var $menu_beer_count = $menu_beer.find(".beer__count");
	var menu_beer_count = $menu_beer.data("count");
	$menu_beer.find(".beer__count").text(menu_beer_count - cart_beer_count);

	checkSoldOut();
	cartSum();
}

/*
*	When remove all is pressed. All beers in the cart is removed.
*/
function removeBeer(beer_id) {
	var $cart_beer = $("#c-"+beer_id);
	console.log("removeBeer: "+$cart_beer.data("namn"));
	var $menu_beer = $("#b-"+beer_id);
	var $menu_beer_count = $menu_beer.find(".beer__count");
	$menu_beer_count.text($menu_beer.data("count"));
	$cart_beer.fadeOut("100", function() {
		this.remove();
		checkSoldOut();
		cartSum();
	});
}

/*
*	Prevents standard behaviour, allowing us to customize it as we wish.
*/
function allowDrop(event) {
	console.log("allowDrop");
	event.preventDefault();
}

/*
*	Defines the behaviour when starting to drag an element
*/
function dragstart(event) {
	console.log("dragstart");
	if ($(event.target).data("count") > 0 && $(event.target).find(".beer__count").text() > 0) {
		event.dataTransfer.setData("text", $(event.target).data("id"));
	} else {
		event.preventDefault();
	}
}

/*
*	Defines the behaviour from dropping an element into the cart
*/
function drop(event) {
	console.log("drop");
	var beer_id = event.dataTransfer.getData("text");
	addBeer(beer_id);
}

/*
*	Defines the behaviour when clicking a beer element in the beer menu
* Brings forth a modal
*/
function clickBeer(event) {
	var beer_id = $(event.currentTarget).data("id");
	$.ajax({
		url: 'http://pub.jamaica-inn.net/fpdb/api.php?username='+user+'&password='+user+'&action=beer_data_get&beer_id='+beer_id,
		type: 'GET'
	})
	.done(function(result) {
		var data = result.payload[0];
		var modal = $("#barModal");
		modal.find(".modal-title").text(data.namn);
		modal.find(".modal-title2").text(data.namn2);

		var rnd = Math.floor(Math.random() * 3) + 1;
		modal.find("#beerimg").attr('src', 'img/beer' + rnd + '.png');

		var modal_list = modal.find(".modal-list");
        //Obtains previously chosen language (lang.js) and stores the reference for use within this function
        var selectedLanguage = LANGUAGE_SUPPORT[preferences.getItem('preferedLanguage')];
		modal_list.append("<li>" + selectedLanguage.Alkoholhalt + ": <b>" + data.alkoholhalt + "</b></li>");
		modal_list.append("<li>" + selectedLanguage.Ekologisk + ": <b>"+ (data.ekologisk == 0 ? selectedLanguage.No : selectedLanguage.Yes) +"</b></li>");
		modal_list.append("<li>" + selectedLanguage.Type + ": <b>"+data.varugrupp+"</b></li>");
		modal_list.append("<li>" + selectedLanguage.Price + ": <b>"+data.prisinklmoms+"</b></li>");
		modal_list.append("<li>" + selectedLanguage.From + ": <b>"+ (data.ursprungslandnamn === undefined ? "" : data.ursprungslandnamn) +"</b></li>");
		modal_list.append("<li>" + selectedLanguage.Producer + ": <b>"+data.producent+"</b></li>");

		//data loaded - show modal
		modal.modal("show");
	})
	.error(function(xhr, status, error) {
  		console.log(xhr+", "+status+", "+error);
	});
}

/*
* Bootstrap event listener on modal hidden
* Removes content from modal
*/
$("#barModal").on("hidden.bs.modal", function(event) {
	$(".modal-list").empty();
});

/*
* Gets the inventory from the api
* On success, put the beers in the DOM beer menu
*/
$.ajax({
	url: 'http://pub.jamaica-inn.net/fpdb/api.php?username='+admin+'&password='+admin+'&action=inventory_get',
	type: 'GET'
})
.done(function(data) {
	console.dir(data);
	var beers = $("#beers");
	var beer,
		beer_left,
		beer_right;
    var beer_admin;
	$.each(data.payload, function(i, beerData) {
		// if (i > 15) return;
		if (beerData.namn.length > 0) {//data-toggle='modal' data-target='#barModal'
			beer = $("<div id='b-"+beerData.beer_id+"' onclick='clickBeer(event)' class='beer' draggable='true' ondragstart='dragstart(event)'></div>");
			beer_left = $("<div class='beer__left'></div>");
			beer_right = $("<div class='beer__right'></div>");
            beer_admin = $("<div class='adminPanel'><button class='add' onclick='modifyQuantity(event)'>+</button><button class='remove' onclick='modifyQuantity(event)'>-</button></div>");
			beer.append(beer_left);
			beer.append(beer_right);
            beer.append(beer_admin);
			beer_left.append('<div class="beer__name">'+beerData.namn+'</div>');
			beer_left.append('<div class="beer__name2">'+beerData.namn2+'</div>');
			beer_right.append('<div class="beer__price">'+beerData.price+'</div>');
			beer_right.append('<div class="beer__count">'+beerData.count+'</div>');
			// if (beerData.count >= 0 && beerData.count != 0) beer_right.append('<div class="beer__count">'+beerData.count+'</div>');
			// else beer_right.append('<div class="beer__count sold-out">'+beerData.count+'</div>');
			beers.append(beer);
			beer.data({'id': beerData.beer_id,
						'namn': beerData.namn,
						'namn2': beerData.namn2,
						'price': beerData.price,
						'count': beerData.count,
						'cartcount': 0
					});
			checkSoldOut();
		}
	});
	$(".beer").each(function() {
		if(($(this).data("count")) <= 0){
			$(this).hide();
			hidden = true;
		}
	});
})
.error(function(xhr, status, error) {
	console.log(xhr+", "+status+", "+error);
});

/*
* Modifies the quantity of a beer
*/
function modifyQuantity(event){
    event.stopPropagation();
    event.preventDefault();
    var beerObject = $(event.currentTarget.parentNode.parentNode);
    var quantity = parseInt(beerObject.data("count"));
    var getAction = event.currentTarget.className;
    if(getAction === "add"){
        quantity++;
    } else if(getAction === "remove") {
        quantity--;
    }
    beerObject.data("count", quantity);
    beerObject.find(".beer__count").text(quantity);
    checkSoldOut();
}


/*
*	Runs when the DOM has finished loading
* Binds a scroll event listener so that the beer cart will follow the screen when scrolling
*/
$(document).ready(function() {
	var cart = $("#cart");
	var cart_offset = cart.offset().top;

	$(window).on("scroll", function() {
		if (this.scrollY > cart_offset) {
			var transY = this.scrollY - cart_offset;
			console.log("transY: " + transY);
			cart.css('transform', 'translateY('+transY+'px)');
		} else {
			cart.css('transform', 'translateY(0)');
		}
	}); //window scroll

	//cancel button
	$("#cart button.cancel").on("click", function() {
		var beers = $("#cart .beer");
		$.each(beers, function(i, beer) {
			nrCancelBeers.push([$(this).data("id"), $(this).data("cartcount")]);
			var $menu_beer = $("#b-"+$(beer).data("id"));
			var $menu_beer_count = $menu_beer.find(".beer__count");
			$menu_beer_count.text($menu_beer.data("count"));
			//console.log($menu_beer_count);
			//console.log($menu_beer.data("count"));
		}); //each
		//printObj(beers.data("id"));

		beers.fadeOut("200", function() {
			printObj($(this).data("id"));
			undoArr.push([$(this).data("id"),0]);
			subBeer($(this).data("id"));
			//this.remove();
			cartSum();
		});
	}); //cancel button

	//pay button
	$("#cart button.pay").on("click", function() {
		var beers = $("#cart .beer");
		$.each(beers, function(i, beer) {
			var beer_id = $(beer).data("id");
			for (var i = 0; i < $(beer).data("cartcount"); i++) {
				$.ajax({
					url:  "http://pub.jamaica-inn.net/fpdb/api.php?username="+user+"&password="+user+"&act ion=purchases_append&=beer_id="+beer_id,
					type: 'POST'
				})
				.done(function() {
					console.log(user+" successfully purchased beer with id "+beer_id);
					beers.fadeOut("200", function() {
						this.remove();
						cartSum();
					});
				})
				.error(function(xhr, status, error) {
					console.log(xhr+", "+status+", "+error);
				});
			}
		}); //each
		undoArr = []; //Array for undos
		redoArr = []; //Array for redos
		nrCancelBeers = [];
		nrRmBeers = ["",0];
	}); //pay button
    //I took the liberty of using your buttons as menu examples, so I changed them to "a" instead of "button"
    /*
	$("a#test1").on("click", function() { //payments_get_all
		$.ajax({
			url:  "http://pub.jamaica-inn.net/fpdb/api.php?username="+admin+"&password="+admin+"&action=payments_get_all",
			type: 'GET'
		})
		.done(function(data) {
			printObj(data);
		})
		.error(function(xhr, status, error) {
			console.log(xhr+", "+status+", "+error);
		});
	}); //test1
	$("a#test2").on("click", function() { //iou_get
		$.ajax({
			url:  "http://pub.jamaica-inn.net/fpdb/api.php?username="+user+"&password="+user+"&action=iou_get",
			type: 'GET'
		})
		.done(function(data) {
			printObj(data);
		})
		.error(function(xhr, status, error) {
			console.log(xhr+", "+status+", "+error);
		})
		.fail(function() {
			console.log("fail");
		});
	}); //test2
	$("a#test3").on("click", function() { //inventory_append
		$.ajax({
			url:  "http://pub.jamaica-inn.net/fpdb/api.php?username="+admin+"&password="+admin+"&action=inventory_append&beer_id=154903&amount=1&price=14.10",
			type: 'POST'
		})
		.done(function(data) {
			printObj(data);
		})
		.error(function(xhr, status, error) {
			console.log(xhr+", "+status+", "+error);
		})
		.fail(function() {
			console.log("fail");
		});
	}); //test3
	$("a#test4").on("click", function() { //payments_get
		$.ajax({
			url:  "http://pub.jamaica-inn.net/fpdb/api.php?username="+user+"&password="+user+"&action=payments_get",
			type: 'POST',
		})
		.done(function(data) {
			printObj(data);
		})
		.error(function(xhr, status, error) {
			console.log(xhr+", "+status+", "+error);
		})
		.fail(function() {
			console.log("fail");
		});
	}); //test4
    */

		/*
		* When pressing the undo button, a undo action is performed
		*/
	//Undo button action
	$("#btn_undo").on("click", function() {
		var beer_id = undoArr[(undoArr.length-1)][0];
		var addSub = undoArr[(undoArr.length-1)][1];
		if(nrCancelBeers.length > 0){//undo cancel
			for (x = 0; x < nrCancelBeers.length; x++){
				removeBeer(nrCancelBeers[x][0]);//have to be runned here because Noa dont want to do it where it should be run..
				for(y = 0; y < nrCancelBeers[x][1]; y++){
					printObj(nrCancelBeers[x]);
					redoArr.push([nrCancelBeers[x],1]);
					addBeer(nrCancelBeers[x][0]);
				}
			}
			for (i = 0; i < nrCancelBeers; i++){
				undoArr.splice(-1,1);
			}
			nrCancelBeers = [];
		}

		else if(nrRmBeers[1] > 0){//undo remove
			nrUndos = nrRmBeers[1];
			/*
			abc = [];
			for (i = 0; i < undoArr.length; i++){
				if(undoArr[i][0] == nrRmBeers[0] && undoArr[i][1] == 1){
					abc.push(i);
				};
			};
			*/
			for (i = 0; i < nrRmBeers[1]; i++){
				addBeer(nrRmBeers[0]);
				redoArr.push([nrRmBeers[0],1]);
			}
			for (i = 0; i < nrUndos; i++){
				undoArr.splice(-1,1);
			}
			nrRmBeers = ["",0];
		}

		else if(addSub == 0){//undo sub 1 beer
			printObj("got here!");
			addBeer(beer_id);
			redoArr.push([beer_id,1]);
			undoArr.splice(-1,1);
		}

		else if(addSub == 1){//undo add 1 beer
			subBeer(beer_id);
			redoArr.push([beer_id,0]);
			undoArr.splice(-1,1);
		}
	})//Undo button

	/*
	* When pressing the redo button, a redo action is performed
	*/
	//Redo button action
	$("#btn_redo").on("click", function() {
		var beer_id = redoArr[(redoArr.length-1)][0];
		var addSub = redoArr[(redoArr.length-1)][1];
			if(addSub == 0){//redo sub 1 beer
				addBeer(beer_id);
				undoArr.push([beer_id,1]);
			}
			if(addSub == 1){//redo add 1 beer
				subBeer(beer_id);
				undoArr.push([beer_id,0]);
		}
		printObj(redoArr);
		redoArr.splice(-1,1);
		printObj(redoArr);
	}) //Redo button
}); //doc rdy

/*
* Defines the ability to search all the beers.
*/
// Search function
$(".search").keyup(function() {
  $(".beer").each(function() {
    var input = $(".search").val().toLowerCase();
    if (input != "") {
			if(hidden == false){//all beers are showed
	      if ($(this).data("namn").toLowerCase().indexOf(input) < 0) {
	        $(this).hide();//hides all beers that do not have input in them
	      }
				else {
					$(this).show();
				}
	    }
			else{//hidden beers
	      if ($(this).data("namn").toLowerCase().indexOf(input) < 0) {
	        $(this).hide();//hides all beers that do not have input in them
	      }
				else{
		      if ($(this).data("count") <= 0) {
		        $(this).hide();
	      	}
					else {
						$(this).show();
					}
				}
			}
		}
  });
});

/*
* Hides all the beers that are out of stock
* Is a checkbox
*/
// Hide out of stock beer
$('.hideEmpty :checkbox').change(function() {
	if ($(this).is(':checked')) {
		$(".beer").each(function() {
			if(($(this).data("count")) <= 0){
				$(this).show();
				hidden = false;
			}
		})
	}
	else {
		$(".beer").each(function() {
			if(($(this).data("count")) <= 0){
				$(this).hide();
				hidden = true;
			}
			else{
				$(this).show();
			}
		})
  }
});

/*
*	Adds a custom beer.
* Only works as admin
*/
//Add beer button function for the admin
var clickAddBeerAdmin = (function(){
    var customID = 0;
    return function(e){
        var beers = $("#beers");
        var creator = $(e.currentTarget.parentNode);
        var beer;
        var beer_left;
        var beer_right;
        var beer_admin;
        var fields = [creator.find("#AdminBeerName"), creator.find("#AdminBeerName2"), creator.find("#AdminPrice"), creator.find("#AdminCount")];
		var beerData = {
            beer_id:"userDefined_" + (++customID),
            namn:fields[0].val(),
            namn2:fields[1].val(),
            price:fields[2].val(),
            count:fields[3].val()
        };
        beer = $("<div id='b-"+beerData.beer_id+"' class='beer' draggable='true' ondragstart='dragstart(event)'></div>");//Removed onclick='clickBeer(event)' because it is not connected to the database
        beer_left = $("<div class='beer__left'></div>");
        beer_right = $("<div class='beer__right'></div>");
        beer_admin = $("<div class='adminPanel'><button class='add' onclick='modifyQuantity(event)'>+</button><button class='remove' onclick='modifyQuantity(event)'>-</button></div>");
        beer.append(beer_left);
        beer.append(beer_right);
        beer.append(beer_admin);
        beer_left.append('<div class="beer__name">'+beerData.namn+'</div>');
        beer_left.append('<div class="beer__name2">'+beerData.namn2+'</div>');
        beer_right.append('<div class="beer__price">'+beerData.price+'</div>');
        beer_right.append('<div class="beer__count">'+beerData.count+'</div>');
        //beers.prepend(beer);
        creator.after(beer);
        beer.data({'id': beerData.beer_id,
            'namn': beerData.namn,
            'namn2': beerData.namn2,
            'price': beerData.price,
            'count': beerData.count,
            'cartcount': 0
        });
        checkSoldOut();
        $.each(fields, function(index, element){
            element.val("");
        });
    }
})();
