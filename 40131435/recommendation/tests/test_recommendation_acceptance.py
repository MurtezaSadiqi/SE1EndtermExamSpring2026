import unittest

from engine import RecommendationEngine


class RecommendationAcceptanceTest(unittest.TestCase):
    def test_user_receives_most_relevant_property_first(self):
        profile = {'preferences': {'cities': ['Herat'], 'amenities': ['wifi']}}
        available_properties = [
            {'id': 'kabul-flat', 'city': 'Kabul', 'type': 'Apartment', 'rating': 5, 'amenities': []},
            {'id': 'herat-home', 'city': 'Herat', 'type': 'House', 'rating': 3, 'amenities': ['wifi']},
        ]

        response = RecommendationEngine(profile).rank(available_properties)

        self.assertEqual(response[0]['id'], 'herat-home')
        self.assertGreater(response[0]['recommendation_score'], response[1]['recommendation_score'])


if __name__ == '__main__':
    unittest.main()
