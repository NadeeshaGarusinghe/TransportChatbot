from server1 import app
import unittest


class FlaskTestClass(unittest.TestCase):

    # ensure that flask was set up correctly
    def test_index(self):
        tester = app.test_client(self)
        response = tester.get(
            '/busfee', query_string=dict(origin='colombo', destination='matara'))
        self.assertEqual(response.status_code, 200)

    # ensure response for /busfee is  correct
    def test_response(self):
        tester = app.test_client(self)
        response = tester.get(
            '/busfee', query_string=dict(origin='colombo', destination='matara'))
        self.assertTrue(
            b'From: COLOMBO To: MATARA Normal bus fees is Rs: 223 semi luxary bus fees is Rs: 335 air conditioned bus fees is Rs: 445' in response.data)

    # ensure response for empty inputs
    def test_empty_inputs(self):
        tester = app.test_client(self)
        response = tester.get(
            '/busfee', query_string=dict(destination='matara'))
        self.assertEqual(response.status_code, 400)

    # ensure respose is correct for incorrect inputs
    def test_incorrect_respose(self):
        tester = app.test_client(self)
        response = tester.get(
            '/busfee', query_string=dict(origin='aaaaa', destination='bbbbb'))
        self.assertTrue(
            b'sorry!please enter a valid origin and destination:('in response.data)


if __name__ == '__main__':
    unittest.main()
