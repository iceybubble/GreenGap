from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from datetime import datetime
from io import BytesIO
import pytz

def generate_pdf_report(data: dict) -> BytesIO:
    """
    Generate a comprehensive PDF sustainability report with explanations
    """
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)
    
    # Container for the 'Flowable' objects
    elements = []
    
    # Define styles
    styles = getSampleStyleSheet()
    
    # Custom title style
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=colors.HexColor('#10b981'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    # Custom heading styles
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1f2937'),
        spaceAfter=12,
        spaceBefore=20,
        fontName='Helvetica-Bold'
    )
    
    # Body text style
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['BodyText'],
        fontSize=11,
        textColor=colors.HexColor('#374151'),
        alignment=TA_JUSTIFY,
        spaceAfter=12,
        leading=16
    )
    
    # Info text style
    info_style = ParagraphStyle(
        'InfoStyle',
        parent=styles['BodyText'],
        fontSize=10,
        textColor=colors.HexColor('#6b7280'),
        alignment=TA_CENTER,
        spaceAfter=20,
        fontStyle='italic'
    )
    
    # Title
    title = Paragraph("GreenGap Sustainability Report", title_style)
    elements.append(title)
    elements.append(Spacer(1, 0.2*inch))
    
    # Get current time in IST (Indian Standard Time) or your timezone
    ist = pytz.timezone('Asia/Kolkata')  # Change to your timezone
    current_time = datetime.now(ist)
    
    # Format timestamp properly
    timestamp = current_time.strftime("%B %d, %Y at %I:%M %p %Z")
    
    # Generated info
    generated_text = f"<b>Generated:</b> {timestamp}<br/><i>Powered by Pathway AI + Google Gemini 2.5</i>"
    generated_para = Paragraph(generated_text, info_style)
    elements.append(generated_para)
    elements.append(Spacer(1, 0.3*inch))
    
    # Executive Summary
    elements.append(Paragraph("Executive Summary", heading_style))
    
    summary_text = f"""
    This report provides a comprehensive analysis of your sustainability performance and rebound effect detection. 
    Your current <b>Sustainability Index is {data.get('sustainability_index', 'N/A')}/100</b>, indicating 
    {'excellent' if float(data.get('sustainability_index', 0)) >= 80 else 'good' if float(data.get('sustainability_index', 0)) >= 60 else 'moderate'} 
    performance. The analysis is powered by advanced AI using Pathway RAG (Retrieval-Augmented Generation) 
    combined with Google Gemini 2.5 to provide accurate, evidence-based insights.
    """
    elements.append(Paragraph(summary_text, body_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Summary Metrics Section
    elements.append(Paragraph("Summary Metrics", heading_style))
    
    summary_cards = data.get('summary_cards', {})
    
    # Create metrics table with explanations
    metrics_data = [
        ['Metric', 'Value', 'Status', 'Explanation'],
        [
            'Sustainability Index',
            str(summary_cards.get('sustainability_index', 'N/A')),
            f"{summary_cards.get('sustainability_index', '0')} / 100",
            'Overall sustainability performance score combining efficiency, behavior, and emissions'
        ],
        [
            'CO₂ Saved',
            f"{summary_cards.get('co2_saved', 'N/A')} kg",
            '✓ Active',
            'Total carbon emissions prevented through efficiency improvements and behavior changes'
        ],
        [
            'Efficiency Score',
            f"{summary_cards.get('efficiency_score', 'N/A')}%",
            'Optimizing',
            'Technical efficiency of your energy-saving equipment and infrastructure upgrades'
        ],
        [
            'Behavior Score',
            f"{summary_cards.get('behavior_score', 'N/A')}%",
            'Improving',
            'User behavioral patterns and adherence to sustainable practices and schedules'
        ],
    ]
    
    metrics_table = Table(metrics_data, colWidths=[1.5*inch, 1.2*inch, 1.2*inch, 3*inch])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10b981')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f3f4f6')]),
        ('ALIGN', (3, 1), (3, -1), 'LEFT'),  # Left align explanation column
        ('LEFTPADDING', (3, 1), (3, -1), 8),
    ]))
    
    elements.append(metrics_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Rebound Effect Analysis
    elements.append(Paragraph("Rebound Effect Analysis", heading_style))
    
    rebound_level = data.get('rebound_level', 'UNKNOWN')
    rebound_percentage = data.get('rebound_percentage', 0)
    corrected_projection = data.get('corrected_projection', 0)
    
    # Rebound explanation based on level
    rebound_explanations = {
        'LOW': 'Excellent! Your behavioral patterns are aligned with efficiency improvements. Less than 30% of expected savings are lost to increased usage.',
        'MEDIUM': 'Caution: Moderate rebound effect detected. 30-60% of expected savings are offset by increased consumption patterns. Behavioral interventions recommended.',
        'HIGH': 'Alert: Significant rebound effect detected. Over 60% of expected savings are lost due to behavioral changes. Immediate action required to prevent efficiency loss.'
    }
    
    rebound_text = f"""
    <b>Status: {rebound_level}</b><br/>
    {rebound_explanations.get(rebound_level, 'Unable to determine rebound effect level.')}<br/><br/>
    Despite efficiency improvements, actual consumption patterns have changed, resulting in a <b>{rebound_percentage}% rebound effect</b>. 
    This means that your real-world CO₂ savings are lower than the theoretical maximum due to behavioral adaptations 
    (Jevons Paradox). Your corrected projection shows <b>{corrected_projection} kg CO₂</b> in actual savings.
    """
    elements.append(Paragraph(rebound_text, body_style))
    elements.append(Spacer(1, 0.2*inch))
    
    # Rebound metrics table
    rebound_data = [
        ['Metric', 'Value', 'Meaning'],
        ['Rebound Level', rebound_level, f'{rebound_level} severity - {rebound_percentage}% efficiency loss detected'],
        ['Rebound Percentage', f'{rebound_percentage}%', 'Portion of expected savings lost to increased usage behavior'],
        ['Expected Savings', f"{summary_cards.get('co2_saved', 'N/A')} kg CO₂", 'Theoretical maximum savings from efficiency improvements alone'],
        ['Corrected Projection', f'{corrected_projection} kg CO₂', 'Actual savings after accounting for behavioral rebound effects'],
    ]
    
    rebound_color = colors.HexColor('#10b981') if rebound_level == 'LOW' else colors.HexColor('#f59e0b') if rebound_level == 'MEDIUM' else colors.HexColor('#ef4444')
    
    rebound_table = Table(rebound_data, colWidths=[1.8*inch, 1.5*inch, 3.5*inch])
    rebound_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#3b82f6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('TOPPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.grey),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#eff6ff')]),
        ('ALIGN', (2, 1), (2, -1), 'LEFT'),
        ('LEFTPADDING', (2, 1), (2, -1), 8),
        ('BACKGROUND', (1, 1), (1, 1), rebound_color),  # Color rebound level cell
        ('TEXTCOLOR', (1, 1), (1, 1), colors.white),
    ]))
    
    elements.append(rebound_table)
    elements.append(Spacer(1, 0.3*inch))
    
    # Behavioral Insights
    elements.append(Paragraph("Behavioral Insights", heading_style))
    
    behavior_reason = data.get('behavior_insights', {}).get('behavior_reason', 'No behavioral data available.')
    behavior_text = f"""
    <b>Key Finding:</b><br/>
    {behavior_reason}<br/><br/>
    <b>Analysis Context:</b><br/>
    This analysis is based on {data.get('knowledge_docs_used', 10)} verified sustainability documents including 
    IPCC climate reports, Energy Star guidelines, and behavioral economics research. The AI system uses 
    Pathway RAG to retrieve relevant context and Google Gemini 2.5 to generate personalized insights.
    """
    elements.append(Paragraph(behavior_text, body_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # AI Recommendations
    elements.append(Paragraph("AI-Generated Recommendations", heading_style))
    
    intro_text = """
    Based on your sustainability profile and detected rebound effects, our AI system recommends the following 
    evidence-based interventions to maximize your CO₂ savings and prevent efficiency loss:
    """
    elements.append(Paragraph(intro_text, body_style))
    elements.append(Spacer(1, 0.1*inch))
    
    recommendations = data.get('recommendations', [])
    for i, rec in enumerate(recommendations, 1):
        rec_text = f"<b>{i}.</b> {rec}"
        elements.append(Paragraph(rec_text, body_style))
        elements.append(Spacer(1, 0.08*inch))
    
    elements.append(Spacer(1, 0.3*inch))
    
    # Emissions Timeline (if available)
    if 'emissions_chart' in data:
        elements.append(Paragraph("Emissions Timeline", heading_style))
        
        chart_data = data['emissions_chart']
        timeline_text = f"""
        Weekly emissions tracking shows the progression from baseline consumption to expected 
        post-efficiency levels, compared with actual measured consumption. The gap between expected 
        and actual emissions reveals the rebound effect magnitude.
        """
        elements.append(Paragraph(timeline_text, body_style))
        elements.append(Spacer(1, 0.2*inch))
        
        # Emissions data table
        labels = chart_data.get('labels', [])
        baseline = chart_data.get('baseline', [])
        expected = chart_data.get('expected', [])
        actual = chart_data.get('actual', [])
        
        emissions_data = [['Period', 'Baseline (kg CO₂)', 'Expected (kg CO₂)', 'Actual (kg CO₂)', 'Gap']]
        
        for i, label in enumerate(labels):
            gap = actual[i] - expected[i] if i < len(actual) and i < len(expected) else 0
            emissions_data.append([
                label,
                f"{baseline[i]:.1f}" if i < len(baseline) else 'N/A',
                f"{expected[i]:.1f}" if i < len(expected) else 'N/A',
                f"{actual[i]:.1f}" if i < len(actual) else 'N/A',
                f"+{gap:.1f}" if gap > 0 else f"{gap:.1f}"
            ])
        
        emissions_table = Table(emissions_data, colWidths=[1.2*inch, 1.5*inch, 1.5*inch, 1.5*inch, 1*inch])
        emissions_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#6b7280')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 10),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
            ('TOPPADDING', (0, 0), (-1, 0), 10),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey),
            ('FONTSIZE', (0, 1), (-1, -1), 9),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
        ]))
        
        elements.append(emissions_table)
    
    # Page break before footer
    elements.append(PageBreak())
    
    # Conclusion
    elements.append(Paragraph("Conclusion & Next Steps", heading_style))
    
    conclusion_text = f"""
    Your sustainability journey shows {'strong' if float(data.get('sustainability_index', 0)) >= 75 else 'moderate'} 
    performance with a sustainability index of <b>{data.get('sustainability_index', 'N/A')}/100</b>. 
    The detected <b>{rebound_level}</b> rebound effect indicates that behavioral interventions are 
    {'not currently needed' if rebound_level == 'LOW' else 'recommended' if rebound_level == 'MEDIUM' else 'urgently required'} 
    to maximize your environmental impact.<br/><br/>
    
    <b>Recommended Actions:</b><br/>
    1. Implement the AI-generated recommendations listed above<br/>
    2. Monitor consumption patterns weekly to detect early rebound signals<br/>
    3. Use automated scheduling and smart controls to prevent overconsumption<br/>
    4. Review this report monthly to track progress and adjust strategies<br/><br/>
    
    <b>Key Takeaway:</b><br/>
    Efficiency improvements alone are not enough. Combining technology upgrades with behavioral awareness 
    and smart automation is essential to achieve true sustainability gains and prevent the rebound effect 
    from undermining your progress.
    """
    elements.append(Paragraph(conclusion_text, body_style))
    elements.append(Spacer(1, 0.3*inch))
    
    # Footer
    footer_text = f"""
    <i>Report ID: {data.get('analysis_id', 'N/A')} | Generated: {timestamp}<br/>
    Powered by GreenGap Intelligence - Pathway AI + Google Gemini 2.5<br/>
    For questions or support: contact@greengap.com</i>
    """
    footer_para = Paragraph(footer_text, info_style)
    elements.append(footer_para)
    
    # Build PDF
    doc.build(elements)
    
    # Get the value of the BytesIO buffer and return it
    pdf = buffer.getvalue()
    buffer.close()
    
    return BytesIO(pdf)