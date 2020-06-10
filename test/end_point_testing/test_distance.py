from deploy import app
import unittest


class FlaskTestClass(unittest.TestCase):

    def test_distance_request_fromBUs(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media='bus',origin='colombo', destination='matara'))
        self.assertEqual(response.status_code, 200)

    def test_distance_request_fromTrain(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media='train',origin='colomboFort', destination='matara'))
        self.assertEqual(response.status_code, 200)

    # ensure response for /distance is  correct
    def test_responseBUs(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media='bus',origin='colombo', destination='matara'))
        self.assertTrue(
            b'From: colombo To: matara the distance from bus is 160.4 km and run time is 04h 45min (a 20 minute driving break is also included)' in response.data)

# ensure response for /distance is  correct
    def test_responseTrain(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media='train',origin='gampaha', destination='colombofort'))
        self.assertTrue(
            b'From: gampaha  To: colombofort  the distance from train is 28.4km   on the track  1' in response.data)

    # ensure response for empty inputs
    def test_empty_inputs(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media='bus',destination='matara'))
        self.assertEqual(response.status_code, 400)

    # ensure respose is correct for incorrect inputs
    def test_incorrect_resposeBUs(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media = 'bus',origin='aaaaa', destination='bbbbb'))
        self.assertTrue(
            b'sorry!please enter a valid origin and destination:('in response.data)

    # ensure respose is correct for incorrect inputs
    def test_incorrect_resposeTrain(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media = 'train',origin='aaaaa', destination='bbbbb'))
        self.assertTrue(
            b'sorry!please enter a valid origin and destination:('in response.data)

if __name__ == '__main__':
    unittest.main()
