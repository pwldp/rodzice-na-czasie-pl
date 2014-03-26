#!/usr/bin/env python
#
#
import urllib2


to_dwnld = [
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy_slowniki/podzial_terytorialny.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy_slowniki/slowniki.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/dolnoslaskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/kujawsko-pomorskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/lubelskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/lubuskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/lodzkie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/malopolskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/mazowieckie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/opolskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/podkarpackie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/podlaskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/pomorskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/slaskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/swietokrzyskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/warminsko-mazurskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/wielkopolskie.xls',
    'http://www.cie.men.gov.pl/images/stories/sio_wykazy/zachodniopomorskie.xls',
]

def download_file( file_url ):
    pfn = file_url.split("/")
    local_fname = pfn[len(pfn)-1]
    dwnldfile = urllib2.urlopen( file_url )
    output = open(local_fname, 'wb')
    output.write(dwnldfile.read())
    output.close()


if __name__ == "__main__":
    for fn in to_dwnld:
	print "Pobieram plik:", fn
	download_file(fn)
#	pfn = fn.split("/")
#	print pfn[len(pfn)-1]

#
# EOF
#