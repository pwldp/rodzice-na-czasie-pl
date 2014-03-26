#!/bin/bash
#
DATE="/bin/date"
GZIP="/bin/gzip"
TAR="/bin/tar"
#
SPIDEROAKDIR="/home/madateam/SpiderOak Hive/"
#
DIRRNC="/home/madateam/RNC_ss34"
DIRBACKUP="/home/madateam/SpiderOak Hive/RNC/backup/"
RNCDACKUP="/home/RNC_backup"
#
mv -f $DIRBACKUP/* $RNCDACKUP
#
cd $DIRNC
rm -f app.log
cat "" > app.log
#
# backup DB z MongoDB
/usr/bin/mongodump -h 127.0.0.1 -db rnc_production -o $DIRRNC
#
$DATE +"Start: %Y-%m-%d %H:%M"
#
BKP_FILE_NAME=`$DATE +"rnc_bkp_%Y%m%d.tgz"`
#
$TAR -c $DIRRNC | $GZIP - > "$DIRBACKUP/$BKP_FILE_NAME"
#
$DATE +"Stop:  %Y-%m-%d %H:%M"
#
# synchronizuje z SpiderOak
/usr/bin/SpiderOak --batchmode
#
# synchronizuje z Google Drive (rncdevel@gmail.com)
cd "/home/madateam/SpiderOak Hive/RNC/"
/usr/bin/grive
#
# EOF
#