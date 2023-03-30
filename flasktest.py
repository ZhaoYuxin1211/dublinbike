import functools

from flask import Flask, g, render_template,jsonify
from DAO.StationDAO import *
import json


# create flask app, static files are served from "static" directory
app = Flask(__name__, static_folder='Static')
# app.config.from_object('config')

#  this route simply serves 'static/index.html'
@app.route('/')
def root():
    get_stations()
    return render_template('index.html', MAPS_APIKEY=dbinfo.MAP_KEY)
    # return "hello there!"

@app.route("/stations")

def get_stations():
    # get the station data from StationDAO.py the return type is jason string
    stations = StationDAO()
    return jsonify(stations=stations)



@app.route("/available/<int:station_id>")
def get_available_bikes(station_id):
    # Get all station data
    all_stations = StationDAO()

    # Find the station with the given ID
    station = next((s for s in all_stations if s['number'] == station_id), None)

    if station is None:
        # Station not found
        return jsonify(error='Station not found'), 404

    # Extract the available bikes data for the station
    available_bikes = station['availableBikes']

    return jsonify(available=available_bikes)

@app.route("/occupancy/<int:station_id>")
def get_occupancy(station_id):
    station =StationDAO()
    df = pd.read_sql_query("select * from availability where number = %(number)s", station, params={"number":
    station_id})
    df['last_update_date'] = pd.to_datetime(df.last_update, unit='ms')
    df.set_index('last_update_date', inplace=True)
    res = df['available_bike_stands'].resample('1d').mean()
    #res['dt'] = df.index
    print(res)
    return jsonify(data=json.dumps(list(zip(map(lambda x: x.isoformat(), res.index), res.values))))




if __name__ == "__main__":

    app.run(debug=True)




