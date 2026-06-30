from typing import Any


class RecommendationEngine:
    """Ranks properties using a user's explicit and inferred interests."""

    def __init__(self, profile: dict[str, Any]):
        preferences = profile.get('preferences') or {}
        self.cities = set(profile.get('cities') or []) | set(preferences.get('cities', []))
        self.types = set(profile.get('types') or []) | set(preferences.get('types', []))
        self.amenities = set(preferences.get('amenities', []))

    def score(self, property_: dict[str, Any]) -> float:
        value = float(property_.get('rating') or 0)
        value += 4 if property_.get('city') in self.cities else 0
        value += 3 if property_.get('type') in self.types else 0
        value += len(self.amenities.intersection(property_.get('amenities') or [])) * 1.5
        return round(value, 2)

    def rank(self, properties: list[dict[str, Any]], limit: int = 20):
        scored = ({**item, 'recommendation_score': self.score(item)} for item in properties)
        return sorted(scored, key=lambda item: item['recommendation_score'], reverse=True)[:limit]
