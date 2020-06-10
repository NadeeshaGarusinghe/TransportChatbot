import requests
import unittest
import json

class TestCaseName(unittest.TestCase): 
    def test_traincomplaint_request(self): 
          details = {"complaint_number":"1", "railway_station":"maradana station","date":"2020-06-04","time":"10:30","description":"the train apartment was very dirty"}
          resp=requests.post("https://transportchatbot.herokuapp.com/traincomplaint".format(),             
          headers={'Content-Type': 'application/json','Access-Control-Allow-Origin': '*',}, data=json.dumps(details))
          print (resp)
          self.assertEqual(resp.status_code, 200)
          
    def test_taincomplaint_result(self):
          details = {"complaint_number":"1", "railway_station":"maradana station","date":"2020-06-04","time":"10:30","description":"the train apartment was very dirty"}
          resp=requests.post("https://transportchatbot.herokuapp.com/traincomplaint".format(),             
          headers={'Content-Type': 'application/json','Access-Control-Allow-Origin': '*',}, data=json.dumps(details))
          self.assertEqual(resp.json(), {
          "result":"i will send a report to authority regarding the given information.", 
          })
    


if __name__ == '__main__':
    unittest.main()