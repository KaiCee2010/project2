import os
import numpy as np

import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Float, Date
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from sqlalchemy import func
from sqlalchemy import desc

from flask import Flask, jsonify, render_template
from config import Posgres_Pswrd

engine = create_engine(f"postgres://postgres:{Posgres_Pswrd}@localhost:5432/wildfires_db")

Base = declarative_base()
Base.metadata.create_all(engine)

class wildfires(Base):
    __tablename__="wildfires"
    objectid = Column(Integer, primary_key=True)
    fod_id = Column(Integer)
    fpa_id = Column(String)
    source_system_type = Column(String)
    source_system = Column(String)
    nwcg_reporting_agency = Column(String)
    nwcg_reporting_unit_id = Column(String)
    nwcg_reporting_unit_name = Column(String)
    source_reporting_unit = Column(String)
    source_reporting_unit_name = Column(String)
    local_fire_report_id = Column(String)
    local_incident_id = Column(String)
    fire_code = Column(String)
    fire_name = Column(String)
    ics_209_incident_number = Column(String)
    ics_209_name = Column(String)
    mtbs_id = Column(String)
    mtbs_fire_name = Column(String)
    complex_name = Column(String)
    fire_year = Column(Integer)
    discovery_doy = Column(Integer)
    discovery_time = Column(String)
    stat_cause_code = Column(Float)
    stat_cause_descr = Column(String)
    cont_doy = Column(Integer)
    cont_time = Column(String)
    fire_size = Column(Float)
    fire_size_class = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    owner_code = Column(Float)
    owner_descr = Column(String)
    state = Column(String)
    county = Column(String)
    fips_code = Column(String)
    fips_name = Column(String)
    shape = Column(String)
    discovery_date_converted = Column(Date)
    cont_date_converted = Column(Date)
    burning_days = Column(Float)
    state_name = Column(String)


app = Flask(__name__)


@app.route("/")
def home():
    
    return render_template('index.html')

@app.route("/data")
def findall():

    session = Session(bind=engine)
    results = session.query(wildfires).all()
    session.close

    dataReturn=[]
    for fire in results:
        fireDict={
            "objectid":fire.objectid,
            "fod_id":fire.fod_id,
            "fpa_id":fire.fpa_id,
            "fire_code":fire.fire_code,
            "fire_name":fire.fire_name,
            "fire_year":fire.fire_year,
            "discovery_doy":fire.discovery_doy,
            "discovery_time":fire.discovery_time,
            "stat_cause_descr":fire.stat_cause_descr,
            "cont_doy":fire.cont_doy,
            "cont_time":fire.cont_time,
            "fire_size": fire.fire_size,
            "fire_size_class":fire.fire_size_class,
            "latitude":fire.latitude,
            "longitude":fire.longitude,
            "state":fire.state,
            "county":fire.county,
            "fips_code":fire.fips_code,
            "fips_name":fire.fips_name,
            "discovery_date_converted":fire.discovery_date_converted,
            "cont_date_converted":fire.cont_date_converted,
            "burning_days": fire.burning_days,
            "state_name": fire.state_name
        }
        dataReturn.append(fireDict)
    return jsonify(dataReturn)


@app.route("/state")
def state():

    session = Session(engine)
    results = session.query(wildfires.fire_year, wildfires.state, wildfires.state_name, func.count(wildfires.objectid).label("total_fires")).group_by(wildfires.fire_year, wildfires.state, wildfires.state_name).all()
    session.close

    dataReturn=[]
    for state in results:
        stateDict={
            "fire_year":state.fire_year,
            "state":state.state,
            "state_name":state.state_name,
            "total_fires": state.total_fires

        }
        dataReturn.append(stateDict)
    return jsonify(dataReturn)

<<<<<<< HEAD
# @app.route('/top_per_state')
# def top_per_state(): 
#     top_fires={}
#     session=Session(engine)
#     states_list=session.query(wildfires.state).distinct().all()
#     for each_state in states_list: 
#         top=session.query(wildfires.fire_size, wildfires.longitude, wildfires.latitude).filter(wildfires.state==each_state).order_by(desc(wildfires.fire_size)).limit(10).all()
#         top_fires[each_state[0]]=[x[0] for x in top]
#     session.close
#     return jsonify(top_fires)


@app.route("/cause")
def cause():

    session = Session(engine)
    results = session.query(wildfires.state, wildfires.stat_cause_descr, func.count(wildfires.objectid).label("total_causes")).group_by(wildfires.state, wildfires.stat_cause_descr).all()
    session.close

    dataReturn=[]
    for cause in results:
        stateDict={
            "state": cause.state,
            "cause": cause.stat_cause_descr,
            "total_causes": cause.total_causes
            
        }
        dataReturn.append(stateDict)
    return jsonify(dataReturn)




=======
@app.route("/state2")
def state2():

    session = Session(engine)
    results = session.query(wildfires.fire_year, wildfires.state, wildfires.state_name, func.count(wildfires.objectid).label("total_fires")).group_by(wildfires.fire_year, wildfires.state, wildfires.state_name).all()
    session.close

    dataReturn=[]
    for state in results:
        stateDict={
            state.state_name:{
                state.fire_year:state.total_fires

        }}
        dataReturn.append(stateDict)
    return jsonify(dataReturn)
>>>>>>> c59021e94920407886eda9d5ad2737d63b6e44c9

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


@app.route('/top_per_state')
def top_per_state():
    top_fires={}
    session=Session(engine)
    states_list=session.query(wildfires.state).distinct().all()
    for each_state in states_list:
        top=session.query(wildfires.fire_size, wildfires.longitude, wildfires.latitude).filter(wildfires.state==each_state).order_by(desc(wildfires.fire_size)).limit(10).all()
        top_fires[each_state[0]]=[x[0] for x in top]
    session.close
    return jsonify(top_fires)

@app.route('/firesbyyears')
def firesbyyears():
    return render_template('firesbyyears.html')



@app.route('/firesbystates')
def firesbystates():
    return render_template('firesbyyears.html')



if __name__ == '__main__':
    app.run(debug=True)