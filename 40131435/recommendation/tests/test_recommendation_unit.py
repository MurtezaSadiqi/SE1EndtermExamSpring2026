import unittest

from engine import RecommendationEngine


class RecommendationEngineUnitTest(unittest.TestCase):
    def test_score_rewards_matching_user_interests(self):
        engine = RecommendationEngine({
            'cities': ['Kabul'],
            'types': ['Villa'],
            'preferences': {'amenities': ['wifi', 'pool']},
        })

        score = engine.score({
            'city': 'Kabul',
            'type': 'Villa',
            'rating': 4.5,
            'amenities': ['wifi', 'pool', 'parking'],
        })

        self.assertEqual(score, 14.5)

    def test_rank_honours_the_requested_limit(self):
        engine = RecommendationEngine({})
        properties = [{'id': number, 'rating': number} for number in range(25)]

        result = engine.rank(properties, limit=3)

        self.assertEqual([item['id'] for item in result], [24, 23, 22])


if __name__ == '__main__':
    unittest.main()
