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
    collCities = rncdb.mongoDB["cities"]
    collCities.remove({"has_school":False})
    
#
# EOF
#