'use strict';

var express = require('express');
var router = express.Router();

var reviews = [
    { id: 'd0c57197-97ab-4f90-b319-d0835116dff0',
      type: 'Lagers',
      name: 'Budvar',
      reviewer: 'matti',
      location: 'Finland, Oulu, Leskinen',
      speech: 'To me, this is always my basic choice amongst the imported brands. A one way maltiness pulls in grassy and grain flavours all the way through, good crispness within the moderate body. Lemon zest spicy hop goes a touch herbal and stings the tongue slowly with bitterness. A doughy malt hints middle to end underneath the spicy hop. Dry finish and clean at that.' },
    { id: 'd0c57197-97ab-4f90-b319-d0835116dff2',
      type: 'Lagers',
      name: 'Karhu',
      reviewer: 'pasi',
      location: 'numerous summer cottages around Finland',
      speech: 'In the Finnish sauna, the beer brand must be Finnish, of course. This is my favourite sauna beer. Quite a strong taste of bready malt. More full-bodied than other basic beers in Finland. A bit sweet, and a slight aftertaste of bitter hops. Medium carbonation, once again more than in other basic beers of Finland.'},
    { id: 'd0c57197-97ab-4f90-b319-d0835116dff4',
      type: 'Ales',
      name: 'Westmalle Tripel',
      reviewer: 'u',
      location: 'Belgium, Brussels, cannot remember the bar... ',
      speech: 'My newest friend. Estery and dry, peppery aftertaste. The color is pale gold, nice white head with good retention. Improves as it warms. Not a fan of the initial smell but this too improves as the beer sits for a few minutes.'}
];

function findReviewNdx(id) {
    for (var i = 0; i < reviews.length; i++) {
        if (reviews[i].id === id) {
            return i;
        }
    }
    return -1;
}

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

router.get('/', function(req, res) {
    var beerTypes = {
        types: ['Ales', 'Lagers', 'Stouts & Porters', 'Malts']
    };
    res.send(beerTypes);
});

router.post('/', function(req, res) {
    setTimeout(function() {
        if (req.body.id) {
            var ndx = findReviewNdx(req.body.id);
            if (ndx === -1) {
                res.sendStatus(404);
            } else {
                if (reviews[ndx].reviewer !== req.session.username) {
                    res.sendStatus(401);
                } else {
                    var rv = reviews[ndx];
                    rv.type = req.body.type;
                    rv.name = req.body.name;
                    rv.location = req.body.location;
                    rv.speech = req.body.speech;
                }
                res.send();
            }
        } else {
            reviews.push({
                id: guid(),
                type: req.body.type,
                name: req.body.name,
                reviewer: req.session.username,
                location: req.body.location,
                speech: req.body.speech
            });
            res.send();
        }
    }, 3000);
});

router.get('/all', function(req, res) {
    res.send(reviews);
});

router.delete('/', function(req, res) {
    setTimeout(function() {
        var id = req.query.id;
        var ndx = findReviewNdx(id);
        if (ndx === -1) {
            res.sendStatus(404);
        } else {
            if (reviews[ndx].reviewer !== req.session.username) {
                res.sendStatus(401);
            } else {
                reviews.splice(ndx, 1);
                res.send();
            }
        }
    }, 1000);
});

module.exports = router;