const LoadDetail = require('../models/LoadDetail');

async function getAllRevenue (driver = null, from = null, to = null) {
    let formattedData = [];

    try {
        let query;
        let data;
        let rowCount;
        let count;

        // create query layout
        query = [
            { $match : {  } },
            { $group: {  }  },
            { $sort: {  } },
        ];

        // rowCount to be used in calculating x-axis information
        rowCount = [
            { $match : {  } },
            { $group: {  }  }
        ];

        // add driver filter if any
        if(driver.length > 0 && driver != "null"){
            query[0].$match["driverObject"] = driver;
            rowCount[0].$match["driverObject"] = driver;
        }

        // add date picker filter if any
        if (from != "null" && to != "null") {
            const _from = new Date(from);
            const _to = new Date(to);
            _to.setHours(23);
            _to.setMinutes(59);
            query[0].$match["deliveryTime"] = { 
                $gte: _from.toISOString(), 
                $lt: _to.toISOString()
            }
            rowCount[0].$match["deliveryTime"] = { 
                $gte: _from.toISOString(), 
                $lt: _to.toISOString()
            }
        }

        // group loads into days and count
        rowCount[1].$group = {
            _id: {
                date: {
                    day : {
                        $dayOfMonth: {
                            $dateFromString: { dateString: "$deliveryTime", format: "%Y-%m-%dT%H:%M" }
                        }
                    },
                }
            },
            count: { $count: { } }
        };
        rowCount.push({
            $count: "count"
        });
        const dayCount = await LoadDetail.aggregate(rowCount);
        count = dayCount[0]?.count == undefined ? 0 : dayCount[0].count;
        
        // (x-axis) example --> Feb 10
        if (count <= 10) {
            query[1].$group = {
                _id: {
                    date: {
                        day : {
                            $dayOfMonth: {
                                $dateFromString: { dateString: "$deliveryTime", format: "%Y-%m-%dT%H:%M" }
                            }
                        },
                        month : {
                            $month: {
                                $dateFromString: { dateString: "$deliveryTime", format: "%Y-%m-%dT%H:%M" }
                            }
                        },
                    }
                },
                revenue: { $sum: "$price" }
            }
            query[2].$sort = {
                "_id.date.month": 1,
                "_id.date.day": 1
            }
            data = await LoadDetail.aggregate(query);
            data.map((d) => {
                const date = new Date();
                date.setMonth(d._id.date.month - 1);
                const obj = {};
                obj.date = `${date.toLocaleString('en-US', { month: 'short' }, { timeZone: "UTC" })} ${d._id.date.day.toString().length == 1 ? (`0`+ d._id.date.day) : d._id.date.day}`;
                if (driver != "null") {
                    obj[driver] = d.revenue;
                } else {
                    obj.Cumulative = d.revenue;
                }
                formattedData.push(obj);
            });
        }

        // (x-axis) example --> Week 3
        else if (count > 10 && count <= 90) {
            query[1].$group = {
                _id: {
                    date: {
                        week : {
                            $week: {
                                $dateFromString: { dateString: "$deliveryTime", format: "%Y-%m-%dT%H:%M" }
                            },
                        },
                    } 
                },
                revenue: { $sum: "$price" },
            }
            query[2].$sort = {
                "_id.date.week": 1
            }
            data = await LoadDetail.aggregate(query);
            data.map((d) => {
                const obj = {};
                obj.date = `Week ${d._id.date.week}`;
                if (driver != "null") {
                    obj[driver] = d.revenue;
                } else {
                    obj.Cumulative = d.revenue;
                }
                formattedData.push(obj);
            });
        }

        // (x-axis) example --> Feb '24
        else if (count > 90 && count <= 365) {
            query[1].$group = {
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
            }
            query[2].$sort = {
                "_id.date.year": 1,
                "_id.date.month": 1
            }
            data = await LoadDetail.aggregate(query);
            data.map((d) => {
                const date = new Date();
                date.setMonth(d._id.date.month - 1);
                const obj = {};
                obj.date = `${date.toLocaleString('en-US', { month: 'short' }, { timeZone: "UTC" })} '${d._id.date.year.toString().substring(2, 4)}`;
                if (driver != "null") {
                    obj[driver] = d.revenue;
                } else {
                    obj.Cumulative = d.revenue;
                }
                formattedData.push(obj);
            });
        }

        // (x-axis) example --> 2024
        else {
            query[1].$group = {
                _id: {
                    date: {
                        year : {
                            $year: {
                                $dateFromString: { dateString: "$deliveryTime", format: "%Y-%m-%dT%H:%M" }
                            }
                        },
                    } 
                },
                revenue: { $sum: "$price" }
            }
            query[2].$sort = {
                "_id.date.year": 1
            }
            data = await LoadDetail.aggregate(query);
            data.map((d) => {
                const obj = {};
                obj.date = `${d._id.date.year}`;
                if (driver != "null") {
                    obj[driver] = d.revenue;
                } else {
                    obj.Cumulative = d.revenue;
                }
                formattedData.push(obj);
            });
        }
    } catch (err) {
        console.log(err);
    }
    return formattedData;
}

module.exports.getAllRevenue = getAllRevenue;