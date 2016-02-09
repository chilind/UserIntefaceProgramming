// var draggable_beer_id;
// var draggable_beer;
// var beer_id;

var admin = "ervtod"; //admin Ervin Todd
var user = "elepic";//user Elektra Pickle

function printObj(obj) {
	console.log(JSON.stringify(obj, null, 4));
}

function decimalRound(price, cartcount) {
	return Math.round((price * cartcount) * 100) / 100;
}

function cartSum() {
	var cartitems = $("#cart .beer");
	var sum = 0;
	$.each(cartitems, function(i, beer) {
		console.log($(beer).data());
		console.log($(beer).data("cartcount"));
		sum += (decimalRound($(beer).data("price"), $(beer).data("cartcount")));
	});
	$("#cart .sum span").text(sum);
}

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

function addBeer(beer_id) {
	var $menu_beer = $("#b-"+beer_id);
	var $cart_beer = $("#cart").find("#c-"+beer_id);

	if ($menu_beer.find(".beer__count").text() > 0) {

		if ($cart_beer.length) {
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

		} else {
			var $cart_beer_copy = $menu_beer.clone();
			$cart_beer_copy.attr('id', 'c-'+beer_id);

			$cart_beer_copy.append("<div class='beer__control'></div>");
			//BIND REMOVE EVENT
			$cart_beer_copy.find(".beer__control").append("<div class='remove'></div>");
			$cart_beer_copy.find(".remove").on("click", function(ev) {
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
			$cart_beer_copy.find(".beer__count").text("1");
			$cart_beer_copy.data($menu_beer.data());
			$cart_beer_copy.data("cartcount", 1);
			//remove count from beers
			var menu_beer_count = $menu_beer.data("count");
			$menu_beer.find(".beer__count").text(menu_beer_count - 1);

			checkSoldOut();
			cartSum();
		}
	}
}
function subBeer(beer_id) {
	var $cart_beer = $("#c-"+beer_id);
	var $menu_beer = $("#beers").find("#b-"+beer_id);

	if ($cart_beer.data("cartcount") > 1) { //sub
		console.log("subBeer: "+$cart_beer.data("namn"));
		var cart_beer_price = $cart_beer.data("price");
		var cart_beer_count = $cart_beer.data("cartcount") - 1;
		$cart_beer.data("cartcount", cart_beer_count);
		$cart_beer.find(".beer__count").text(cart_beer_count);
		$cart_beer.find(".beer__price").text(decimalRound(cart_beer_price, cart_beer_count));

		var beer_id = $cart_beer.data("id");

		if (cart_beer_count == 0) {
			remove(beer_id);
			return;
		}

		var $menu_beer = $("#b-"+beer_id);
		var $menu_beer_count = $menu_beer.find(".beer__count");
		var menu_beer_count = $menu_beer.data("count");
		$menu_beer.find(".beer__count").text(menu_beer_count - cart_beer_count);

		checkSoldOut();
		cartSum();
	}
}
function removeBeer(beer_id) {
	var $cart_beer = $("#c-"+beer_id);
	console.log("removeBeer: "+$cart_beer.data("namn"));
	var $menu_beer = $("#b-"+beer_id);
	var $menu_beer_count = $menu_beer.find(".beer__count");
	$menu_beer_count.text($menu_beer.data("count"));
	$cart_beer.remove();

	checkSoldOut();
	cartSum();
}




function allowDrop(event) {
	console.log("allowDrop");
	event.preventDefault();
}
function dragstart(event) {
	console.log("dragstart");
	if ($(event.target).data("count") > 0 && $(event.target).find(".beer__count").text() > 0) {
		event.dataTransfer.setData("text", $(event.target).data("id"));
	} else {
		event.preventDefault();
	}
}
function drop(event) {
	console.log("drop");
	var beer_id = event.dataTransfer.getData("text");
	// var $menu_beer = $("#b-"+beer_id);

	// var $cart_beer = $("#cart").find("#c-"+beer_id);
	// if ($cart_beer.length) { //id alrdy exist
		addBeer(beer_id);
	// } else {
	// 	var $cart_beer_copy = $menu_beer.clone();
	// 	$cart_beer_copy.attr('id', 'c-'+beer_id);

	// 	$cart_beer_copy.append("<div class='beer__control'></div>");
	// 	//BIND REMOVE EVENT
	// 	$cart_beer_copy.find(".beer__control").append("<div class='remove'></div>");
	// 	$cart_beer_copy.find(".remove").on("click", function(ev) {
	// 		removeBeer($(ev.target).parent().parent());
	// 		ev.stopPropagation(); //stop event bubbling
	// 	});
	// 	//BIND SUB EVENT
	// 	$cart_beer_copy.find(".beer__control").append("<div class='sub'></div>");
	// 	$cart_beer_copy.find(".sub").on("click", function(ev) {
	// 		subBeer($(ev.target).parent().parent());
	// 		ev.stopPropagation(); //stop event bubbling
	// 	});
	// 	//BIND ADD EVENT
	// 	$cart_beer_copy.find(".beer__control").append("<div class='add'></div>");
	// 	$cart_beer_copy.find(".add").on("click", function(ev) {
	// 		addBeer($(ev.target).parent().parent());
	// 		ev.stopPropagation(); //stop event bubbling
	// 	});

	// 	//add to cart
	// 	$("#cart .cart__bucket").append($cart_beer_copy);
	// 	$cart_beer_copy.find(".beer__count").text("1");
	// 	$cart_beer_copy.data($menu_beer.data());
	// 	$cart_beer_copy.data("cartcount", 1);
	// 	console.log($cart_beer_copy.data());
	// 	//remove count from beers
	// 	var menu_beer_count = $menu_beer.data("count");
	// 	$menu_beer.find(".beer__count").text(menu_beer_count - 1);

	// 	checkSoldOut();
	// 	cartSum();
	// }
}




function clickBeer(event) {
	var beer_id = $(event.target).data("id");
	$.ajax({
		url: 'http://pub.jamaica-inn.net/fpdb/api.php?username='+user+'&password='+user+'&action=beer_data_get&beer_id='+beer_id,
		type: 'GET'
	})
	.done(function(result) {
		var data = result.payload[0];
		var modal = $("#barModal");
		modal.find(".modal-title").text(data.namn);
		modal.find(".modal-title2").text(data.namn2);
		var modal_list = modal.find(".modal-list");
		modal_list.append("<li>Alkoholhalt: "+data.alkoholhalt+"</li>");

		modal_list.append("<li>Ekologisk: "+ (data.ekologisk == 0 ? "nej" : "ja") +"</li>");
		modal_list.append("<li>Typ: "+data.varugrupp+"</li>");
		modal_list.append("<li>Pris: "+data.prisinklmoms+"</li>");
		modal_list.append("<li>Från: "+data.ursprungslandnamn+"</li>");
		modal_list.append("<li>Producent: "+data.producent+"</li>");

		//data loaded - show modal
		$("#barModal").modal("show");
	})
	.error(function(xhr, status, error) {
  		console.log(xhr+", "+status+", "+error);
	});
}

$("#barModal").on("hidden.bs.modal", function(event) {
	$(".modal-list").empty();
});


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
	$.each(data.payload, function(i, beerData) {
		// if (i > 15) return;
		if (beerData.namn.length > 0) {//data-toggle='modal' data-target='#barModal'
			beer = $("<div id='b-"+beerData.beer_id+"' onclick='clickBeer(event)' class='beer' draggable='true' ondragstart='dragstart(event)'></div>");
			beer_left = $("<div class='beer__left'></div>");
			beer_right = $("<div class='beer__right'></div>");
			beer.append(beer_left);
			beer.append(beer_right);
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
})
.error(function(xhr, status, error) {
	console.log(xhr+", "+status+", "+error);
});





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
			var $menu_beer = $("#b-"+$(beer).data("id"));
			var $menu_beer_count = $menu_beer.find(".beer__count");
			$menu_beer_count.text($menu_beer.data("count"));
			console.log($menu_beer_count);
			console.log($menu_beer.data("count"));
		}); //each
		beers.remove();
		console.log("TRIGGERED");
		cartSum();
	}); //cancel button

	//pay button
	$("#cart button.pay").on("click", function() {
		var beers = $("#cart .beer");
		$.each(beers, function(i, beer) {
			var beer_id = $(beer).data("id");
			for (var i = 0; i < $(beer).data("cartcount"); i++) {
				$.ajax({
					url:  "http://pub.jamaica-inn.net/fpdb/api.php?username="+user+"&password="+user+"&act ion=purchases_append&=beer_id="+beer_id,
					type: 'POST',
				})
				.done(function() {
					console.log(user+" successfully purchased beer with id "+beer_id);
					beers.remove();
					cartSum();
				})
				.error(function(xhr, status, error) {
					console.log(xhr+", "+status+", "+error);
				});
			}
		}); //each
	}); //pay button

	$("button#test1").on("click", function() { //payments_get_all
		$.ajax({
			url:  "http://pub.jamaica-inn.net/fpdb/api.php?username="+admin+"&password="+admin+"&action=payments_get_all",
			type: 'GET',
		})
		.done(function(data) {
			printObj(data);
		})
		.error(function(xhr, status, error) {
			console.log(xhr+", "+status+", "+error);
		});
	}); //test1
	$("button#test2").on("click", function() { //iou_get
		$.ajax({
			url:  "http://pub.jamaica-inn.net/fpdb/api.php?username="+user+"&password="+user+"&action=iou_get",
			type: 'GET',
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
	$("button#test3").on("click", function() { //inventory_append
		$.ajax({
			url:  "http://pub.jamaica-inn.net/fpdb/api.php?username="+admin+"&password="+admin+"&action=inventory_append&beer_id=154903&amount=1&price=14.10",
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
	}); //test3
	$("button#test4").on("click", function() { //payments_get
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
}); //doc rdy










/*






function mouseenter(event) {
	$("#info").empty();
	console.log($("#info"));

	console.log("MOUSE ENTER");
	var id = event.target.id;
	var beer_id = id.substr(2, id.length);
	$.ajax({
		url: 'http://pub.jamaica-inn.net/fpdb/api.php?username=ervtod&password=ervtod&action=beer_data_get&beer_id='+beer_id,
		type: 'GET'
	})
	.done(function(result) {
		var data = result.payload;
		// console.dir(data);
		var info = $("<div id='info'></div>");
		$("#"+id).append(info);
		info.css({
			display: 'block',
			left: $(".beer").first().outerWidth() + 10,
			top: 0
		});

		info.append("<h2>"+data[0].namn+"</h2>");
		info.append("<h4>"+data[0].namn2+"</h4>");
	})
	.error(function(xhr, status, error) {
  		console.log(xhr+", "+status+", "+error);
	});
}

function mouseleave(event) {
	console.log("MOUSE LEAVE");
	$("#info").remove();
}

onmouseenter='mouseenter(event)' onmouseleave='mouseleave(event)'











			// var $cart_beer = $(ev.target).parent().parent();
			// var beer_id = $cart_beer.data("id");
			// var $menu_beer = $("#b-"+beer_id);
			// var $menu_beer_count = $menu_beer.find(".beer__count");

			// var cart_beer_count = $cart_beer.data('cartcount') + 1;
			// $cart_beer.data('cartcount', cart_beer_count);

			// console.log("$menu_beer_count.text() ==> "+$menu_beer_count.text());
			// //if there's beer in stock -> add, else no add
			// if ($menu_beer_count.text() > 0) {


			// 	var cart_beer_price = $cart_beer.data("price");
				
			// 	$cart_beer.find(".beer__count").text(cart_beer_count);
			// 	$cart_beer.find(".beer__price").text(decimalRound(cart_beer_price, cart_beer_count));

			// 	var draggable_beer_count = draggable_beer.data("count");
			// 	draggable_beer.find(".beer__count").text(draggable_beer_count - cart_beer_count);
			// } else {
			// 	console.log("no more of that beer");
			// }
			// checkSoldOut();
			// cartSum();





*/