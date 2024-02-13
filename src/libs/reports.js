const DriverDetail = require('../models/DriverDetail');
const LoadDetail = require('../models/LoadDetail');

async function getAllRevenue (driver = null, from = null, to = null) {
    let formattedData = [];

    try {
        let query;
        let difference;

        // create raw query
        query = [
            { $match : {  } },
            { $group: {
                _id: { 
                    date: { 
                        month : {
                            $month: {
                                $dateFromString: { dateString: "$deliveryTime", format: "%Y-%m-%dT%H:%M" }
                            }
                        },
                        year : {
                            $year: {
                                $dateFromString: { dateString: "$deliveryTime", format: "%Y-%m-%dT%H:%M" }
                            }
                        },
                    } 
                },
                revenue: { $sum: "$price" }
                },
            },
            {
                $sort: {
                    "_id.date.year": 1,
                    "_id.date.month": 1
                }
            },
        ];

        // add driver filter
        if(driver.length > 0 && driver != "null"){
            query[0].$match["driverObject"] = driver;
        }

        // add date picker filter
        if (from != "null" && to != "null") {
            const _from = new Date(from);
            const _to = new Date(to);
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            const from_utc = Date.UTC(_from.getFullYear(), _from.getMonth(), _from.getDate());
            const to_utc = Date.UTC(_to.getFullYear(), _to.getMonth(), _to.getDate());
            difference = Math.floor((to_utc - from_utc) / _MS_PER_DAY);
            query[0].$match["deliveryTime"] = {  
                $gte: `${_from.getFullYear()}-${_from.getMonth()+1}-${_from.getDate()}T${_from.getMinutes()}:${_from.getSeconds()}`, 
                $lt: `${_to.getFullYear()}-${_to.getMonth()+1}-${_to.getDate()}T${_to.getMinutes()}:${_to.getSeconds()}` 
            }
        }

        // execute the final query
        const data = await LoadDetail.aggregate(query);

        // create the final object
        data.map((d) => {
            const date = new Date();
            date.setMonth(d._id.date.month - 1);
            const obj = {};
            obj.date = `${date.toLocaleString('en-US', { month: 'short' }, { timeZone: "UTC" })} ${d._id.date.year.toString().substring(2, 4)}`;
            if (driver != "null") {
                obj[driver] = d.revenue;
            } else {
                obj.Cumulative = d.revenue;
            }
            formattedData.push(obj);
        });

    } catch (err) {
        console.log(err);
    }
    return formattedData;
}

module.exports.getAllRevenue = getAllRevenue;