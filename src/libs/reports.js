const LoadDetail = require('../models/LoadDetail');
const RepairDetail = require('../models/RepairDetail');
const PayrollDetail = require('../models/PayrollDetail');
const FuelDetail = require('../models/Fuel');

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
                            $dateFromString: { dateString: "$deliveryTime" }
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
                                $dateFromString: { dateString: "$deliveryTime" }
                            }
                        },
                        month : {
                            $month: {
                                $dateFromString: { dateString: "$deliveryTime" }
                            }
                        },
                        year : {
                            $year: {
                                $dateFromString: { dateString: "$deliveryTime" }
                            }
                        }
                    }
                },
                revenue: { $sum: "$price" }
            }
            query[2].$sort = {
                "_id.date.year": 1,
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
                                $dateFromString: { dateString: "$deliveryTime" }
                            },
                        },
                        month : {
                            $month: {
                                $dateFromString: { dateString: "$deliveryTime" }
                            }
                        },
                        year : {
                            $year: {
                                $dateFromString: { dateString: "$deliveryTime" }
                            }
                        }
                    } 
                },
                revenue: { $sum: "$price" },
            }
            query[2].$sort = {
                "_id.date.year": 1,
                "_id.date.month": 1,
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
                                $dateFromString: { dateString: "$deliveryTime" }
                            }
                        },
                        year : {
                            $year: {
                                $dateFromString: { dateString: "$deliveryTime" }
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
                                $dateFromString: { dateString: "$deliveryTime" }
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
};

async function getRevenuePerMile (driver = null, from = null, to = null) {
    let formattedData = [];

    try {
        let query;
        let data;

        // create query layout
        query = [
            { $match : {  } },
            { $group: {  }  },
            { $sort: {  } },
        ];

        // add driver filter if any
        if(driver.length > 0 && driver != "null"){
            query[0].$match["driverObject"] = driver;
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
        }

        query[1].$group = {
            _id: {
                date: {
                    day : {
                        $dayOfMonth: {
                            $dateFromString: { dateString: "$deliveryTime" }
                        }
                    },
                    month : {
                        $month: {
                            $dateFromString: { dateString: "$deliveryTime" }
                        }
                    },
                    year : {
                        $year: {
                            $dateFromString: { dateString: "$deliveryTime" }
                        }
                    }
                }
            },
            revenue: { $sum: "$price" },
            miles: { $sum: "$allMiles" }
        }
        query[2].$sort = {
            "_id.date.year": 1,
            "_id.date.month": 1,
            "_id.date.day": 1
        }

        data = await LoadDetail.aggregate(query);
        data.map((d) => {
            const date = new Date();
            date.setMonth(d._id.date.month - 1);
            const obj = {};
            obj.date = `${date.toLocaleString('en-US', { month: 'short' }, { timeZone: "UTC" })} ${d._id.date.day.toString().length == 1 ? (`0`+ d._id.date.day) : d._id.date.day}`;
            obj["Revenue per mile"] = Math.round(((d.revenue / d.miles) + Number.EPSILON) * 100) / 100;
            obj.revenue = d.revenue;
            obj.miles = d.miles;
            formattedData.push(obj);
        });

    } catch (err) {
        console.log(err);
    }
    return formattedData;
};

async function getNumberOfMiles (driver = null, from = null, to = null) {
    let formattedData = [];

    try {
        let query;
        let data;

        // create query layout
        query = [
            { $match : {  } },
            { $group: {  }  },
            { $sort: {  } },
        ];

        // add driver filter if any
        if(driver.length > 0 && driver != "null"){
            query[0].$match["driverObject"] = driver;
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
        }

        query[1].$group = {
            _id: {
                date: {
                    day : {
                        $dayOfMonth: {
                            $dateFromString: { dateString: "$deliveryTime" }
                        }
                    },
                    month : {
                        $month: {
                            $dateFromString: { dateString: "$deliveryTime" }
                        }
                    },
                    year : {
                        $year: {
                            $dateFromString: { dateString: "$deliveryTime" }
                        }
                    }
                }
            },
            Miles: { $sum: "$allMiles" }
        }
        query[2].$sort = {
            "_id.date.year": 1,
            "_id.date.month": 1,
            "_id.date.day": 1
        }

        data = await LoadDetail.aggregate(query);
        data.map((d) => {
            const date = new Date();
            date.setMonth(d._id.date.month - 1);
            const obj = {};
            obj.date = `${date.toLocaleString('en-US', { month: 'short' }, { timeZone: "UTC" })} ${d._id.date.day.toString().length == 1 ? (`0`+ d._id.date.day) : d._id.date.day}`;
            obj.Miles = d.Miles;
            formattedData.push(obj);
        });

    } catch (err) {
        console.log(err);
    }
    return formattedData;
};

async function getCountOfLoads (driver = null, from = null, to = null) {
    let formattedData = [];

    try {
        let query;
        let data;

        // create query layout
        query = [
            { $match : {  } },
            { $group: {  }  },
            { $sort: {  } },
        ];

        // add driver filter if any
        if(driver.length > 0 && driver != "null"){
            query[0].$match["driverObject"] = driver;
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
        }

        query[1].$group = {
            _id: {
                date: {
                    day : {
                        $dayOfMonth: {
                            $dateFromString: { dateString: "$deliveryTime" }
                        }
                    },
                    month : {
                        $month: {
                            $dateFromString: { dateString: "$deliveryTime" }
                        }
                    },
                    year : {
                        $year: {
                            $dateFromString: { dateString: "$deliveryTime" }
                        }
                    }
                }
            },
            Loads: { $count: {  } }
        }
        query[2].$sort = {
            "_id.date.year": 1,
            "_id.date.month": 1,
            "_id.date.day": 1
        }

        data = await LoadDetail.aggregate(query);
        data.map((d) => {
            const date = new Date();
            date.setMonth(d._id.date.month - 1);
            const obj = {};
            obj.date = `${date.toLocaleString('en-US', { month: 'short' }, { timeZone: "UTC" })} ${d._id.date.day.toString().length == 1 ? (`0`+ d._id.date.day) : d._id.date.day}`;
            obj.Loads = d.Loads;
            formattedData.push(obj);
        });

    } catch (err) {
        console.log(err);
    }
    return formattedData;
};

async function getExpensesByCategory (from = null, to = null) {
    let formattedData = [];

    try {
        let repairQuery;
        let repairData;
        let payrollQuery;
        let payrollData;
        let fuelQuery;
        let fuelData;

        // create query layout
        repairQuery = [
            { $match : {  } },
        ];
        payrollQuery = [
            { $match : {  } },
        ];
        fuelQuery = [
            { $match : {  } },
        ];

        // add date picker filter if any
        if (from != "null" && to != "null") {
            const _from = new Date(from);
            const _to = new Date(to);
            _to.setHours(23);
            _to.setMinutes(59);
            repairQuery[0].$match["repairDate"] = { 
                $gte: _from.toISOString(), 
                $lt: _to.toISOString()
            };
            payrollQuery[0].$match["payrollDate"] = { 
                $gte: _from.toISOString(), 
                $lt: _to.toISOString()
            };
            fuelQuery[0].$match["date"] = { 
                $gte: _from.toISOString(), 
                $lt: _to.toISOString()
            };
        }

        repairData = await RepairDetail.aggregate(repairQuery);
        payrollData = await PayrollDetail.aggregate(payrollQuery);
        fuelData = await FuelDetail.aggregate(fuelQuery);

        let repairTotal = 0;
        repairData.map((repair) => {
            repairTotal = repairTotal + parseInt(repair.repairCost);
        });
        
        let payrollTotal = 0;
        payrollData.map((payroll) => {
            payrollTotal = payrollTotal + parseInt(payroll.payrollCost);
        });

        let fuelTotal = 0;
        fuelData.map((fuel) => {
            fuelTotal = fuelTotal + parseInt(fuel.cost);
        });

        const total = repairTotal + payrollTotal + fuelTotal;
        const repairShare = repairTotal > 0 ? Math.round(((repairTotal / total) * 100) * 10) /10 : 0;
        const payrollShare = payrollTotal > 0 ? Math.round(((payrollTotal / total) * 100) * 10) /10 : 0;
        const fuelShare = fuelTotal > 0 ? Math.round(((fuelTotal / total) * 100) * 10) /10 : 0;

        formattedData.push({
            name: 'Repair Expense',
            amount: repairTotal,
            share: `${repairShare}%`,
            color: 'bg-cyan-500',
        });

        formattedData.push({
            name: 'Payroll Expense',
            amount: payrollTotal,
            share: `${payrollShare}%`,
            color: 'bg-indigo-400',
        });

        formattedData.push({
            name: 'Fuel Expense',
            amount: fuelTotal,
            share: `${fuelShare}%`,
            color: 'bg-fuchsia-500',
        });

    } catch (err) {
        console.log(err);
    }
    return formattedData;
};

module.exports.getAllRevenue = getAllRevenue;
module.exports.getRevenuePerMile = getRevenuePerMile;
module.exports.getNumberOfMiles = getNumberOfMiles;
module.exports.getCountOfLoads = getCountOfLoads;
module.exports.getExpensesByCategory = getExpensesByCategory;