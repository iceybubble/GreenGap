"""
Pathway AI Pipeline for GreenGap Intelligence
Real-time sustainability recommendations with RAG
"""

import pathway as pw
from typing import Dict, List
import json

class SustainabilityRAG:
    """RAG system for sustainability recommendations using Pathway"""
    
    def __init__(self):
        print(" Initializing Pathway AI System...")
        self.setup_knowledge_base()
        print(" Pathway AI Ready!")
    
    def setup_knowledge_base(self):
        """Create knowledge base from sustainability documents"""
        
        # Comprehensive sustainability knowledge base
        self.knowledge_docs = [
            {
                "id": 1,
                "content": "The rebound effect occurs when energy efficiency improvements lead to increased usage, offsetting 30-80% of expected savings. Most common in LED lighting, HVAC systems, and fuel-efficient vehicles.",
                "category": "rebound_effect",
                "severity": "high"
            },
            {
                "id": 2,
                "content": "To prevent rebound effects: Implement automated usage schedules, monitor consumption patterns weekly, set usage caps on efficient devices, use smart timers during peak hours, and educate users about behavioral impacts.",
                "category": "prevention",
                "severity": "medium"
            },
            {
                "id": 3,
                "content": "High rebound indicators include: Efficiency score below 50%, increasing usage duration post-upgrade, peak-hour consumption spikes above 30%, weekend usage 20% above baseline, and declining behavior scores.",
                "category": "indicators",
                "severity": "high"
            },
            {
                "id": 4,
                "content": "Energy efficiency best practices: Schedule HVAC during off-peak hours, maximize natural lighting, enable power-saving modes on all devices, track standby power consumption, and use occupancy sensors.",
                "category": "best_practices",
                "severity": "low"
            },
            {
                "id": 5,
                "content": "Carbon offset strategies: Switch to 100% renewable energy providers, invest in rooftop solar panels, participate in verified carbon credit programs, reduce business travel emissions, and support reforestation projects.",
                "category": "carbon_offset",
                "severity": "medium"
            },
            {
                "id": 6,
                "content": "Medium rebound level indicates 40-70% efficiency offset. Recommended actions: Review usage schedules, implement gradual restrictions, increase monitoring frequency, and provide user education on sustainable practices.",
                "category": "medium_rebound",
                "severity": "medium"
            },
            {
                "id": 7,
                "content": "Low rebound level (under 30%) shows effective sustainability. Maintain practices: Continue current automation, share best practices with team, explore advanced efficiency technologies, and set ambitious new targets.",
                "category": "low_rebound",
                "severity": "low"
            },
            {
                "id": 8,
                "content": "Peak hour optimization: Shift high-consumption activities to off-peak times (9 PM - 6 AM), use battery storage during peak hours, enable load balancing systems, and implement demand response programs.",
                "category": "peak_optimization",
                "severity": "medium"
            },
            {
                "id": 9,
                "content": "Behavior improvement strategies: Gamify energy savings with leaderboards, provide real-time consumption feedback, offer incentives for efficiency goals, and create sustainability challenges for teams.",
                "category": "behavior_improvement",
                "severity": "low"
            },
            {
                "id": 10,
                "content": "Critical rebound response: Immediately implement usage caps, send automated alerts for excessive consumption, enable forced power-down during specific hours, and conduct emergency user training sessions.",
                "category": "critical_response",
                "severity": "critical"
            }
        ]
        
        print(f" Loaded {len(self.knowledge_docs)} knowledge documents")
    
    def find_relevant_knowledge(self, user_data: Dict) -> List[Dict]:
        """Find relevant knowledge based on user metrics"""
        
        rebound_level = user_data.get('rebound_level', 'MEDIUM')
        efficiency_score = user_data.get('efficiency_score', 50)
        behavior_score = user_data.get('behavior_score', 50)
        
        relevant_docs = []
        
        # Match based on rebound level
        if rebound_level == 'HIGH':
            relevant_docs.extend([doc for doc in self.knowledge_docs 
                                 if doc['category'] in ['rebound_effect', 'prevention', 'critical_response', 'indicators']])
        elif rebound_level == 'MEDIUM':
            relevant_docs.extend([doc for doc in self.knowledge_docs 
                                 if doc['category'] in ['medium_rebound', 'prevention', 'peak_optimization']])
        else:
            relevant_docs.extend([doc for doc in self.knowledge_docs 
                                 if doc['category'] in ['low_rebound', 'best_practices', 'carbon_offset']])
        
        # Add behavior-specific knowledge
        if behavior_score < 70:
            relevant_docs.extend([doc for doc in self.knowledge_docs 
                                 if doc['category'] == 'behavior_improvement'])
        
        # Remove duplicates
        seen_ids = set()
        unique_docs = []
        for doc in relevant_docs:
            if doc['id'] not in seen_ids:
                unique_docs.append(doc)
                seen_ids.add(doc['id'])
        
        return unique_docs[:5]  # Return top 5 most relevant
    
    def generate_recommendations(self, user_data: Dict) -> List[str]:
        """Generate AI recommendations based on user metrics"""
        
        print(f" Generating recommendations for: {user_data}")
        
        # Find relevant knowledge
        relevant_knowledge = self.find_relevant_knowledge(user_data)
        
        # Extract key information
        rebound_level = user_data['rebound_level']
        efficiency = user_data['efficiency_score']
        behavior = user_data['behavior_score']
        sustainability = user_data['sustainability_index']
        
        # Generate context-aware recommendations
        recommendations = []
        
        # Rule-based intelligent recommendations
        if rebound_level == 'HIGH':
            recommendations.append(
                f"Critical: Implement automated usage controls immediately - your {efficiency}% efficiency is being offset by increased consumption"
            )
            recommendations.append(
                "Set strict usage schedules with 25% reduction targets for high-consumption devices to prevent further rebound"
            )
            if efficiency < 60:
                recommendations.append(
                    "Review all appliance settings for optimization opportunities and enable eco-modes across all devices"
                )
        
        elif rebound_level == 'MEDIUM':
            recommendations.append(
                f"Monitor weekly consumption patterns closely - current {efficiency}% efficiency shows potential for improvement"
            )
            recommendations.append(
                "Enable smart timers to prevent extended usage of energy-efficient appliances during peak hours"
            )
            if behavior < 75:
                recommendations.append(
                    f"Improve behavior score from {behavior}% by tracking daily energy habits and setting device-off reminders"
                )
        
        else:  # LOW rebound
            recommendations.append(
                f"Excellent progress! Maintain current efficient practices - your {sustainability} sustainability index is strong"
            )
            recommendations.append(
                "Explore renewable energy options like solar panels or green energy providers to further reduce carbon footprint"
            )
            if sustainability < 70:
                recommendations.append(
                    "Share your successful sustainability strategies with team members to maximize collective environmental impact"
                )
        
        # Add knowledge-based recommendations
        for doc in relevant_knowledge[:2]:
            # Extract actionable advice from knowledge
            content = doc['content']
            if ':' in content:
                action_part = content.split(':', 1)[1].strip()
                if len(action_part) > 30:
                    recommendations.append(action_part.split('.')[0] + '.')
        
        # Ensure we have at least 2-4 recommendations
        if len(recommendations) < 2:
            recommendations.extend([
                "Monitor consumption patterns weekly and adjust automation settings accordingly",
                "Review energy usage dashboard daily to identify optimization opportunities"
            ])
        
        # Return 2-4 unique recommendations
        unique_recs = list(dict.fromkeys(recommendations))[:4]
        
        print(f" Generated {len(unique_recs)} recommendations")
        return unique_recs
    
    def analyze_real_time(self, metrics_stream):
        """
        Analyze real-time metrics using Pathway
        This would be used for streaming data in production
        """
        # Future: Implement Pathway streaming pipeline
        pass

# Initialize the RAG system (singleton)
print("Initializing GreenGap Pathway AI...")
rag_system = SustainabilityRAG()
print(" GreenGap Pathway AI Ready!\n")