var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/getrate', function (request, response) {
    var url = require('url');
    var query = url.parse(request.url, true).query;
    console.log(query);
    // add .4 so that .1 oz over rounds up to next bracket
    var weight = Math.round(query.wgt);
    var price = 0;
    var service = query.service

    switch (service) {
        case 'stamped':
            console.log("stamped seleced!");
            if (weight <= 1)
                price = 0.49
            else if (weight > 3.5) {
                response.write("for weight greater than 3.50 oz, use large envelope instead");
                response.end();
            } else
                price = 0.49 + ((weight - 1) * .21);
            service = "Stamped Letter";
            break;

        case 'metered':
            console.log("selected metered!");
            if (weight <= 1)
                price = 0.46
            else if (weight > 3.5) {
                response.write("for weight greater than 3.50 oz, use large envelope instead");
                response.end();
            } else
                price = 0.49 + ((weight - 1) * .21);
            serice = "metered Letter";
            break;

        case 'large':
            console.log("large envelope selected");
            if (weight <= 1)
                price = 0.98;
            else
                price = 0.98 + ((weight - 1) * .21);
            service = "large envelope";
            break;

        case 'parcels':
            if (weight <= 4)
                price = 2.67;
            else
                price = 2.67 + ((weight - 4) * .18);
            service = "parcel";
            break;

    }
    console.log("your price is : " + price.toFixed(2));
    var params = {
        service: service,
        cost: price.toFixed(2)
    };
    if (price != 0)
        response.render("pages/calcrate", params);
});

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
