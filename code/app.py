import os
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func
from sqlalchemy import desc

from flask import Flask, jsonify, render_template
from config import Posgres_Pswrd

engine = create_engine(f"postgres://postgres:{Posgres_Pswrd}@localhost:5432/wildfires_db")

Base = automap_base()
Base.prepare(engine, reflect=True)

wildfires=Base.classes.wildfires


app = Flask(__name__)



@app.route("/")
def home():
    
    return render_template('index.html')

@app.route("/data")
def findall():

    session = Session(engine)
    results = session.query(wildfires).all()
    session.close

    dataReturn=[]
    for fire in results:
        fireDict={
            "objectid":fire.objectid,
            "fod_id":fire.fod_id,
            "fpa_id":fire.fpa_id,
            # "source_system_type":fire.SOURCE_SYSTEM_TYPE,
            # "source_system":fire.SOURCE_SYSTEM,
            # "nwcg_reporting_agency":fire.NWCG_REPORTING_AGENCY,
            # "nwcg_reporting_unit_id":fire.NWCG_REPORTING_UNIT_ID,
            # "nwcg_reporting_unit_name":fire.NWCG_REPORTING_UNIT_NAME,
            # "source_reporting_unit":fire.SOURCE_REPORTING_UNIT,
            # "source_reporting_unit_name":fire.SOURCE_REPORTING_UNIT_NAME,
            # "local_fire_report_id":fire.LOCAL_FIRE_REPORT_ID,
            # "local_incident_id":fire.LOCAL_INCIDENT_ID,
            "fire_code":fire.fire_code,
            "fire_name":fire.fire_name,
            # "ics_209_incident_number":fire.ICS_209_INCIDENT_NUMBER,
            # "ics_209_name":fire.ICS_209_NAME,
            # "mtbs_id":fire.MTBS_ID,
            # "mtbs_fire_name":fire.MTBS_FIRE_NAME,
            # "complex_name":fire.COMPLEX_NAME,
            "fire_year":fire.fire_year,
            "discovery_doy":fire.discovery_doy,
            "discovery_time":fire.discovery_time,
            # "stat_cause_code":fire.STAT_CAUSE_CODE,
            "stat_cause_descr":fire.stat_cause_descr,
            "cont_doy":fire.cont_doy,
            "cont_time":fire.cont_time,
            "fire_size": fire.fire_size,
            "fire_size_class":fire.fire_size_class,
            "latitude":fire.latitude,
            "longitude":fire.longitude,
            # "owner_code":fire.OWNER_CODE,
            # "owner_descr":fire.OWNER_DESCR,
            "state":fire.state,
            "county":fire.county,
            "fips_code":fire.fips_code,
            "fips_name":fire.fips_name,
            # "shape":fire.SHAPE,
            "discovery_date_converted":fire.discovery_date_converted,
            "cont_date_converted":fire.cont_date_converted

        }
        dataReturn.append(fireDict)
    return jsonify(dataReturn)


@app.route("/state")
def state():

    session = Session(engine)
    results = session.query(wildfires.state, func.count(wildfires.objectid).label("total_fires")).group_by(wildfires.state).all()
    session.close

    dataReturn=[]
    for state in results:
        stateDict={
            "state":state.state,
            "total_fires": state.total_fires

        }
        dataReturn.append(stateDict)
    return jsonify(dataReturn)


@app.route("/stcty")
def stcty():

    session = Session(engine)
    results = session.query(wildfires.state, wildfires.county, func.count(wildfires.objectid).label("total_fires")).group_by(wildfires.state, wildfires.county).all()
    session.close

    dataReturn=[]
    for stcty in results:
        stctyDict={
            "state":stcty.state,
            "county":stcty.county,
            "total_fires": stcty.total_fires

        }
        dataReturn.append(stctyDict)
    return jsonify(dataReturn)

if __name__ == '__main__':
    app.run(debug=True)