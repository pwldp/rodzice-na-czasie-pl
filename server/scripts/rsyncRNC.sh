#!/bin/bash
DIRDST="/home/madateam/RNC"
IPSRC="xx.xx.xx.xx"
echo ""
echo -e "Pobieram z serwera: \t $IPSRC"
echo -e "Zapisuje do katalogu: \t $DIRDST"
echo -n "Czy sie zgadzasz? [t/n]"
read ANSWER
echo "Wybrales: $ANSWER"
SYNC="0"
if [ "$ANSWER" == "t" ];
then
    SYNC="1"
fi
if [ "$ANSWER" == "T" ];
then
    SYNC="1"
fi
if [ "$SYNC" == "1" ];
then
    DT=`date +%Y%m%d%H%M%S`
    ARCHFILE=$DIRDST"_last_arch_sync_at_"$DT".tgz"
    if [ ! -f $ARCHFILE ];
    then
	echo "Tworze kopie katalogu docelowego: $ARCHFILE ..."
	tar -c $DIRDST | gzip - > $ARCHFILE
    fi
    echo "Wykonuję synchronizację..."
    #rsync -avz --delete madateam@$IPSRC::RNC $DIRDST
    rsync -avz --delete --exclude 'node_modules*' --exclude '*~' --exclude 'app.log' $IPSRC::RNC $DIRDST
else
    echo "Zrezygnowałeś z synchronizacji."
fi
