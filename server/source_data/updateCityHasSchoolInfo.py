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
#

#
#
if __name__ == "__main__":
    dburi = 'mongodb://uuuuu:ppppp@127.0.1:27017/rnc_production'
    rncdb = rncMongoDB(dburi,"rnc_production")
    print rncdb
    #
    """
    for cltn in collectionsToReset:
	print "Resetuje kolekcje: [%s]..." % cltn
        collection = rncdb.mongoDB[cltn]
        #print(collection.count() == 0)    #Check if collection named 'posts' is empty
	print "\t\t\t\t* elementow: %s" % collection.count()
        collection.drop()
    #
    #rncdb.close()
    """

    #
    #
    collCities = rncdb.mongoDB["cities"]
    collSchools = rncdb.mongoDB["servicegroups"]
    #
    for school in collSchools.find({"group_type":"school"}):
	print school['school_info']['city_id']
	collCities.update({"_id":school['school_info']['city_id']},{{"$set":"has_school":True}})

#
# EOF
#