$(document).ready(function() {
    $('.btn-success').click(function (){
        var typeProperty = $(".type-property").val();

        var maxGuests = $(".max-guests").val();
        var bedrooms = $(".bedrooms").val();
        var beds = $(".beds").val();
        var pathrooms = $(".pathrooms").val();
        var isBathroomPrivate = $("input[name='pathroom-private']:checked").val();
        var street = $(".street").val();
        var district = $(".district").val();
        var city = $(".city").val();
        var country = $(".country").val();      
        var zipcode = $(".zipcode").val();

        var location = $(".street").val() + ", " + $(".district").val()  
                            + ", " + $(".city").val() + ", " + $(".country").val() 
                            + ", " + $(".zipcode").val();

        var amenities = [];
        $("input[name='amenities']:checked").each(function(i){
            amenities[i] = $(this).val();
        });

        var title = $(".title").val();
        var price = $(".price").val();
        var description = $(".description").val()

        var policies = [];
        $("input[name='policies']:checked").each(function(i){
            policies[i] = $(this).val();
        });

        $(".form-control").change(function() {
            $(this).removeClass("redClass");
        });

        if(title == '' || description == '' || price == '' ) {
            alert("Vui lòng nhập đủ thông tin");
            switch('') {
                case title:
                    $(".title").addClass("redClass");
                case description:
                    $(".description").addClass("redClass");
                case street:
                    $(".street").addClass("redClass");
                case city:
                    $(".city").addClass("redClass");
                case district:
                    $(".district").addClass("redClass");
                case zipcode:
                    $(".zipcode").addClass("redClass");
                case price:
                    $(".price").addClass("redClass");
         }
       }
       else {
        $.ajax({
            url : "http://localhost:3000/property/new",
            type : 'post',
            dataType : 'json',
            data : {
                "ownerId"    : "0x111111111",
                "title"		: title,
                "type"  	: typeProperty,
                "maxGuests" 	: maxGuests,
                "bedrooms"	: bedrooms,
                "beds"		: beds,
                "bathrooms"		: pathrooms,
                "isBathroomPrivate"  	: isBathroomPrivate,
                "location" 	: location,
                "amenities"	: amenities,
                "description" 	: description,
                "price"		: price,
                "policies"	: policies,
                "rating": 1,
                "numOfComments" : 0,
                "negotiate" : "No",
                "status" : "Avaliable"
            },
            success : function(result) {
                alert("Chúc mừng bạn đã tạo phòng thành công");
              }
        });
       }
       
   });

});