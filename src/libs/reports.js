const DriverDetail = require('../models/DriverDetail');
const LoadDetail = require('../models/LoadDetail');

async function getAllRevenueByDateRange (dateRange = null) {
    let formattedData = [];
    let data;
    try {
        data = await LoadDetail.aggregate([
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
            Cumulative: { $sum: "$price" }
            },
        },
        {
            $sort: {
                "_id.date.year": 1,
                "_id.date.month": 1
            }
        },
        ])
        data.map((d) => {
            const date = new Date();
            date.setMonth(d._id.date.month - 1);
            const obj = {};
            obj.date = `${date.toLocaleString('en-US', { month: 'short' }, { timeZone: "UTC" })} ${d._id.date.year.toString().substring(2, 4)}`;
            obj.Cumulative = d.Cumulative;
            formattedData.push(obj);
        })
    } catch (err) {
        console.log(err);
    }
    return formattedData;
}

async function getDriverRevenueByDateRange (driver, dateRange = null) {
    console.log("DRIVER", driver);
    let formattedData = [];
    let data;
    try {
        data = await LoadDetail.aggregate([
        { $match :{ driverObject: driver } }, 
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
        ])
        data.map((d) => {
            const date = new Date();
            date.setMonth(d._id.date.month - 1);
            const obj = {};
            obj.date = `${date.toLocaleString('en-US', { month: 'short' }, { timeZone: "UTC" })} ${d._id.date.year.toString().substring(2, 4)}`;
            obj[driver] = d.revenue;
            formattedData.push(obj);
        })
        console.log(formattedData);
    } catch (err) {
        console.log(err);
    }
    return formattedData;
}

module.exports.getAllRevenueByDateRange = getAllRevenueByDateRange;
module.exports.getDriverRevenueByDateRange = getDriverRevenueByDateRange;