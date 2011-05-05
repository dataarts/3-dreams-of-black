import json, urllib2

job = "44805"
key = "2e3d5066518dc1880eea0eb5c068b76b8163ae16"
url = "http://api.crowdflower.com/v1/jobs/%s/upload.json?key=%s" % (job, key)
obj = json.dumps({"column_1":"http://img.ffffound.com/static-data/assets/6/57014fc01102d5996a04d4d7e5aa5c124f3d959e_m.jpg"})

request = urllib2.Request(url, obj, {'content-type': 'application/json'})
response = urllib2.urlopen(request)
response = response.read()