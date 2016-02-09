function allowDrop(event) {
	console.log("allowDrop");
	event.preventDefault();
}
function dragstart(event) {
	console.log("dragstart");
	if ($(event.target).data("count") > 0 && $(event.target).find(".beer__count").text() > 0) {
		event.dataTransfer.setData("text", event.target.id);
	} else {
		event.preventDefault();
	}
}
function drop(event) {
	console.log("drop");
	var draggable_beer_id = event.dataTransfer.getData("text");
	var draggable_beer = $("#"+draggable_beer_id);
	var beer_id = draggable_beer_id.substr(2,draggable_beer_id.length);

	var cart_ele = $("#cart").find("#c-"+beer_id);
	if (cart_ele.length) { //id alrdy exist
		var cartcount = cart_ele.data('cartcount') + 1;
		cart_ele.data('cartcount', cartcount);
		cart_ele.find(".beer__count").text(cartcount);
		cart_ele.find(".beer__price").text(Math.round((cart_ele.data("price")*cartcount)*100)/100);

		var draggable_beer_count = draggable_beer.data("count");
		draggable_beer.find(".beer__count").text(draggable_beer_count - cartcount);
		if (draggable_beer_count - cartcount == 0) draggable_beer.find(".beer__count").addClass('sold-out');
	} else {
		var beer_copy = draggable_beer.clone();
		var new_id = 'c-'+beer_id;
		beer_copy.attr('id', new_id);

		$(beer_copy).data($("#"+draggable_beer_id).data());//copy data
		beer_copy.data('cartcount', 1);

		//add to cart
		$("#cart").append(beer_copy);
		$("#cart").find("#"+new_id+" .beer__count").text("1");

		//remove count from beers
		var draggable_beer_count = $("#"+draggable_beer_id).data("count");
		draggable_beer.find(".beer__count").text(draggable_beer_count - 1);
	}
}




function clickBeer(event) {
	var id = event.target.id;
	var beer_id = id.substr(2, id.length);
	$.ajax({
		url: 'http://pub.jamaica-inn.net/fpdb/api.php?username=ervtod&password=ervtod&action=beer_data_get&beer_id='+beer_id,
		type: 'GET'
	})
	.done(function(result) {
		var data = result.payload[0];
console.log(JSON.stringify(data, null, 4));
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
	url: 'http://pub.jamaica-inn.net/fpdb/api.php?username=ervtod&password=ervtod&action=inventory_get',
	type: 'GET'
})
.done(function(data) {
	console.dir(data);
	var beers = $("#beers");
	var beer, beer_left, beer_right;
	$.each(data.payload, function(i, beerData) {
		// if (i > 15) return;
		if (beerData.namn.length > 0) {//data-toggle='modal' data-target='#barModal'
			beer = $("<div id='b-"+beerData.beer_id+"' onclick='clickBeer(event)' class='beer' draggable='true' ondragstart='dragstart(event)'></div>");
			beer_left = $("<div class='beer__left'></div>");
			beer_right = $("<div class='beer__right'></div>");
			beers.append(beer);
			beer.append(beer_left);
			beer.append(beer_right);
			beer_left.append('<div class="beer__name">'+beerData.namn+'</div>');
			beer_left.append('<div class="beer__name2">'+beerData.namn2+'</div>');
			beer_right.append('<div class="beer__price">'+beerData.price+'</div>');
			if (beerData.count >= 0 && beerData.count != 0) beer_right.append('<div class="beer__count">'+beerData.count+'</div>');
			else beer_right.append('<div class="beer__count sold-out">'+beerData.count+'</div>');
			beer.data({'namn': beerData.namn, 
						'namn2': beerData.namn2,
						'price': beerData.price,
						'count': beerData.count,
						'cartcount': 0
					});
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
	});


});










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

















*/