#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
import os.path
import sys
import time
#
from slughifi import *
import xlrd
#
from rncMongoDriver import rncMongoDB
#
#
voivList = ['pomorskie.xls','dolnoslaskie.xls','kujawsko-pomorskie.xls','lubelskie.xls','malopolskie.xls','opolskie.xls','podlaskie.xls','warminsko-mazurskie.xls','zachodniopomorskie.xls','lodzkie.xls','lubuskie.xls','mazowieckie.xls','podkarpackie.xls','slaskie.xls','swietokrzyskie.xls','wielkopolskie.xls']
#
#=================================================
#
colWOJ = 1
colPOW = 2
colGM = 3
colCity = 4
colSchoolType = 6
colSchool = 8
colPatron = 9
colStreet = 10
colHouseNum = 11
colPostcode = 12
colPhone = 14
colFax = 15
colWWW = 16
#
# Czytam nastepujace typy szkol:
# 00001 - przedszkole
# 00003 - szkoła podstawowe
# 00004 - gimnazjum
# 00014 - liceum ogolnoksztalcace
# 00015 - liceum profilowane
# 00016 - technikum
#
valid_school_types = ['00001','00003', '00004', '00014', '00015', '00016' ]
#
class menData(rncMongoDB):
    def __init__(self):
	print "menData"
	dburi = 'mongodb://uuuuu:ppppp@127.0.1:27017/rnc_production'
	rncMongoDB.__init__(self,dburi,"rnc_production")
	
	#
	self.collVoiv = self.mongoDB['voivodeships']
	self.collConties = self.mongoDB['counties']
	self.collCities = self.mongoDB['cities']
	self.collSchoolType = self.mongoDB['schooltypes']
	self.collServiceGroup = self.mongoDB['servicegroups']
	self.collServiceGroupMember = self.mongoDB['servicegroupmemberss']
	#
	# rekreate kolekcje listy szkol
	#self._recreateSchoolCollection()
	self._deleteSchoolsGroupsAndMembers()
	#
	self.readDataFromXLS()
	#
    #--------------------------------------------------------------------------
    #
    def _deleteSchoolsGroupsAndMembers(self):
	print "_deleteSchoolsGroupsAndMembers()..."
	#
	# czytam liste grup szkol do skasowania
	schoolGroups = self.collServiceGroup.find({"group_type":"school"})
	for sg in schoolGroups:
	    print "Kasuje czlonkow i grupę: ",sg['_id'], sg['name']
	    self.collServiceGroupMember.remove({"group_id":sg['_id']});
	    self.collServiceGroup.remove({"_id":sg['_id']});
	#print schoolGroups
	
    #--------------------------------------------------------------------------
    #
    """
    def _recreateSchoolCollection(self):
	if "schools" in self.mongoDB.collection_names():
	    print "Kasuje kolekcje 'schools'..."
	    collection = self.mongoDB["schools"]
	    #print(collection.count() == 0)    #Check if collection named 'posts' is empty
	    collection.drop()
	    print "Tworze nową kolekcje 'schools'..."
	#
	self.collSchools = self.mongoDB["schools"]
    """
    #
    #---------------------------------------------------------------------------
    def readDataFromXLS(self):
	for xlsFile in voivList:
	    tmpFile = os.path.join("./MEN", xlsFile )
	    print "Czytam dane z pliku:[%s]" % xlsFile
	    wb = xlrd.open_workbook( tmpFile )
	    sh = wb.sheet_by_index(0)
	    schoolCounter=0
	     #print sh.nrows
 # city_id = 0
  #county_id_counter = 0
	    czy_sa_dane = False
	    for rownum in range(sh.nrows):
		#print sh.row_values(rownum)[colCity]
		
		cWOJ = sh.row_values(rownum)[colWOJ]
		cPOW = sh.row_values(rownum)[colPOW]
		cGM = sh.row_values(rownum)[colGM]
		#
		city_name = sh.row_values(rownum)[colCity]	# tutaj nei moze byc strip()
		city_slug = slughifi(unicode(city_name))
		#
		school_type = sh.row_values(rownum)[colSchoolType]
		if czy_sa_dane:
		    if len(city_slug)>0 and school_type in valid_school_types:
			tCity = self.collCities.find_one({"slug":city_slug, "teryt_woj":cWOJ})
			#print city_name,city_slug,", CITY=",tCity
			tSchoolType = self.collSchoolType.find_one({"type":school_type})
			#print "SchoolType=",tSchoolType
			#print "SchoolType=",school_type
			
			if tCity==None or tCity=="" or tSchoolType==None:
			    msg = "Brak miasta [%s] lub typu szkoly [%s] w DB" % (slughifi(city_name),school_type)
			    #open("./brakujace_miasta.log","a").write("%s -> woj: %s, pow: %s\n" % (msg, tCity['voiv_name'],tCity['county_name']))
			    open("./brakujace_miasta.log","a").write("%s -> woj: , pow: \n" % (msg))
			    #sys.exit(msg)
			else:
			    #
			    #school_name = sh.row_values(rownum)[colSchool]
			    #
			    # znalazlem dane wiec je zapisze
			    #print "SchoolType=",tSchoolType
			    schoolGroup = {
				"id":"",
				"name": sh.row_values(rownum)[colSchool],
				"slug": slughifi(sh.row_values(rownum)[colSchool]),
				"school_info": {
				    "school_type_id": tSchoolType['_id'],
				    "school_type": tSchoolType['type'],
				    "school_type_name": tSchoolType['name'].lower(),
				    "address": "%s %s" % (sh.row_values(rownum)[colStreet].strip(),sh.row_values(rownum)[colHouseNum].strip()),
				    "postcode": sh.row_values(rownum)[colPostcode].strip(),
				    "voivodeship_id": tCity['voiv_id'],
				    "voivodeship": tCity['voiv_name'],
				    "county_id": tCity['county_id'],
				    "county": tCity['county_name'],
				    "city_id": tCity['_id'],
				    "city": tCity['name'],
				    "phone": sh.row_values(rownum)[colPhone].strip().replace(" ",""),
				    "www": sh.row_values(rownum)[colWWW].strip().replace(" ",""),
				    "email": "",
				    "note": "Wczytane dnia %s na podst. listy szkół MEN" % time.strftime("%Y-%m-%d"),
				    "patron": sh.row_values(rownum)[colPatron].strip(),
				},
				"is_school_class": False,
				"group_type": "school",
				"creation_dt": time.strftime("%Y-%m-%d %H:%M:%S"),
				"edited_dt":  time.strftime("%Y-%m-%d %H:%M:%S")
			    }
			    #
			    #print schoolGroup
			    #
			    #self.collSchools.insert(inSchool)
			    sgID = self.collServiceGroup.insert(schoolGroup)
			    #print "\n\nsgID=",sgID
			    self.collServiceGroup.update({"_id": sgID}, {"$set": {"id": sgID}})
			    schoolCounter+=1
			    self.collCities.update({"_id":tCity['_id']},{"$set":{"has_school":True}})
		    """
		    #
		    db.save(inSchool)
		    #
		    db.test.update({"x": "y"}, {"has_school": True})
		    """
		#
		if city_slug=="50":
		    czy_sa_dane=True
	    #
	    print "\twczytano szkół: ",schoolCounter
	    #
	    #break
    #
    #
#
#=================================================
#
if __name__ == "__main__":

    mnd = menData()
#
# EOF
#