import json, urllib2

# need to create a copy of the job so as to create a new job
# include the cml in order to embed the image files

# API requisites
job = "44839"
key = "2e3d5066518dc1880eea0eb5c068b76b8163ae16"

# API Calls
new = "http://api.crowdflower.com/v1/jobs/upload.json?key=%s" % (key)
copy = "https://api.crowdflower.com/v1/jobs/%s/copy.json?key=%s" % (job, key)
order = "http://api.crowdflower.com/v1/jobs/%s/orders.json?key=%s" % (job, key)
obj = json.dumps({"img_url":"http://img.ffffound.com/static-data/assets/6/57014fc01102d5996a04d4d7e5aa5c124f3d959e_m.jpg"})

request = urllib2.Request(copy, obj, {'content-type': 'application/json'})
response = urllib2.urlopen(request)
response = response.read()

# If response has no errors then order the job

copiedJob = json.loads(response).get("id")
url = "http://api.crowdflower.com/v1/jobs/%s/upload.json?key=%s" % (copiedJob, key)
request = urllib2.Request(url, obj, {'content-type': 'application/json'})
response = urllib2.urlopen(request)
response = response.read()

# Need to have the python script that handles callbacks via webhook_uri