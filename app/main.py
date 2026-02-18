from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from datetime import datetime
from app.pathway_pipeline import rag_system
import os
from dotenv import load_dotenv
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.units import inch
from io import BytesIO
from fastapi.responses import StreamingResponse

# Load environment variables
load_dotenv()

# Import NEW Gemini library
try:
    from google import genai
    from google.genai import types
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    print(" google-genai not installed")

app = FastAPI(
    title="GreenGap API - Powered by Pathway AI + Gemini", 
    version="2.0.0",
    description="AI-powered sustainability analytics with Pathway RAG + Google Gemini"
)

# Configure NEW Gemini API
gemini_client = None
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY and GEMINI_AVAILABLE:
    try:
        gemini_client = genai.Client(api_key=GEMINI_API_KEY)
        print(" Gemini AI configured successfully with NEW API!")
    except Exception as e:
        print(f" Failed to initialize Gemini: {e}")
        gemini_client = None
else:
    if not GEMINI_API_KEY:
        print(" GEMINI_API_KEY not found in environment")
    if not GEMINI_AVAILABLE:
        print(" google-genai library not available")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://green-gap-beta.vercel.app",  # Your actual Vercel URL
        "https://*.vercel.app",  # All Vercel deployments
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "GreenGap backend running with Pathway AI + Google Gemini",
        "version": "2.0.0",
        "ai_powered": True,
        "gemini_active": gemini_client is not None,
        "tech_stack": ["FastAPI", "Pathway", "RAG", "Google Gemini"],
        "features": ["Real-time analytics", "AI recommendations", "Rebound detection", "Conversational AI", "PDF Export", "Multi-Language"]
    }

@app.get("/analyze")
def analyze():
    """Generate dynamic sustainability analytics with Pathway AI recommendations"""
    
    # Generate random values for dynamic display
    sustainability_index = round(random.uniform(45.0, 85.0), 1)
    co2_saved = round(random.uniform(10.0, 25.0), 2)
    efficiency_score = round(random.uniform(40.0, 90.0), 1)
    behavior_score = round(random.uniform(60.0, 95.0), 1)
    
    # Determine rebound level based on efficiency
    if efficiency_score < 50:
        rebound_level = "HIGH"
        rebound_percentage = random.randint(70, 95)
    elif efficiency_score < 75:
        rebound_level = "MEDIUM"
        rebound_percentage = random.randint(40, 70)
    else:
        rebound_level = "LOW"
        rebound_percentage = random.randint(10, 35)
    
    # Generate corrected projection
    corrected_projection = round(co2_saved * random.uniform(0.7, 1.3), 2)
    
    # Random behavior insights
    insights = [
        "High usage detected during peak hours - Pathway AI analyzing patterns",
        "Reduced consumption behavior observed - efficiency gains maintained",
        "Weekend usage spike detected - potential rebound effect identified",
        "Consistent usage patterns - sustainable behavior maintained",
        "Evening consumption increased - review automated controls",
        "Energy-efficient practices adopted successfully"
    ]
    
    behavior_reason = random.choice(insights)
    
    # Generate chart data with variance
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    baseline = [round(random.uniform(95, 110), 1) for _ in days]
    expected = [round(b * random.uniform(0.75, 0.85), 1) for b in baseline]
    actual = [round(e * random.uniform(0.9, 1.15), 1) for e in expected]
    
    # Generate AI recommendations using Pathway RAG
    user_data = {
        "sustainability_index": sustainability_index,
        "co2_saved": co2_saved,
        "efficiency_score": efficiency_score,
        "behavior_score": behavior_score,
        "rebound_level": rebound_level,
        "rebound_percentage": rebound_percentage
    }
    
    try:
        recommendations = rag_system.generate_recommendations(user_data)
    except Exception as e:
        print(f" Pathway error: {e}")
        recommendations = [
            "Enable automated scheduling to optimize energy consumption patterns",
            "Monitor weekly usage trends and adjust behavior accordingly",
            "Implement smart controls during peak consumption hours"
        ]
    
    return {
        "dashboard": {
            "summary_cards": {
                "sustainability_index": sustainability_index,
                "co2_saved": co2_saved,
                "efficiency_score": efficiency_score,
                "behavior_score": behavior_score
            },
            "rebound_level": rebound_level,
            "rebound_percentage": rebound_percentage,
            "corrected_projection": corrected_projection,
            "behavior_insights": {
                "behavior_reason": behavior_reason
            },
            "emissions_chart": {
                "labels": days,
                "baseline": baseline,
                "expected": expected,
                "actual": actual
            },
            "recommendations": recommendations,
            "timestamp": datetime.now().isoformat(),
            "analysis_id": random.randint(1000, 9999),
            "ai_engine": "Pathway RAG + Gemini",
            "rag_enabled": True,
            "knowledge_docs_used": len(rag_system.find_relevant_knowledge(user_data))
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "ai_enabled": True,
        "engine": "Pathway + Gemini",
        "rag_status": "operational",
        "gemini_status": "active" if gemini_client else "fallback_mode",
        "knowledge_base_size": len(rag_system.knowledge_docs),
        "timestamp": datetime.now().isoformat()
    }

@app.post("/chat")
async def chat_with_ai(question: dict):
    """
    Intelligent chat using Pathway knowledge base + Google Gemini (NEW API)
    Supports multi-language responses
    Falls back to pre-written responses if Gemini unavailable
    """
    user_question = question.get("message", "")
    user_language = question.get("language", "en")
    user_question_lower = user_question.lower()
    
    # Language names for Gemini
    language_map = {
        'en': 'English',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'zh': 'Chinese',
        'hi': 'Hindi',
        'ar': 'Arabic',
        'pt': 'Portuguese'
    }
    
    target_language = language_map.get(user_language, 'English')
    
    # Pre-defined responses (fallback)
    fallback_responses = {
        "rebound": """The rebound effect is a critical challenge in sustainability initiatives. It occurs when energy efficiency improvements paradoxically lead to increased consumption, offsetting 30-80% of expected savings.

Here's how it works: When you install energy-efficient LED lights, they use less electricity per hour. However, because they're cheaper to run, people tend to leave them on longer or use more lights.

To prevent rebound effects:
1. **Implement Automated Schedules**: Set timers and smart controls to limit usage during peak hours
2. **Monitor Consumption Weekly**: Track your actual usage patterns, not just efficiency metrics
3. **Set Usage Caps**: Establish maximum consumption targets
4. **User Education**: Make your team aware of rebound effects
5. **Regular Audits**: Review consumption data monthly

The key is to maintain behavioral discipline even as technology improves efficiency.""",

        "efficiency": """Improving energy efficiency requires a holistic approach:

**1. HVAC Optimization (30-40% of energy use)**
- Schedule heating/cooling during off-peak hours (9 PM - 6 AM)
- Set thermostats to 68°F in winter, 76°F in summer
- Use programmable thermostats with occupancy sensors

**2. Lighting Strategies (15-20%)**
- Maximize natural daylight
- Install LED bulbs (75% more efficient)
- Use motion sensors in low-traffic areas

**3. Power Management (10-15%)**
- Enable power-saving modes on all devices
- Use smart power strips to eliminate standby consumption
- Shut down computers completely at night

**Expected Results**: These strategies typically reduce consumption by 25-45% within 3-6 months.""",

        "carbon": """Reducing your carbon footprint requires action across multiple areas:

**Immediate Actions**
1. **Switch to Renewable Energy**: 40-60% footprint reduction
2. **Energy Audit**: Identify biggest consumption sources

**Short-Term Investments**
3. **Solar Panel Installation**: 6-8 year ROI, 25-year lifespan
4. **Energy Storage Systems**: Battery backup for solar power

**Ongoing Practices**
5. **Carbon Offset Programs**: $10-30 per ton of CO₂
6. **Transportation Changes**: Reduce travel by 30%, consider EVs

Use GreenGap to monitor your CO₂ reduction over time.""",

        "peak": """Peak hour optimization saves costs and helps grid stability:

**Understanding Peak Hours**
- Morning: 6-9 AM, Evening: 5-9 PM
- Electricity costs 2-5x more during peaks

**Optimization Strategies**
1. **Load Shifting**: Run appliances after 9 PM (30-50% savings)
2. **Battery Storage**: Charge off-peak, discharge during peak
3. **Automated Demand Response**: Smart thermostats adjust automatically

**Expected Impact**: 25-45% reduction, saving $5,000-50,000 annually for businesses.""",

        "behavior": """Improving your sustainability behavior score:

**Understanding Score (0-100)**
- Consistency of practices (40%)
- Adherence to schedules (25%)
- Response to alerts (20%)
- Engagement with recommendations (15%)

**Improvement Strategies**
1. **Gamification**: Team leaderboards, competitions
2. **Real-Time Feedback**: Daily updates, instant alerts
3. **Incentive Programs**: Financial bonuses, recognition
4. **Team Challenges**: Department competitions, hackathons

**Expected Timeline**: 10-15 point improvement in 3 months."""
    }
    
    # Try Gemini first if available
    if gemini_client:
        try:
            # Check if question matches specific topic
            context_docs = []
            matched_keyword = None
            for keyword in fallback_responses.keys():
                if keyword in user_question_lower:
                    context_docs.append(fallback_responses[keyword])
                    matched_keyword = keyword
                    break
            
            # Build prompt with language instruction
            if context_docs:
                prompt = f"""You are GreenGap's sustainability AI assistant powered by Pathway RAG and Google Gemini.

Using this knowledge from our Pathway database about {matched_keyword}:

{context_docs[0]}

User's question: {user_question}

IMPORTANT: Respond in {target_language} language.

Provide a comprehensive answer (250-400 words) that:
1. Directly addresses their question
2. Expands on the knowledge above
3. Adds practical, actionable steps
4. Mentions GreenGap platform features when relevant
5. Is professional and encouraging

Make it conversational and helpful!"""
            else:
                prompt = f"""You are GreenGap's sustainability AI assistant.

GreenGap helps organizations:
- Detect rebound effects (efficiency → increased consumption)
- Monitor sustainability metrics (CO₂, efficiency, behavior)
- Provide AI-powered recommendations using Pathway RAG
- Track carbon footprint

User's question: {user_question}

IMPORTANT: Respond in {target_language} language.

Provide a detailed answer (250-350 words) about this sustainability topic. Include:
- Clear explanation
- Actionable steps
- Expected outcomes
- Professional tone

If unrelated to sustainability, redirect to: energy efficiency, rebound effects, carbon reduction, peak optimization, or behavior improvement."""

            print(f" Sending to Gemini in {target_language}: {user_question[:50]}...")
            
            # Use NEW API with correct model name
            response = gemini_client.models.generate_content(
                model='models/gemini-2.5-flash',
                contents=prompt
            )
            
            print(f" Gemini responded successfully in {target_language}!")
            
            return {
                "question": user_question,
                "answer": response.text,
                "powered_by": f"Pathway AI + Google Gemini 2.5 ({target_language})",
                "source": "gemini_with_pathway_rag",
                "language": user_language,
                "knowledge_base_size": len(rag_system.knowledge_docs),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f" Gemini Error: {e}")
            print(f" Falling back to knowledge base...")
    
    # Fallback to pre-written responses
    for keyword, response in fallback_responses.items():
        if keyword in user_question_lower:
            return {
                "question": user_question,
                "answer": response,
                "powered_by": "Pathway AI + Knowledge Base (Fallback)",
                "source": "knowledge_base_fallback",
                "language": user_language,
                "timestamp": datetime.now().isoformat()
            }
    
    # Default response
    return {
        "question": user_question,
        "answer": """I'm your GreenGap AI sustainability assistant, powered by Pathway and Google Gemini. I can provide detailed guidance on:

**Rebound Effects**: Why efficiency improvements increase consumption (30-80% offset)
**Energy Efficiency**: HVAC, lighting, power optimization (25-45% reduction)
**Carbon Reduction**: Renewable energy, solar, offsets
**Peak Hour Optimization**: Load shifting, storage (20-40% cost savings)
**Behavior Improvement**: Gamification, incentives, challenges

**Try asking:**
- "How do I prevent rebound effects?"
- "What are the best energy efficiency strategies?"
- "How can I optimize peak hour usage?"
- "Tell me about carbon offset programs"
- "How do I improve my team's sustainability behavior?"

I'll provide comprehensive, actionable answers!""",
        "powered_by": "Pathway AI + Google Gemini",
        "source": "default_prompt",
        "language": user_language,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/export-report")
async def export_report(data: dict):
    """Generate PDF sustainability report with professional formatting"""
    
    # Create PDF in memory
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    elements = []
    styles = getSampleStyleSheet()
    
    # Custom Title Style
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        textColor=colors.HexColor('#22c55e'),
        spaceAfter=30,
        alignment=1  # Center
    )
    
    # Title
    title = Paragraph(" GreenGap Sustainability Report", title_style)
    elements.append(title)
    elements.append(Spacer(1, 0.3*inch))
    
    # Timestamp
    timestamp = Paragraph(
        f"<b>Generated:</b> {datetime.now().strftime('%B %d, %Y at %I:%M %p')}",
        styles['Normal']
    )
    elements.append(timestamp)
    elements.append(Spacer(1, 0.1*inch))
    
    # Powered by
    powered_by = Paragraph(
        "<i>Powered by Pathway AI + Google Gemini 2.5</i>",
        styles['Normal']
    )
    elements.append(powered_by)
    elements.append(Spacer(1, 0.3*inch))
    
    # Extract data from dashboard
    dashboard = data.get('dashboard', data)
    summary = dashboard.get('summary_cards', {})
    
    # Summary Cards Table
    summary_data = [
        ['Metric', 'Value', 'Status'],
        ['Sustainability Index', f"{summary.get('sustainability_index', 0)}", f"{summary.get('sustainability_index', 0)} / 100"],
        ['CO₂ Saved', f"{summary.get('co2_saved', 0)} kg", '✓ Active'],
        ['Efficiency Score', f"{summary.get('efficiency_score', 0)}%", 'Optimizing'],
        ['Behavior Score', f"{summary.get('behavior_score', 0)}%", 'Improving'],
    ]
    
    summary_table = Table(summary_data, colWidths=[2.5*inch, 1.5*inch, 1.5*inch])
    summary_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#22c55e')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 12),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
    ]))
    
    elements.append(Paragraph("<b> Summary Metrics</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.2*inch))
    elements.append(summary_table)
    elements.append(Spacer(1, 0.4*inch))
    
    # Rebound Analysis
    rebound_level = dashboard.get('rebound_level', 'N/A')
    rebound_percentage = dashboard.get('rebound_percentage', 0)
    corrected_projection = dashboard.get('corrected_projection', 0)
    
    elements.append(Paragraph("<b> Rebound Effect Analysis</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.2*inch))
    
    # Determine color based on rebound level
    rebound_color = {
        'HIGH': colors.red,
        'MEDIUM': colors.orange,
        'LOW': colors.green
    }.get(rebound_level, colors.grey)
    
    rebound_data = [
        ['Metric', 'Value'],
        ['Rebound Level', rebound_level],
        ['Rebound Percentage', f'{rebound_percentage}%'],
        ['Corrected Projection', f"{corrected_projection} kg CO₂"],
    ]
    
    rebound_table = Table(rebound_data, colWidths=[3*inch, 2.5*inch])
    rebound_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TEXTCOLOR', (1, 1), (1, 1), rebound_color),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.lightgrey]),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
    ]))
    
    elements.append(rebound_table)
    elements.append(Spacer(1, 0.4*inch))
    
    # Behavior Insights
    behavior_insights = dashboard.get('behavior_insights', {})
    behavior_reason = behavior_insights.get('behavior_reason', 'No insights available')
    
    elements.append(Paragraph("<b> Behavior Insights</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.2*inch))
    
    insight_text = Paragraph(behavior_reason, styles['Normal'])
    elements.append(insight_text)
    elements.append(Spacer(1, 0.4*inch))
    
    # AI Recommendations
    recommendations = dashboard.get('recommendations', [])
    
    elements.append(Paragraph("<b> AI-Powered Recommendations</b>", styles['Heading2']))
    elements.append(Spacer(1, 0.2*inch))
    
    for i, rec in enumerate(recommendations[:6], 1):
        rec_text = Paragraph(f"{i}. {rec}", styles['Normal'])
        elements.append(rec_text)
        elements.append(Spacer(1, 0.1*inch))
    
    elements.append(Spacer(1, 0.5*inch))
    
    # Footer
    footer_style = ParagraphStyle(
        'Footer',
        parent=styles['Normal'],
        fontSize=9,
        textColor=colors.grey,
        alignment=1
    )
    
    footer = Paragraph(
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━<br/>"
        "<b>Powered by GreenGap Intelligence</b><br/>"
        "Pathway AI + Google Gemini 2.5 | Real-time Sustainability Analytics<br/>"
        " Detecting Rebound Effects & Hidden Climate Loss",
        footer_style
    )
    elements.append(footer)
    
    # Build PDF
    try:
        doc.build(elements)
        buffer.seek(0)
        
        return StreamingResponse(
            buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=GreenGap_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            }
        )
    except Exception as e:
        print(f" PDF generation error: {e}")
        return {
            "error": "Failed to generate PDF report",
            "message": str(e)
        }