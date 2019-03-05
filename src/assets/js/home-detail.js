
$(document).ready(function() {
  $.getJSON("assets/js/jsonHomeDetail.json", function (data) {
    var _id = data[0]["_id"];
    var title = data[0]["title"];
    var type = data[0]["type"].toUpperCase();
    var maxGuests = data[0]["maxGuests"];
    var bedrooms = data[0]["bedrooms"];
    var beds = data[0]["beds"];
    var bathrooms = data[0]["bathrooms"];
    var isBathroomPrivate = data[0]["isBathroomPrivate"];
    var location = data[0]["location"];
    var amenities = data[0]["amenities"];
    var description = data[0]["description"];
    var price = data[0]["price"];
    var policies = data[0]["policies"];
    var rating = data[0]["rating"];
    var status = data[0]["status"];
    var comments = data[0]["rating"];

    var detailtitle = type + ' · ' + bedrooms + ' BEDROOMS · ';

    //var arrAmenities = amenities.split(";");
    var arrAmenities = amenities.split(",");

    var locationShowArr = location.split(",");
    var locationShow = locationShowArr[locationShowArr.length - 3] + ", " + locationShowArr[locationShowArr.length -2]

    $(".title").html(title);
    $(".type").prepend(detailtitle);
    $(".type").append(rating);
    $(".location").html(locationShow);
    $(".maxGuests").html(maxGuests + " guests");
    $(".price").html(price + "$ per night");
    $(".bedrooms").html(bedrooms + " bedrooms");
    $(".beds").html(beds + " beds");
    $(".bathrooms").html(bathrooms + " bathrooms");

    $(".pricetotal").html(price + "$ per night");
    $(".description").html(description);

    for(let i = 0; i < arrAmenities.length; i++)
    {
      $(".amenities").append("<p><i class='fa fa-check-square-o' aria-hidden='true'></i>  "  + arrAmenities[i] + "</p>")
    }
  });
});