#!/usr/bin/env python
#
#===============================================================================
#
import sys
import pymongo
#
#===============================================================================
#
class rncMongoDB():
    def __init__(self, dbURI, dbname ):
	print "Lacze sie do:[%s]" % dbURI
	try:
	    connection = pymongo.Connection(dbURI)
	except:
	    sys.exit("Nie moge polaczyc sie z MongoDB.")
	#
	try:
	    self.mongoDB = connection[dbname]
	except:
	    sys.exit("Nie moge odczytac podanej DB [%s]." % dbname)
	#cities = self.mongoDB.cities;
	#for city in cities.find():
	#    print city
	
#
#===============================================================================
#
if __name__ == "__main__":

    dburi = 'mongodb://uuuuu:ppppp@xxx.xxx.xxx.xxx:27017/rnc_dp'
    rmdb = rncMongoDB(dburi,"rnc_dp")
#
# EOF
#