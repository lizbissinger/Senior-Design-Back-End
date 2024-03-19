const LoadDetail = require("../models/LoadDetail");

async function getAllRevenue(
  driver = null,
  truck = null,
  from = null,
  to = null
) {
  let formattedData = [];

  try {
    let query;
    let data;

    // create query layout
    query = [{ $match: {} }, { $group: {} }, { $sort: {} }];

    // add driver filter if any
    if (driver.length > 0 && driver != "null") {
      console.log("DRIVER ", driver);
      query[0].$match["driverObject"] = driver;
    }

    // add truck filter if any
    if (truck.length > 0 && truck != "null") {
      console.log("TRUCK ", truck);
      query[0].$match["truckObject"] = truck;
    }

    // add date picker filter if any
    if (from != "null" && to != "null") {
      const _from = new Date(from);
      const _to = new Date(to);
      _to.setHours(23);
      _to.setMinutes(59);
      console.log("FROM ", _from);
      console.log("TO ", _to);
      query[0].$match["deliveryTime"] = {
        $gte: _from.toISOString(),
        $lt: _to.toISOString(),
      };
    }

    query[1].$group = {
      _id: {
        date: {
          week: {
            $week: {
              $dateFromString: { dateString: "$deliveryTime" },
            },
          },
          month: {
            $month: {
              $dateFromString: { dateString: "$deliveryTime" },
            },
          },
          year: {
            $year: {
              $dateFromString: { dateString: "$deliveryTime" },
            },
          },
        },
        driver: "$driverObject",
        truck: "$truckObject",
      },
      revenue: { $sum: "$price" },
    };
    query[2].$sort = {
      "_id.date.year": 1,
      "_id.date.month": 1,
      "_id.date.week": 1,
    };
    data = await LoadDetail.aggregate(query);
    data.map((d) => {
      const obj = {};
      obj.revenue = d.revenue;
      obj.driver = d._id.driver;
      obj.truck = d._id.truck;
      obj.weekStart = d._id.weekStart;
      obj.date = `Week ${d._id.date.week}`;
      formattedData.push(obj);
    });
  } catch (err) {
    console.log(err);
  }
  return formattedData;
}

module.exports.getAllRevenue = getAllRevenue;
