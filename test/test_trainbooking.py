import requests
import unittest
import json

class TestCaseName(unittest.TestCase): 
    def test_trainbooking_request(self): 
          details = {"origin":"matara", "destination":"colomboFort","date":"2020-06-04","time":"10:30","seat_type":"1st class"}
          resp=requests.post("https://transportchatbot.herokuapp.com/trainbooking".format(),             
          headers={'Content-Type': 'application/json','Access-Control-Allow-Origin': '*',}, data=json.dumps(details))
          self.assertEqual(resp.status_code, 200)
          
    def test_trainbooking_result(self):
          details = {"origin":"matara", "destination":"colomboFort","date":"2020-06-04","time":"10:30","seat_type":"normal"}
          resp=requests.post("https://transportchatbot.herokuapp.com/trainbooking".format(),             
          headers={'Content-Type': 'application/json','Access-Control-Allow-Origin': '*',}, data=json.dumps(details))
          self.assertEqual(resp.json(), {
          "result":"i will send you a notification of confirmation!", 
          })
    


if __name__ == '__main__':
    unittest.main()