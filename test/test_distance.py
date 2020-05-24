from deploy import app
import unittest


class FlaskTestClass(unittest.TestCase):

    def test_distance_request_fromBUs(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media='bus',origin='colombo', destination='matara'))
        self.assertEqual(response.status_code, 200)

    def test_distance_request_fromBUs(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media='train',origin='colomboFort', destination='matara'))
        self.assertEqual(response.status_code, 200)

    # ensure response for /distance is  correct
    def test_response(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media='bus',origin='colombo', destination='matara'))
        self.assertTrue(
            b'From: colombo To: matara the distance from bus is 160.4 km and run time is 04h 45min (a 20 minute driving break is also included)' in response.data)

# ensure response for /distance is  correct
    def test_response(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(media='train',origin='colomboFort', destination='gampaha'))
        self.assertTrue(
            b'From: colomboFort To: Gampaha the distance from train is 28.4km on the track 1' in response.data)

    # ensure response for empty inputs
    def test_empty_inputs(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(destination='matara'))
        self.assertEqual(response.status_code, 400)

    # ensure respose is correct for incorrect inputs
    def test_incorrect_respose(self):
        tester = app.test_client(self)
        response = tester.get(
            '/distance', query_string=dict(origin='aaaaa', destination='bbbbb'))
        self.assertTrue(
            b'sorry!please enter a valid origin and destination:('in response.data)


if __name__ == '__main__':
    unittest.main()
