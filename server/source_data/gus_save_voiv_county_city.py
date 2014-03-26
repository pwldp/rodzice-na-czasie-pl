#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
#
from lxml import etree
from rncMongoDriver import rncMongoDB
from slughifi import *
#
#=================================================
#
voivsList=[
    {
	'name': "nieznane",
	'terc': "00"
    },
    {
	'name': "dolnośląskie",
	'terc': "02"
    },
    {
	'name': "kujawsko-pomorskie",
	'terc': "04"
    },
    {
	'name': "lubelskie",
	'terc': "06"
    },
    {
	'name': "lubuskie",
	'terc': "08"
    },
    {
	'name': "łódzkie",
	'terc': "10"
    },
    {
	'name': "małopolskie",
	'terc': "12"
    },
    {
	'name': "mazowieckie",
	'terc': "14"
    },
    {
	'name': "opolskie",
	'terc': "16"
    },
    {
	'name': "podkarpackie",
	'terc': "18"
    },
    {
	'name': "podlaskie",
	'terc': "20"
    },
    {
	'name': "pomorskie",
	'terc': "22"
    },
    {
	'name': "śląskie",
	'terc': "24"
    },
    {
	'name': "świętokrzyskie",
	'terc': "26"
    },
    {
	'name': "warmińsko-mazurskie",
	'terc': "28"
    },
    {
	'name': "wielkopolskie",
	'terc': "30"
    },
    {
	'name': "zachodniopomorskie",
	'terc': "32"
    },

]
#
#=================================================
#
class gusData(rncMongoDB):
    
    collectionsList = ["voivodeships","counties","cities"]
    
    def __init__(self):
	dburi = 'mongodb://uuuuu:ppppp@127.0.1:27017/rnc_production'
	rncMongoDB.__init__(self,dburi,"rnc_production")
	#
	self.deleteCollections()
	self.createCollections()
	self.createVoivideshipsCollection()
	self.createCountiesCollection()
	self.createCitiesCollection()
	#self.loadData()
    #
    #--------------------------------------------------------------------------
    def _getRowData(self, row):
	#print row
	cols = row.findall("col")
	cwoj = ''
	cpow = ''
	cgmi = ''
	crodz = 0
	crodz_gmi = ""
	cnazwa = ''
	cnazdod = ''
	cstan_na = '1970-01-01'
	for col in cols:
	    #print cols
	    #print '\t',col.attrib['name'], col.text
	    #
	    if col.attrib['name'] == "WOJ":
		#if col.attrib['name']!='None':
		    #cwoj = col.text
		try:
		    cwoj = int(col.text)
		    cwoj = col.text
		except:
		    cwoj = ''
	    #
	    if col.attrib['name'] == "POW":
		#if col.attrib['name']!='None':
		    #cpow = col.text
		try:
		    cpow = int(col.text)
		    cpow = col.text
		except:
		    cpow = ''
	    #
	    if col.attrib['name'] == "GMI":
		#if col.attrib['name']!=None:
		    #colcgmi = col.text
		try:
		    cgmi = int(col.text)
		    cgmi = col.text
		except:
		    cgmi = ''
	    #
	    if col.attrib['name'] == "RODZ":
		try:
		    int(col.text)
		    crodz = col.text
		except:
		    crodz = ""
	    #
	    if col.attrib['name'] == "RODZ_GMI":
		try:
		    int(col.text)
		    crodz_gmi = col.text
		except:
		    crodz_gmi = ""
	    #
	    if col.attrib['name'] == "NAZWA":
		if col.attrib['name']!=None:
		    cnazwa = col.text
	    #
	    if col.attrib['name'] == "NAZDOD":
		if col.attrib['name']!=None:
		    cnazdod = col.text
	    #
	    if col.attrib['name'] == "STAN_NA":
		if col.attrib['name']!=None:
		    cstan_na = col.text
	#
	cteryt = "%s%s%s" % (cwoj,cpow,cgmi)
	#
	return {
	    "TERYT": cteryt,
	    "WOJ": cwoj,
	    "POW": cpow,
	    "GMI": cgmi,
	    "RODZ": crodz,
	    "RODZ_GMI": crodz_gmi,
	    "NAZWA": cnazwa,
	    "NAZDOD": cnazdod,
	    "STAN_NA": cstan_na
	    }

    #
    #--------------------------------------------------------------------------
    def loadData(self):
	print "loadData()..."
	xmlFile = "./GUS/SIMC.xml"
	print "Czytam plik: [%s]..." % xmlFile
	tree = etree.parse( xmlFile  )
	rows = tree.findall("//row") 
 	for row in rows:
	    print '============='
    #
    #--------------------------------------------------------------------------
    def deleteCollections(self):
	print "deleteCollections()..."
	for colls in self.collectionsList:
	    print "Czy jest kolekcja: [%s]..." % colls
	    if colls in self.mongoDB.collection_names():
		print "\ttak, kasuję ją."
		collection = self.mongoDB[colls]
		#print(collection.count() == 0)    #Check if collection named 'posts' is empty
		collection.drop()
    #
    #--------------------------------------------------------------------------
    def createCollections(self):
	print "createCollections()..."
	for colls in self.collectionsList:
	    print "Tworze kolekcje: [%s]..." % colls
	    collection = self.mongoDB[colls]
    #
    #--------------------------------------------------------------------------
    def createVoivideshipsCollection(self):
	print "createVoivideshipsCollection()..."
	collVoiv = self.mongoDB['voivodeships']
	for voiv in voivsList:
	    print voiv['name']
	    inVoiv =  collVoiv.insert(voiv)
	#
	# tworze indexy
	collVoiv.ensure_index('name', unique=True)
	collVoiv.ensure_index('terc', unique=True)
    #
    #--------------------------------------------------------------------------
    def createCountiesCollection(self):
	print "createCountiesCollection()..."
	collVoiv = self.mongoDB['voivodeships']
	collConties = self.mongoDB['counties']
	xmlFile = "./GUS/TERC.xml"
	print "Czytam plik: [%s]..." % xmlFile
	tree = etree.parse( xmlFile  )
	rows = tree.findall("//row") 
 	for row in rows:
	    #print '============='
	    #cols = row.findall("col")
	    tr = self._getRowData(row)
	    if tr["GMI"]=="":
		print tr
		tVoiv = collVoiv.find_one({"terc":tr["WOJ"]})
		print tVoiv
		
		inCounty = {
		    "name": tr["NAZWA"],
		    "teryt": tr["TERYT"],
		    "teryt_woj": tr["WOJ"],
		    "teryt_pow": tr["POW"],
		    "voiv_id": tVoiv["_id"],
		    "voiv_name": tVoiv["name"],
		    }
		#
		collConties.insert(inCounty)
	#
	collConties.ensure_index('name', unique=False)
	collConties.ensure_index('teryt', unique=True)
	collConties.ensure_index('teryt_pow', unique=False)
    #
    #--------------------------------------------------------------------------
    def createCitiesCollection(self):
	print "createCitiesCollection()..."
	#
	collVoiv = self.mongoDB['voivodeships']
	collCounties = self.mongoDB['counties']
	collCities = self.mongoDB['cities']
	#
	xmlFile = "./GUS/SIMC.xml"
	print "Czytam plik: [%s]..." % xmlFile
	tree = etree.parse( xmlFile  )
	rows = tree.findall("//row") 
 	for row in rows:
	    #print '============='
	    #cols = row.findall("col")
	    tr = self._getRowData(row)
	    #print tr
	    tVoiv = collVoiv.find_one({"terc":tr["WOJ"]})
	    tCounty = collCounties.find_one({"teryt_woj": tr["WOJ"], "teryt_pow": tr["POW"]})
	    #print tCounty
	    inCity={
		"name": tr["NAZWA"],
		"slug": slughifi(tr["NAZWA"]),
		"teryt": "%s%s%s%s" % (tr["WOJ"], tr['POW'], tr['GMI'], tr['RODZ_GMI']),
		"teryt_woj": tr["WOJ"],
		"teryt_pow": tr["POW"],
		"teryt_gmi": tr["GMI"],
		"teryt_rodz_gmi": tr["RODZ_GMI"],
		"voiv_id": tVoiv["_id"],
		"voiv_name": tVoiv["name"],
		"county_id": tCounty["_id"],
		"county_name": tCounty["name"],
		"has_school":False,
		}
	    print inCity['voiv_name'],'->',inCity['name']
	    #
	    collCities.insert(inCity)
#
#=================================================
#
if __name__ == "__main__":
    gus = gusData()

#
# EOF
#