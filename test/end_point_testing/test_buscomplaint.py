import requests
import unittest
import json

class TestCaseName(unittest.TestCase): 
    def test_buscomplaint_request(self): 
          details = {"bus_number":"1", "route_number":"1","date":"2020-06-04","time":"10:30","description":"the bus was too slow "}
          resp=requests.post("https://transportchatbot.herokuapp.com/buscomplaint".format(),             
          headers={'Content-Type': 'application/json','Access-Control-Allow-Origin': '*',}, data=json.dumps(details))
          self.assertEqual(resp.status_code, 200)
          
    def test_buscomplaint_result(self):
          details = {"bus_number":"1", "route_number":"1","date":"2020-06-04","time":"10:30","description":"the bus was too slow "}
          resp=requests.post("https://transportchatbot.herokuapp.com/buscomplaint".format(),             
          headers={'Content-Type': 'application/json','Access-Control-Allow-Origin': '*',}, data=json.dumps(details))
          self.assertEqual(resp.json(), {
          "result":"i will send a report to authority regarding the given information.", 
          })
    


if __name__ == '__main__':
    unittest.main()