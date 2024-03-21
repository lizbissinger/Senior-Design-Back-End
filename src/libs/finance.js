const LoadDetail = require("../models/LoadDetail");

async function getAllRevenue(
  groupBy,
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
    query = [{ $match: {} }, { $group: {} }];

    // add driver filter if any
    if (driver.length > 0 && driver != "null") {
      query[0].$match["driverObject"] = driver;
    }

    // add truck filter if any
    if (truck.length > 0 && truck != "null") {
      query[0].$match["truckObject"] = truck;
    }

    // add date picker filter if any
    if (from != "null" && to != "null") {
      const _from = new Date(from);
      const _to = new Date(to);
      _to.setHours(23);
      _to.setMinutes(59);
      query[0].$match["deliveryTime"] = {
        $gte: _from.toISOString(),
        $lt: _to.toISOString(),
      };
    }

    if (groupBy == "Driver") {
      query[1].$group = {
        _id: {
          driver: "$driverObject",
        },
        revenue: { $sum: "$price" },
        truck: { $addToSet: "$truckObject" },
        date: {
          $addToSet: {
            day: {
              $dayOfMonth: {
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
        },
      };
    } else if (groupBy == "Truck") {
      query[1].$group = {
        _id: {
          truck: "$truckObject",
        },
        revenue: { $sum: "$price" },
        driver: { $addToSet: "$driverObject" },
        date: {
          $addToSet: {
            day: {
              $dayOfMonth: {
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
        },
      };
    }

    let _data = [];
    data = await LoadDetail.aggregate(query);
    data.map((d) => {
      if (groupBy == "Driver") {
        d.driver = d._id.driver;
        if (!_data.find((_d) => _d.driver == d.driver)) {
          _data.push(d);
        }
      } else if (groupBy == "Truck") {
        d.truck = d._id.truck;
        if (!_data.find((_d) => _d.truck == d.truck)) {
          _data.push(d);
        }
      }
    });
    _data.map((d) => {
      d.date.sort(function (a, b) {
        let num =
          new Date(b.year, b.month, b.day) - new Date(a.year, a.month, a.day);
        let order = num >= 1 ? -1 : num <= -1 ? 1 : 0;
        return order;
      });
      const firstDate = new Date();
      const lastDate = new Date();
      firstDate.setMonth(d.date[0].month - 1);
      lastDate.setMonth(d.date[d.date.length - 1].month - 1);
      const obj = {};
      obj.key =
        groupBy == "Driver"
          ? `driver_${d.revenue}${d.driver}${d.truck[0]}${d.date[0].day}${d.date[0].month}${d.date[0].year}`
          : `truck_${d.revenue}${d.truck}${d.driver[0]}${d.date[0].day}${d.date[0].month}${d.date[0].year}`;
      obj.revenue = d.revenue;
      obj.driver =
        groupBy == "Truck"
          ? d.driver.length > 1
            ? "Multiple"
            : d.driver[0]
          : d.driver;
      obj.truck =
        groupBy == "Driver"
          ? d.truck.length > 1
            ? "Multiple"
            : d.truck[0]
          : d.truck;
      obj.date =
        d.date.length > 1
          ? `${firstDate.toLocaleString(
              "en-US",
              { month: "short" },
              { timeZone: "UTC" }
            )} ${
              d.date[0].day.toString().length == 1
                ? `0` + d.date[0].day
                : d.date[0].day
            }, ${d.date[0].year} - ${lastDate.toLocaleString(
              "en-US",
              { month: "short" },
              { timeZone: "UTC" }
            )} ${
              d.date[d.date.length - 1].day.toString().length == 1
                ? `0` + d.date[d.date.length - 1].day
                : d.date[d.date.length - 1].day
            }, ${d.date[d.date.length - 1].year}`
          : `${firstDate.toLocaleString(
              "en-US",
              { month: "short" },
              { timeZone: "UTC" }
            )} ${
              d.date[0].day.toString().length == 1
                ? `0` + d.date[0].day
                : d.date[0].day
            }, ${d.date[0].year}`;
      if (groupBy == "Driver") {
        obj.truckArr = d.truck;
      } else if (groupBy == "Truck") {
        obj.driverArr = d.driver;
      }
      formattedData.push(obj);
    });
  } catch (err) {
    console.log(err);
  }
  return formattedData;
}

module.exports.getAllRevenue = getAllRevenue;
