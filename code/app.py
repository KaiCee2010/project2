import os
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from config import Posgres_Pswrd

engine = create_engine(f"postgres://postgres:{Posgres_Pswrd}@localhost:5432/wildfires_db")

Base = automap_base()
Base.prepare(engine, reflect=True)

wildfiresDB=Base.classes.wildfires


app = Flask(__name__)



@app.route("/")
def home():
    
    return render_template('index.html')

@app.route("/data")
def findall():

    session = Session(engine)
    results = session.query(wildfiresDB).all()
    session.close

    dataReturn=[]
    for fire in results:
        fireDict={
            "objectid":fire.OBJECTID,
            "fod_id":fire.FOD_ID,
            "fpa_id":fire.FPA_ID,
            # "source_system_type":fire.SOURCE_SYSTEM_TYPE,
            # "source_system":fire.SOURCE_SYSTEM,
            # "nwcg_reporting_agency":fire.NWCG_REPORTING_AGENCY,
            # "nwcg_reporting_unit_id":fire.NWCG_REPORTING_UNIT_ID,
            # "nwcg_reporting_unit_name":fire.NWCG_REPORTING_UNIT_NAME,
            # "source_reporting_unit":fire.SOURCE_REPORTING_UNIT,
            # "source_reporting_unit_name":fire.SOURCE_REPORTING_UNIT_NAME,
            # "local_fire_report_id":fire.LOCAL_FIRE_REPORT_ID,
            # "local_incident_id":fire.LOCAL_INCIDENT_ID,
            "fire_code":fire.FIRE_CODE,
            "fire_name":fire.FIRE_NAME,
            # "ics_209_incident_number":fire.ICS_209_INCIDENT_NUMBER,
            # "ics_209_name":fire.ICS_209_NAME,
            # "mtbs_id":fire.MTBS_ID,
            # "mtbs_fire_name":fire.MTBS_FIRE_NAME,
            # "complex_name":fire.COMPLEX_NAME,
            "fire_year":fire.FIRE_YEAR,
            "discovery_doy":fire.DISCOVERY_DOY,
            "discovery_time":fire.DISCOVERY_TIME,
            # "stat_cause_code":fire.STAT_CAUSE_CODE,
            "stat_cause_descr":fire.STAT_CAUSE_DESCR,
            "cont_doy":fire.CONT_DOY,
            "cont_time":fire.CONT_TIME,
            "fire_size":fire.FIRE_SIZE,
            "fire_size_class":fire.FIRE_SIZE_CLASS,
            "latitude":fire.LATITUDE,
            "longitude":fire.LONGITUDE,
            # "owner_code":fire.OWNER_CODE,
            # "owner_descr":fire.OWNER_DESCR,
            "state":fire.STATE,
            "county":fire.COUNTY,
            "fips_code":fire.FIPS_CODE,
            "fips_name":fire.FIPS_NAME,
            # "shape":fire.SHAPE,
            "discovery_date_converted":fire.DISCOVERY_DATE_CONVERTED,
            "cont_date_converted":fire.CONT_DATE_CONVERTED

        }
        dataReturn.append(fireDict)
    return jsonify(dataReturn)


if __name__ == '__main__':
    app.run(debug=True)