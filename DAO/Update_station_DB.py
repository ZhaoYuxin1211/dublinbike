# web API crawling
import datetime

from DAO import dbinfo
import json
import sqlalchemy as sqla
import traceback
import requests
import time

# using mysql + pymysql, not the same as the slides.
engine = sqla.create_engine(
    "mysql+pymysql://{}:{}@{}:{}/{}".format(dbinfo.DB_USERNAME, dbinfo.DB_PASSWORD, dbinfo.DB_ADDRESS, dbinfo.DB_PORT,
                                            dbinfo.DB_SCHEMA), echo=True)


# def write_to_file(text):
#     with open("data/bike_{}".format(now).replace(" ", "_"), "w") as f:
#         f.write(r.text)

# update station data into database
def stations_to_db(text):
    stations = json.loads(text)
    # print(type(stations), len(stations))
    # print(stations)
    for station in stations:
        # print(station)
        vals = (
            station.get('address'), int(station.get('banking')),
            station.get('bike_stands'), station.get('name'), station.get('position').get('lat'),
            station.get('position').get('lng'), int(station.get('number')))
        engine.execute(
            "UPDATE station SET address=%s, banking = %s, bike_stands = %s, name = %s, position_lat = %s, "
            "position_lng = %s WHERE number = %s",
            vals)
    return


# update availability info into database
def availability_to_db(text):
    availability = json.loads(text)
    print(type(availability), len(availability))
    for a in availability:
        # print(a)
        vals = (
            a.get('last_update'), int(a.get('available_bikes')),
            int(a.get('available_bike_stands')), a.get('status'), int(a.get('number')))
        # update
        engine.execute("UPDATE availability SET last_update = %s, available_bikes = %s, available_bike_stands = %s, "
                       "status = %s WHERE number = %s", vals)
        # insert
        # vals = (
        #     int(a.get('number')), a.get('last_update'), int(a.get('available_bikes')),
        #     int(a.get('available_bike_stands')), a.get('status'))
        # engine.execute("INSERT INTO availability VALUES (%s,%s,%s,%s,%s)" , vals)
    return


def main():
    while True:
        try:
            now = datetime.datetime.now()
            r = requests.get(dbinfo.STATIONS_URI, params={"apiKey": dbinfo.JCKEY, "contract": dbinfo.NAME})
            # print(r, now)
            # write_to_file(r.text)
            stations_to_db(r.text)
            availability_to_db(r.text)
            # print(a)
            time.sleep(10 * 60) # update every 10min
        except:
            print(traceback.format_exc())
            if engine is None:
                return


main()
