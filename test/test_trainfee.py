from server1 import app
import unittest


class FlaskTestClass(unittest.TestCase):

    # ensure that flask was set up correctly
    def test_index(self):
        tester = app.test_client(self)
        response = tester.get('/trainfee', query_string=dict(
            origin_station='colombo fort', destination_station='maradana'))
        self.assertEqual(response.status_code, 200)

    # ensure response for /busfee is  correct
    def test_response(self):
        tester = app.test_client(self)
        response = tester.get('/trainfee', query_string=dict(
            origin_station='Colombo Fort', destination_station='Maradana'))
        print(response.data)
        self.assertTrue(
            b'From: Colombo Fort To: Maradana on track number 1,    1st class price is Rs: 40    2nd class price is Rs: 20    3rd class price is Rs: 10 ' in response.data)

    # ensure response for empty inputs
    def test_empty_inputs(self):
        tester = app.test_client(self)
        response = tester.get(
            '/trainfee', query_string=dict(destination_station='matara'))
        self.assertEqual(response.status_code, 400)

    # ensure respose is correct for incorrect inputs
    def test_incorrect_respose(self):
        tester = app.test_client(self)
        response = tester.get(
            '/trainfee', query_string=dict(origin_station='wrong', destination_station='wrong'))
        self.assertTrue(
            b'sorry!please enter a valid origin and destination:('in response.data)


if __name__ == '__main__':
    unittest.main()
