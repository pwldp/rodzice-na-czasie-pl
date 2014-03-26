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
collectionsToReset = [
    "classteachers",
    "comments",
    "filefolders",
    "fileuserinfos",
    "invitations",
    "kidinschoolclasses",
    "kids",
    "kidsparents",
    "msgfolders",
    "msgs",
    "notifications",
    "pollassigngroups",
    "polls",
    "postforgroups",
    "posts",
    "schooltimetablehours",
    "schooltimetables",
    "servicegroupmembers",
    "servicegroups",
    "teacherinschools",
    "uniforms",
]
#
#
if __name__ == "__main__":
    dburi = 'mongodb://uuuuu:ppppp@127.0.1:27017/rnc_production'
    rncdb = rncMongoDB(dburi,"rnc_production")
    print rncdb
    #
    for cltn in collectionsToReset:
	print "Resetuje kolekcje: [%s]..." % cltn
        collection = rncdb.mongoDB[cltn]
        #print(collection.count() == 0)    #Check if collection named 'posts' is empty
	print "\t\t\t\t* elementow: %s" % collection.count()
        collection.drop()
    #
    #rncdb.close()
#
# EOF
#